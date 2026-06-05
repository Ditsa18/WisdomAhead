import express from 'express';
import Progress from '../models/Progress.js';
import Module from '../models/Module.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET all completed deliverable answers (for the aggregate Startup Brief)
router.get('/brief', auth, async (req, res) => {
  try {
    const allProgress = await Progress.find({ userId: req.user.id, status: 'completed' });
    const modules = await Module.find().sort({ moduleId: 1 });

    const briefData = [];

    for (const prog of allProgress) {
      const mod = modules.find(m => m.moduleId === prog.moduleId);
      if (mod) {
        // Format schema-label map
        const answersList = [];
        mod.deliverableSchema.forEach(schema => {
          const answer = prog.deliverableAnswers.get(schema.fieldKey) || '';
          answersList.push({
            fieldKey: schema.fieldKey,
            label: schema.label,
            answer
          });
        });

        briefData.push({
          moduleId: mod.moduleId,
          title: mod.title,
          trackName: mod.trackName,
          track: mod.track,
          answers: answersList,
          completedAt: prog.completedAt
        });
      }
    }

    // Sort by moduleId
    briefData.sort((a, b) => a.moduleId - b.moduleId);

    res.json(briefData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single module deliverable answers for doc generation
router.get('/:moduleId', auth, async (req, res) => {
  try {
    const moduleId = parseInt(req.params.moduleId);
    if (isNaN(moduleId)) {
      return res.status(400).json({ message: 'Invalid module ID' });
    }

    const mod = await Module.findOne({ moduleId });
    if (!mod) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const progress = await Progress.findOne({ userId: req.user.id, moduleId });
    if (!progress || progress.status !== 'completed') {
      return res.status(400).json({ message: 'Module deliverables have not been completed yet.' });
    }

    const answersList = [];
    mod.deliverableSchema.forEach(schema => {
      const answer = progress.deliverableAnswers.get(schema.fieldKey) || '';
      answersList.push({
        fieldKey: schema.fieldKey,
        label: schema.label,
        answer
      });
    });

    res.json({
      moduleId: mod.moduleId,
      title: mod.title,
      trackName: mod.trackName,
      answers: answersList
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
