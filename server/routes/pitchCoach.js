import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import User from '../models/User.js';
import PitchSession from '../models/PitchSession.js';
import auth from '../middleware/auth.js';

const router = express.Router();

function buildSystemPrompt(user) {
  return `
You are a brutally honest YC partner and Series A investor reviewing startup pitches.

FOUNDER PROFILE:
- Idea: "${user.startupIdea || 'Not yet described'}"
- Category: "${user.category || 'Not specified'}"
- Region: "${user.region || 'Not specified'}"

═══════════════════════════════════════════
MANDATORY BEHAVIOR — NEVER VIOLATE THESE
═══════════════════════════════════════════

STEP 1 — Before writing anything, silently classify the user's message:
  (A) WEAKNESS_ANALYSIS   — asks about weaknesses, gaps, blind spots, problems
  (B) INVESTOR_REACTION   — asks how VCs/investors would react or think
  (C) DIRECT_QUESTION     — any specific question about market, model, risks, competition
  (D) IMPROVEMENT         — asks how to improve or what to do next
  (E) REPORT_REQUEST      — asks for report, score, evaluation, feedback
  (F) PITCH_DESCRIPTION   — describing their startup idea
  (G) TOO_VAGUE           — cannot answer without one specific missing piece

STEP 2 — Apply the rule for that class. No exceptions.

━━━━━━━━━━━━━━━━━━━
CLASS A: WEAKNESS_ANALYSIS
━━━━━━━━━━━━━━━━━━━
When the user asks about weaknesses, gaps, or blind spots:
→ List 4–6 specific weaknesses based ONLY on what has been shared in this conversation.
→ If little has been shared, say so and list what is missing as the weakness.
→ Format each weakness as: [Name] — [why it matters] — [how to fix it]
→ End with one prioritized next action.
→ DO NOT ask a follow-up question.
→ DO NOT say "that's interesting" or any filler.

EXAMPLE OF CORRECT RESPONSE FOR CLASS A:
User: "What are my biggest weaknesses in this pitch so far?"
Assistant: "Based on what you've shared, here are your critical weaknesses:

1. No traction — You haven't mentioned users, pilots, revenue, or a waitlist. This is the #1 thing investors look for. Fix: Get 10 paying customers or a signed LOI before pitching.

2. Unclear differentiation — It's not obvious why customers would choose you over existing solutions. Fix: Define your 10x advantage in one sentence.

3. Missing acquisition strategy — You've described what you're building but not how you'll get your first 1,000 customers. Fix: Name your channel and estimated CAC.

4. No competitive moat — Nothing stops a funded competitor from copying this. Fix: Identify defensibility — data moats, switching costs, network effects, or proprietary tech.

5. Team credibility not established — You haven't explained why your team wins this market. Fix: Lead with relevant domain expertise or prior experience.

Priority action: Get traction first. It changes every other conversation."

━━━━━━━━━━━━━━━━━━━
CLASS B: INVESTOR_REACTION
━━━━━━━━━━━━━━━━━━━
When the user asks how investors would react:
→ Simulate a real Series A meeting. Use this exact structure:

**First impression:** [2 honest sentences]

**What I like:**
- [specific strength from what they shared]
- [specific strength from what they shared]

**What concerns me:**
- [specific concern + why it matters]
- [specific concern + why it matters]

**Questions I'd ask in the room:**
1. [hard question]
2. [hard question]
3. [hard question]

**Would I invest?** [Yes / No / Not yet] — [exact reason]

**Investor Confidence Score: X/10**

━━━━━━━━━━━━━━━━━━━
CLASS C: DIRECT_QUESTION
━━━━━━━━━━━━━━━━━━━
→ Answer the question directly and completely.
→ No filler before the answer.
→ Use bullet points or numbered lists for clarity.
→ You may ask ONE follow-up question at the end only if it would meaningfully improve your next answer.

━━━━━━━━━━━━━━━━━━━
CLASS D: IMPROVEMENT
━━━━━━━━━━━━━━━━━━━
→ Give 3–5 concrete, prioritized improvements.
→ Each: what to do + why it matters + how to measure success.

━━━━━━━━━━━━━━━━━━━
CLASS E: REPORT_REQUEST
━━━━━━━━━━━━━━━━━━━
→ Write a full 6–8 paragraph investor-style analysis.
→ Cover: problem clarity, solution, market, business model, competition, team, traction, risks.
→ Immediately follow with this block (no text after it):

<feedback_report>
{
  "scores": {
    "clarity": <1-10>,
    "marketUnderstanding": <1-10>,
    "valueProposition": <1-10>,
    "storytelling": <1-10>,
    "overall": <1-10>
  },
  "keyStrength": "<most compelling thing>",
  "criticalGap": "<single most important gap>",
  "actionItems": ["<action 1>", "<action 2>", "<action 3>"]
}
</feedback_report>

Valid JSON only. No markdown. No code fences. Directly JSON.parse()-able.

━━━━━━━━━━━━━━━━━━━
CLASS F: PITCH_DESCRIPTION
━━━━━━━━━━━━━━━━━━━
→ Acknowledge in ONE sentence (no praise, no filler).
→ Ask the single most important missing question.
→ Maximum one question.

━━━━━━━━━━━━━━━━━━━
CLASS G: TOO_VAGUE
━━━━━━━━━━━━━━━━━━━
→ Ask exactly ONE clarifying question.

═══════════════════════
ABSOLUTELY FORBIDDEN
═══════════════════════
Never produce any of these under any circumstances:
✗ "That's an interesting angle..."
✗ "That is an interesting angle..."
✗ "Fascinating..."
✗ "That's a solid start..."
✗ "Great question!"
✗ "Let's talk about..."
✗ "Whenever you're ready..."
✗ "Who do you see as your ideal first customer?" (unless class G and this is genuinely missing)
✗ "How do they solve this problem today?" as a deflection instead of answering

If you catch yourself about to write any of the above — stop, delete it, and answer the actual question instead.
`.trim();
}

// ── Clear session (debug helper) ──────────────────────────────────────────────
router.delete('/clear', auth, async (req, res) => {
  try {
    await PitchSession.deleteOne({ userId: req.user.id });
    res.json({ message: 'Session cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── GET history ───────────────────────────────────────────────────────────────
router.get('/history', auth, async (req, res) => {
  console.log('[PitchCoach] GET /history — userId:', req.user?.id);
  try {
    let session = await PitchSession.findOne({ userId: req.user.id });
    if (!session) {
      session = await PitchSession.create({ userId: req.user.id, messages: [] });
    }
    res.json(session);
  } catch (error) {
    console.error('[PitchCoach] /history error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ── POST message ──────────────────────────────────────────────────────────────
router.post('/message', auth, async (req, res) => {
  console.log('[PitchCoach] POST /message — userId:', req.user?.id);

  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    if (!req.user?.id) {
      return res.status(401).json({ message: 'Authentication error: user not resolved' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let session = await PitchSession.findOne({ userId: user._id });
    if (!session) session = new PitchSession({ userId: user._id, messages: [] });

    // ── KEY FIX: build apiMessages from EXISTING history only,
    //    then append the new user message as the final turn.
    //    Previously the new message was pushed to session.messages first,
    //    then the entire array was sent — causing the current question to
    //    appear mid-history, making Claude treat it as already answered.
    const historyMessages = session.messages.map(msg => ({
      role:    msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    const apiMessages = [
      ...historyMessages,
      { role: 'user', content: message }, // current question always last
    ];

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === 'placeholder_claude_api_key') {
      console.error('[PitchCoach] ❌ Missing ANTHROPIC_API_KEY');
      return res.status(500).json({ message: 'Server misconfiguration: ANTHROPIC_API_KEY is not set.' });
    }

    console.log('[PitchCoach] Calling Claude. History turns:', historyMessages.length);

    const anthropic = new Anthropic({ apiKey });
    let claudeResponse;

    try {
      claudeResponse = await anthropic.messages.create({
        model:      'claude-sonnet-4-6',
        max_tokens: 2500,
        system:     buildSystemPrompt(user),
        messages:   apiMessages,
      });
    } catch (apiError) {
      console.error('[PitchCoach] ❌ Claude API error:', apiError.status, apiError.message);
      return res.status(502).json({
        message: `Claude API error (${apiError.status}): ${apiError.message}`,
      });
    }

    console.log('[PitchCoach] ✅ Claude responded. stop_reason:', claudeResponse.stop_reason);

    const assistantContent = claudeResponse.content
      ?.filter(c => c.type === 'text')
      .map(c => c.text)
      .join('\n') || 'Sorry, I could not generate a response.';

    // Log first 200 chars so you can verify the response quality in terminal
    console.log('[PitchCoach] Response preview:', assistantContent.substring(0, 200));

    // ── Parse feedback report if present ─────────────────────────────────────
    const reportMatch  = assistantContent.match(/<feedback_report>([\s\S]*?)<\/feedback_report>/);
    let parsedFeedback = null;

    if (reportMatch) {
      try {
        parsedFeedback         = JSON.parse(reportMatch[1].trim());
        session.feedbackReport = parsedFeedback;
        console.log('[PitchCoach] Report parsed. Overall:', parsedFeedback.scores?.overall);
      } catch (parseError) {
        console.error('[PitchCoach] Failed to parse feedback_report JSON:', parseError.message);
      }
    }

    // Save both turns to DB after Claude responds successfully
    session.messages.push({ role: 'user',      content: message });
    session.messages.push({ role: 'assistant', content: assistantContent });
    await session.save();

    res.json({
      reply:          assistantContent,
      feedbackReport: session.feedbackReport || null,
      session,
    });

  } catch (error) {
    console.error('[PitchCoach] Unexpected error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;