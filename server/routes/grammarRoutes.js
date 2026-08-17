import express from 'express';
import {
  checkGrammar,
  clearGrammarHistory,
  deleteGrammarCheck,
  getGrammarHistory,
} from '../controllers/grammarController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/check', checkGrammar);
router.get('/', getGrammarHistory);
router.delete('/', clearGrammarHistory);
router.delete('/:id', deleteGrammarCheck);

export default router;
