import express from 'express';
import Stripe from 'stripe';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import Module from '../models/Module.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Initialize Stripe if key exists
let stripe = null;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'placeholder_stripe_secret') {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

// Create Stripe checkout session (Protected)
router.post('/create-checkout', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // If Stripe is not configured, fall back to mock checkout
    if (!stripe) {
      return res.json({
        url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/subscription?mock_checkout=true`,
        mock: true
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'MindLaunch Premium Membership',
              description: 'Unlock all 30 modules, Pitch Coach Feedback reports, and startup document downloads.'
            },
            unit_amount: 249900, // ₹2,499.00 INR (yearly)
            recurring: {
              interval: 'year'
            }
          },
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/subscription?success=true`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/subscription?canceled=true`,
      customer_email: user.email,
      metadata: {
        userId: user._id.toString()
      }
    });

    res.json({ url: session.url, mock: false });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mock success route for testing (Protected)
router.post('/mock-upgrade', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.plan = 'premium';
    await user.save();

    // Unlock all modules in progress if they don't have records
    const modules = await Module.find();
    for (const mod of modules) {
      const prog = await Progress.findOne({ userId: user._id, moduleId: mod.moduleId });
      if (!prog) {
        await Progress.create({
          userId: user._id,
          moduleId: mod.moduleId,
          status: 'unlocked'
        });
      }
    }

    res.json({
      message: 'Successfully upgraded to premium via mock checkout!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        region: user.region,
        plan: user.plan,
        startupIdea: user.startupIdea,
        category: user.category
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Stripe Webhook (Raw body required)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !sig || !webhookSecret) {
    return res.status(400).send('Stripe webhook configuration missing');
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;

    if (userId) {
      try {
        const user = await User.findById(userId);
        if (user) {
          user.plan = 'premium';
          await user.save();

          // Unlock all modules
          const modules = await Module.find();
          for (const mod of modules) {
            const prog = await Progress.findOne({ userId: user._id, moduleId: mod.moduleId });
            if (!prog) {
              await Progress.create({
                userId: user._id,
                moduleId: mod.moduleId,
                status: 'unlocked'
              });
            }
          }
          console.log(`User ${userId} upgraded to premium via Stripe Webhook`);
        }
      } catch (dbErr) {
        console.error('Error updating user plan on webhook:', dbErr);
        return res.status(500).send('Database error');
      }
    }
  }

  res.json({ received: true });
});

export default router;
