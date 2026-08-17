import mongoose from 'mongoose';
import Vocabulary, { VOCABULARY_CATEGORIES, VOCABULARY_LEVELS } from '../models/Vocabulary.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function assertObjectId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw createError('Invalid vocabulary ID.', 400);
  }
}

async function getOwnedVocabularyItem(id, userId) {
  assertObjectId(id);
  const item = await Vocabulary.findOne({ _id: id, userId });
  if (!item) {
    throw createError('Vocabulary item not found.', 404);
  }
  return item;
}

export const getVocabulary = asyncHandler(async (request, response) => {
  const { search, category, level, isLearned, isFavorite, language } = request.query;

  const query = { userId: request.user.id };

  if (category && category !== 'All') {
    if (!VOCABULARY_CATEGORIES.includes(category)) {
      throw createError('Invalid category filter.', 400);
    }
    query.category = category;
  }

  if (level && level !== 'All') {
    if (!VOCABULARY_LEVELS.includes(level)) {
      throw createError('Invalid level filter.', 400);
    }
    query.level = level;
  }

  if (isLearned !== undefined && isLearned !== '') {
    query.isLearned = isLearned === 'true';
  }

  if (isFavorite !== undefined && isFavorite !== '') {
    query.isFavorite = isFavorite === 'true';
  }

  if (language && language !== 'All') {
    query.language = language;
  }

  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    query.$or = [{ word: regex }, { meaning: regex }, { example: regex }];
  }

  const vocabulary = await Vocabulary.find(query).sort({ createdAt: -1 }).lean();

  response.status(200).json({
    success: true,
    message: 'Vocabulary items retrieved.',
    data: { vocabulary },
  });
});

export const createVocabulary = asyncHandler(async (request, response) => {
  const { word, meaning, example, category, level, language } = request.body;

  if (typeof word !== 'string' || !word.trim()) {
    throw createError('Word is required.', 400);
  }
  if (typeof meaning !== 'string' || !meaning.trim()) {
    throw createError('Meaning is required.', 400);
  }

  const selectedCategory = category && VOCABULARY_CATEGORIES.includes(category) ? category : 'Daily Life';
  const selectedLevel = level && VOCABULARY_LEVELS.includes(level) ? level : (request.user.level || 'Beginner');
  const selectedLanguage = language?.trim() || (request.user.learningLanguage === 'Not selected' ? 'English' : request.user.learningLanguage);

  const item = await Vocabulary.create({
    userId: request.user.id,
    word: word.trim(),
    meaning: meaning.trim(),
    example: typeof example === 'string' ? example.trim() : '',
    category: selectedCategory,
    level: selectedLevel,
    language: selectedLanguage,
  });

  response.status(201).json({
    success: true,
    message: 'Vocabulary word added successfully.',
    data: { vocabulary: item },
  });
});

export const updateVocabulary = asyncHandler(async (request, response) => {
  const item = await getOwnedVocabularyItem(request.params.id, request.user.id);
  const { word, meaning, example, category, level, language, isLearned, isFavorite } = request.body;

  if (word !== undefined) {
    if (typeof word !== 'string' || !word.trim()) throw createError('Word cannot be empty.', 400);
    item.word = word.trim();
  }
  if (meaning !== undefined) {
    if (typeof meaning !== 'string' || !meaning.trim()) throw createError('Meaning cannot be empty.', 400);
    item.meaning = meaning.trim();
  }
  if (example !== undefined) {
    item.example = typeof example === 'string' ? example.trim() : '';
  }
  if (category !== undefined) {
    if (!VOCABULARY_CATEGORIES.includes(category)) throw createError('Invalid category.', 400);
    item.category = category;
  }
  if (level !== undefined) {
    if (!VOCABULARY_LEVELS.includes(level)) throw createError('Invalid level.', 400);
    item.level = level;
  }
  if (language !== undefined && typeof language === 'string' && language.trim()) {
    item.language = language.trim();
  }
  if (isLearned !== undefined) {
    item.isLearned = Boolean(isLearned);
  }
  if (isFavorite !== undefined) {
    item.isFavorite = Boolean(isFavorite);
  }

  await item.save();

  response.status(200).json({
    success: true,
    message: 'Vocabulary word updated.',
    data: { vocabulary: item },
  });
});

export const deleteVocabulary = asyncHandler(async (request, response) => {
  const item = await getOwnedVocabularyItem(request.params.id, request.user.id);
  await item.deleteOne();

  response.status(200).json({
    success: true,
    message: 'Vocabulary item deleted.',
  });
});

export const toggleLearned = asyncHandler(async (request, response) => {
  const item = await getOwnedVocabularyItem(request.params.id, request.user.id);
  item.isLearned = !item.isLearned;
  await item.save();

  response.status(200).json({
    success: true,
    message: `Word marked as ${item.isLearned ? 'learned' : 'unlearned'}.`,
    data: { vocabulary: item },
  });
});

export const toggleFavorite = asyncHandler(async (request, response) => {
  const item = await getOwnedVocabularyItem(request.params.id, request.user.id);
  item.isFavorite = !item.isFavorite;
  await item.save();

  response.status(200).json({
    success: true,
    message: `Word ${item.isFavorite ? 'added to' : 'removed from'} favorites.`,
    data: { vocabulary: item },
  });
});
