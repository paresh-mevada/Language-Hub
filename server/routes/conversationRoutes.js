import { Router } from 'express';
import {
  createConversation,
  createMessage,
  deleteConversation,
  getConversation,
  listConversations,
  listMessages,
  regenerateMessage,
  updateConversation,
} from '../controllers/conversationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.route('/').get(listConversations).post(createConversation);
router.route('/:id').get(getConversation).put(updateConversation).delete(deleteConversation);
router.route('/:id/messages').get(listMessages).post(createMessage);
router.post('/:id/messages/:messageId/regenerate', regenerateMessage);

export default router;
