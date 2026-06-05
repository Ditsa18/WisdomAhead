import express from 'express';
import Module from '../models/Module.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Helper to determine module status for a user
async function getModulesWithStatus(userId, userPlan) {
  const allModules = await Module.find().sort({ moduleId: 1 });
  const allProgress = await Progress.find({ userId });
  
  const progressMap = new Map();
  allProgress.forEach(p => {
    progressMap.set(p.moduleId, p);
  });

  return allModules.map(mod => {
    const prog = progressMap.get(mod.moduleId);
    let status = 'locked';
    let deliverableAnswers = {};

    if (prog) {
      status = prog.status; // 'completed' or 'unlocked'
      deliverableAnswers = prog.deliverableAnswers || {};
    }

    if (userPlan === 'premium') {
      // Premium plan unlocks all modules.
      if (status !== 'completed') {
        status = 'unlocked';
      }
    } else {
      // Free plan logic
      if (mod.track > 1) {
        status = 'locked';
      } else {
        // Track 1
        if (mod.moduleId === 1) {
          if (status !== 'completed') {
            status = 'unlocked';
          }
        } else {
          // For moduleId > 1 (within Track 1)
          if (status !== 'completed') {
            // Check if the previous module is completed
            const prevProg = progressMap.get(mod.moduleId - 1);
            if (prevProg && prevProg.status === 'completed') {
              status = 'unlocked';
            } else {
              status = 'locked';
            }
          }
        }
      }
    }

    return {
      _id: mod._id,
      moduleId: mod.moduleId,
      title: mod.title,
      track: mod.track,
      trackName: mod.trackName,
      order: mod.order,
      deliverableSchema: mod.deliverableSchema,
      status,
      deliverableAnswers
    };
  });
}

// GET all modules with progress
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const modulesWithStatus = await getModulesWithStatus(user._id, user.plan);
    res.json(modulesWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single module by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const moduleId = parseInt(req.params.id);
    if (isNaN(moduleId)) {
      return res.status(400).json({ message: 'Invalid module ID' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const mod = await Module.findOne({ moduleId });
    if (!mod) return res.status(404).json({ message: 'Module not found' });

    // Determine access status
    const allModules = await getModulesWithStatus(user._id, user.plan);
    const targetModule = allModules.find(m => m.moduleId === moduleId);

    if (!targetModule || targetModule.status === 'locked') {
      return res.status(403).json({ message: 'This module is locked. Upgrade your subscription to unlock it.' });
    }

    // Return the module content along with progress info
    res.json({
      _id: mod._id,
      moduleId: mod.moduleId,
      title: mod.title,
      track: mod.track,
      trackName: mod.trackName,
      order: mod.order,
      content: mod.content,
      deliverableSchema: mod.deliverableSchema,
      status: targetModule.status,
      deliverableAnswers: targetModule.deliverableAnswers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST mark module complete & save deliverable
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const moduleId = parseInt(req.params.id);
    const { deliverableAnswers } = req.body;

    if (isNaN(moduleId)) {
      return res.status(400).json({ message: 'Invalid module ID' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if user has access to this module
    const allModules = await getModulesWithStatus(user._id, user.plan);
    const targetModule = allModules.find(m => m.moduleId === moduleId);

    if (!targetModule || targetModule.status === 'locked') {
      return res.status(403).json({ message: 'Access denied: Module is locked' });
    }

    // Save or update progress
    let progress = await Progress.findOne({ userId: user._id, moduleId });

    if (!progress) {
      progress = new Progress({
        userId: user._id,
        moduleId,
        status: 'completed',
        deliverableAnswers,
        completedAt: new Date()
      });
    } else {
      progress.status = 'completed';
      progress.deliverableAnswers = deliverableAnswers;
      progress.completedAt = new Date();
    }

    await progress.save();

    // Unlock next module in the sequence (if we are premium or within Track 1)
    const nextModuleId = moduleId + 1;
    const nextMod = await Module.findOne({ moduleId: nextModuleId });
    if (nextMod) {
      // Prepare next progress entry as 'unlocked' if not already created/completed
      let nextProgress = await Progress.findOne({ userId: user._id, moduleId: nextModuleId });
      if (!nextProgress) {
        // If premium or next mod is in track 1, mark as unlocked
        if (user.plan === 'premium' || nextMod.track === 1) {
          nextProgress = new Progress({
            userId: user._id,
            moduleId: nextModuleId,
            status: 'unlocked'
          });
          await nextProgress.save();
        }
      }
    }

    res.json({ message: 'Module completed successfully', progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
