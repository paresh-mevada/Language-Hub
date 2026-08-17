import express from 'express';
import {
  createVocabulary,
  deleteVocabulary,
  getVocabulary,
  toggleFavorite,
  toggleLearned,
  updateVocabulary,
} from '../controllers/vocabularyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getVocabulary);
router.post('/', createVocabulary);
router.put('/:id', updateVocabulary);
router.delete('/:id', deleteVocabulary);
router.patch('/:id/learned', toggleLearned);
router.patch('/:id/favorite', toggleFavorite);

export default router;
