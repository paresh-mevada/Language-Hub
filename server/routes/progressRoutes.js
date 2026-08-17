import express from 'express';
import { getProgressSummary, logProgress } from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getProgressSummary);
router.post('/', logProgress);

export default router;
