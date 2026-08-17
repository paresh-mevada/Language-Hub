import mongoose from 'mongoose';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { generateTutorResponse } from '../services/aiService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function assertObjectId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw createError('Invalid conversation ID.', 400);
  }
}

async function getOwnedConversation(conversationId, userId) {
  assertObjectId(conversationId);
  const conversation = await Conversation.findOne({ _id: conversationId, userId });

  if (!conversation) {
    throw createError('Conversation not found.', 404);
  }

  return conversation;
}

export const listConversations = asyncHandler(async (request, response) => {
  const conversations = await Conversation.find({ userId: request.user.id }).sort({ updatedAt: -1 }).lean();
  const enrichedConversations = await Promise.all(conversations.map(async (conversation) => {
    const lastMessage = await Message.findOne({ conversationId: conversation._id }).sort({ createdAt: -1 }).lean();
    return { ...conversation, lastMessage: lastMessage?.content || '' };
  }));

  response.status(200).json({
    success: true,
    message: 'Conversations retrieved successfully.',
    data: { conversations: enrichedConversations },
  });
});

export const createConversation = asyncHandler(async (request, response) => {
  const { language: requestedLanguage, title: requestedTitle } = request.body;
  if (requestedLanguage !== undefined && (typeof requestedLanguage !== 'string' || !requestedLanguage.trim())) {
    throw createError('Language must be a non-empty string.', 400);
  }
  if (requestedTitle !== undefined && (typeof requestedTitle !== 'string' || !requestedTitle.trim())) {
    throw createError('Title must be a non-empty string.', 400);
  }

  const language = requestedLanguage?.trim() || (request.user.learningLanguage === 'Not selected' ? 'English' : request.user.learningLanguage);
  const title = requestedTitle?.trim() || 'New conversation';

  if (title.length > 120 || language.length > 60) {
    throw createError('Conversation title or language is too long.', 400);
  }

  const conversation = await Conversation.create({ userId: request.user.id, title, language });
  response.status(201).json({ success: true, message: 'Conversation created successfully.', data: { conversation } });
});

export const getConversation = asyncHandler(async (request, response) => {
  const conversation = await getOwnedConversation(request.params.id, request.user.id);
  response.status(200).json({ success: true, message: 'Conversation retrieved successfully.', data: { conversation } });
});

export const updateConversation = asyncHandler(async (request, response) => {
  const conversation = await getOwnedConversation(request.params.id, request.user.id);
  const { title, language } = request.body;

  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim() || title.trim().length > 120) throw createError('Title must be between 1 and 120 characters.', 400);
    conversation.title = title.trim();
  }
  if (language !== undefined) {
    if (typeof language !== 'string' || !language.trim() || language.trim().length > 60) throw createError('Language must be between 1 and 60 characters.', 400);
    conversation.language = language.trim();
  }

  await conversation.save();
  response.status(200).json({ success: true, message: 'Conversation updated successfully.', data: { conversation } });
});

export const deleteConversation = asyncHandler(async (request, response) => {
  const conversation = await getOwnedConversation(request.params.id, request.user.id);
  await Message.deleteMany({ conversationId: conversation.id });
  await conversation.deleteOne();
  response.status(200).json({ success: true, message: 'Conversation deleted successfully.' });
});

export const listMessages = asyncHandler(async (request, response) => {
  const conversation = await getOwnedConversation(request.params.id, request.user.id);
  const messages = await Message.find({ conversationId: conversation.id }).sort({ createdAt: 1 });
  response.status(200).json({ success: true, message: 'Messages retrieved successfully.', data: { messages } });
});

export const createMessage = asyncHandler(async (request, response) => {
  const conversation = await getOwnedConversation(request.params.id, request.user.id);
  const { content } = request.body;

  if (typeof content !== 'string' || !content.trim()) {
    throw createError('Message content is required.', 400);
  }
  if (content.trim().length > 4000) {
    throw createError('Message content cannot exceed 4000 characters.', 400);
  }

  const conversationHistory = await Message.find({ conversationId: conversation.id }).sort({ createdAt: 1 }).lean();
  const assistantContent = await generateTutorResponse({
    userMessage: content,
    conversationHistory,
    learningLanguage: conversation.language,
    userLevel: request.user.level,
  });
  const message = await Message.create({ conversationId: conversation.id, role: 'user', content: content.trim() });
  const assistantMessage = await Message.create({
    conversationId: conversation.id,
    role: 'assistant',
    content: assistantContent,
  });

  if (conversation.title === 'New conversation') {
    conversation.title = content.trim().replace(/\s+/g, ' ').slice(0, 56);
  }
  conversation.updatedAt = new Date();
  await conversation.save();

  response.status(201).json({
    success: true,
    message: 'Message sent successfully.',
    data: { message, assistantMessage, conversation },
  });
});

export const regenerateMessage = asyncHandler(async (request, response) => {
  const conversation = await getOwnedConversation(request.params.id, request.user.id);
  if (!mongoose.isValidObjectId(request.params.messageId)) {
    throw createError('Invalid message ID.', 400);
  }

  const assistantMessage = await Message.findOne({
    _id: request.params.messageId,
    conversationId: conversation.id,
    role: 'assistant',
  });
  if (!assistantMessage) {
    throw createError('Assistant message not found.', 404);
  }

  const userMessage = await Message.findOne({
    conversationId: conversation.id,
    role: 'user',
    createdAt: { $lte: assistantMessage.createdAt },
  }).sort({ createdAt: -1 });
  if (!userMessage) {
    throw createError('No message is available to regenerate.', 400);
  }

  const conversationHistory = await Message.find({
    conversationId: conversation.id,
    createdAt: { $lt: userMessage.createdAt },
  }).sort({ createdAt: 1 }).lean();
  assistantMessage.content = await generateTutorResponse({
    userMessage: userMessage.content,
    conversationHistory,
    learningLanguage: conversation.language,
    userLevel: request.user.level,
  });
  await assistantMessage.save();
  response.status(200).json({ success: true, message: 'Response regenerated successfully.', data: { message: assistantMessage } });
});
