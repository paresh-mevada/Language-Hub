import mongoose from 'mongoose';
import GrammarCheck from '../models/GrammarCheck.js';
import { checkGrammarText } from '../services/aiService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export const checkGrammar = asyncHandler(async (request, response) => {
  const { text, language: inputLanguage } = request.body;

  if (typeof text !== 'string' || !text.trim()) {
    throw createError('Text is required for grammar check.', 400);
  }

  if (text.trim().length > 2000) {
    throw createError('Text cannot exceed 2000 characters.', 400);
  }

  const learningLanguage = inputLanguage?.trim() || (request.user.learningLanguage === 'Not selected' ? 'English' : request.user.learningLanguage);
  const userLevel = request.user.level || 'Beginner';

  const result = await checkGrammarText({
    text: text.trim(),
    learningLanguage,
    userLevel,
  });

  const check = await GrammarCheck.create({
    userId: request.user.id,
    originalText: result.originalText,
    correctedText: result.correctedText,
    explanation: result.explanation,
    alternativeSentence: result.alternativeSentence,
    language: learningLanguage,
    hasErrors: result.hasErrors,
  });

  response.status(201).json({
    success: true,
    message: 'Grammar analysis completed.',
    data: { check },
  });
});

export const getGrammarHistory = asyncHandler(async (request, response) => {
  const history = await GrammarCheck.find({ userId: request.user.id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  response.status(200).json({
    success: true,
    message: 'Grammar history retrieved.',
    data: { history },
  });
});

export const deleteGrammarCheck = asyncHandler(async (request, response) => {
  const { id } = request.params;

  if (!mongoose.isValidObjectId(id)) {
    throw createError('Invalid history ID.', 400);
  }

  const check = await GrammarCheck.findOne({ _id: id, userId: request.user.id });
  if (!check) {
    throw createError('Grammar history item not found.', 404);
  }

  await check.deleteOne();

  response.status(200).json({
    success: true,
    message: 'Grammar check deleted.',
  });
});

export const clearGrammarHistory = asyncHandler(async (request, response) => {
  await GrammarCheck.deleteMany({ userId: request.user.id });

  response.status(200).json({
    success: true,
    message: 'Grammar history cleared.',
  });
});
