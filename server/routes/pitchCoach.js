import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import User from '../models/User.js';
import PitchSession from '../models/PitchSession.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Mock response generation if Anthropic API key is missing
function generateMockAIResponse(userIdea, category, messages) {
  const lastUserMessage = messages[messages.length - 1].content.toLowerCase();
  
  if (lastUserMessage.includes('report') || lastUserMessage.includes('feedback') || lastUserMessage.includes('evaluate') || lastUserMessage.includes('score')) {
    return `Here is your comprehensive Feedback Report. I have assessed your startup idea: "${userIdea}" in the category of "${category}".

<feedback_report>
{
  "scores": {
    "clarity": 8,
    "marketUnderstanding": 7,
    "valueProposition": 8,
    "storytelling": 7,
    "overall": 8
  },
  "keyStrength": "Strong identification of a paint-point problem and a clear initial description of the core solution.",
  "criticalGap": "Lack of detailed customer acquisition plans and detailed unit economics showing path to profitability.",
  "actionItems": [
    "Conduct interviews with at least 15 potential target customers to validate the severity of the problem.",
    "Formulate a detailed pricing strategy and calculate Customer Acquisition Cost (CAC) vs Lifetime Value (LTV).",
    "Refine the elevator pitch to focus heavily on the unique unfair advantage."
  ]
}
</feedback_report>

I hope this structured feedback helps you refine your pitch! What specific part of this report would you like to discuss or improve first?`;
  }

  // Simple conversation response
  const responses = [
    `That is an interesting angle for your ${category} startup. Who do you see as your ideal first customer? How do they solve this problem today?`,
    `Fascinating. How severe is this pain point for them? Do they currently pay for alternative solutions, and if so, how much?`,
    `Let's talk about scalability. What is your primary channel for acquiring these customers, and how do you plan to keep customer acquisition costs low?`,
    `Understood. Pitching this to investors will require a very clear value proposition. If you had to explain the core value in one sentence, what would it be?`,
    `That's a solid start. Whenever you feel ready, you can ask me to generate your Feedback Report to get a breakdown of your scores!`
  ];

  // Pick response based on conversation length
  const index = Math.floor(messages.length / 2) % responses.length;
  return responses[index];
}

// GET history of conversations for user
router.get('/history', auth, async (req, res) => {
  try {
    let session = await PitchSession.findOne({ userId: req.user.id });
    if (!session) {
      // Create an initial empty session
      session = await PitchSession.create({
        userId: req.user.id,
        messages: []
      });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST send message
router.post('/message', auth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find or create session
    let session = await PitchSession.findOne({ userId: user._id });
    if (!session) {
      session = new PitchSession({ userId: user._id, messages: [] });
    }

    // Append user message
    session.messages.push({ role: 'user', content: message });

    // Build the system prompt
    const systemPrompt = `You are an expert startup investor pitch coach. The user is an entrepreneur.
Ask probing questions to understand their business, challenge weak assumptions, help them sharpen their pitch. Be direct but constructive.
After enough context, or when the user explicitly asks for feedback, scores, or a report, generate a Feedback Report.

USER PROFILE CONTEXT:
- Startup Idea: "${user.startupIdea || 'Not described yet'}"
- Category: "${user.category || 'Not specified'}"
- Region: "${user.region}"

CRITICAL INSTRUCTION FOR FEEDBACK REPORT:
When you generate the Feedback Report, you MUST wrap a structured JSON object inside a <feedback_report> tag like this:
<feedback_report>
{
  "scores": {
    "clarity": 8,
    "marketUnderstanding": 7,
    "valueProposition": 9,
    "storytelling": 6,
    "overall": 8
  },
  "keyStrength": "Describe the main strength here.",
  "criticalGap": "Describe the main gap here.",
  "actionItems": [
    "Action item 1",
    "Action item 2",
    "Action item 3"
  ]
}
</feedback_report>
Only output the JSON inside this block. Do not include markdown inside the <feedback_report> tags. Outside the tags, you can write natural friendly follow-up or introductory remarks.`;

    let assistantContent = '';

    // Check if Claude API key is set
    if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'placeholder_claude_api_key') {
      try {
        const anthropic = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY
        });

        // Format history for Anthropic API
        const apiMessages = session.messages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));

        const response = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022', // Standard Claude 3.5 Sonnet
          max_tokens: 1500,
          system: systemPrompt,
          messages: apiMessages
        });

        assistantContent = response.content[0].text;
      } catch (apiError) {
        console.error('Claude API Error, falling back to Mock:', apiError);
        assistantContent = generateMockAIResponse(user.startupIdea, user.category, session.messages);
      }
    } else {
      // Fallback to Mock AI
      assistantContent = generateMockAIResponse(user.startupIdea, user.category, session.messages);
    }

    // Check if there is a feedback report in the response
    const reportMatch = assistantContent.match(/<feedback_report>([\s\S]*?)<\/feedback_report>/);
    let parsedFeedback = null;

    if (reportMatch) {
      try {
        parsedFeedback = JSON.parse(reportMatch[1].trim());
        session.feedbackReport = parsedFeedback;
      } catch (parseError) {
        console.error('Failed to parse feedback report JSON:', parseError, reportMatch[1]);
      }
    }

    // Save assistant message to history
    session.messages.push({ role: 'assistant', content: assistantContent });
    await session.save();

    res.json({
      reply: assistantContent,
      feedbackReport: session.feedbackReport,
      session
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
