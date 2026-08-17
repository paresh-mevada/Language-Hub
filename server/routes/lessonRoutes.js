import express from 'express';
import {
  createLesson,
  getLessonById,
  getLessons,
  submitLessonExercises,
} from '../controllers/lessonController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getLessons);
router.post('/', createLesson);
router.get('/:id', getLessonById);
router.post('/:id/submit', submitLessonExercises);

export default router;
