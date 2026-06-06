import express from 'express';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Update Startup Idea & Category
router.put('/', auth, async (req, res) => {
  try {
    const { startupIdea, category } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (startupIdea !== undefined) user.startupIdea = startupIdea;
    if (category !== undefined) user.category = category;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        region: user.region,
        plan: user.plan,
        startupIdea: user.startupIdea,
        category: user.category,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET progress summary
router.get('/progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const allProgress = await Progress.find({ userId: user._id });
    
    const completedCount = allProgress.filter(p => p.status === 'completed').length;
    
    // Find current active module
    // The current active module is either the highest completed moduleId + 1, or the first unlocked module, or 1.
    let currentModule = 1;
    const completedIds = allProgress.filter(p => p.status === 'completed').map(p => p.moduleId);
    if (completedIds.length > 0) {
      const maxCompleted = Math.max(...completedIds);
      if (maxCompleted < 30) {
        currentModule = maxCompleted + 1;
      } else {
        currentModule = 30; // completed all
      }
    } else {
      const unlockedProg = allProgress.find(p => p.status === 'unlocked');
      if (unlockedProg) {
        currentModule = unlockedProg.moduleId;
      }
    }

    // Time on platform: duration between user creation and now in days/hours
    const diffMs = Date.now() - new Date(user.createdAt).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60)); // minutes
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    let timeString = '';
    if (diffDays > 0) {
      timeString = `${diffDays}d ${diffHours % 24}h`;
    } else if (diffHours > 0) {
      timeString = `${diffHours}h ${diffMins % 60}m`;
    } else {
      timeString = `${diffMins}m`;
    }

    res.json({
      completedCount,
      totalModules: 30,
      currentModule,
      timeOnPlatform: timeString,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
