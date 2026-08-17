import mongoose from 'mongoose';

export const VOCABULARY_CATEGORIES = [
  'Daily Life',
  'Travel',
  'Business',
  'Education',
  'Technology',
  'Food',
  'Family',
  'Health',
];

export const VOCABULARY_LEVELS = [
  'Beginner',
  'Elementary',
  'Intermediate',
  'Upper Intermediate',
  'Advanced',
];

const vocabularySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    word: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    meaning: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    example: {
      type: String,
      trim: true,
      default: '',
      maxlength: 1000,
    },
    language: {
      type: String,
      trim: true,
      default: 'English',
    },
    category: {
      type: String,
      enum: VOCABULARY_CATEGORIES,
      default: 'Daily Life',
    },
    level: {
      type: String,
      enum: VOCABULARY_LEVELS,
      default: 'Beginner',
    },
    isLearned: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Vocabulary = mongoose.model('Vocabulary', vocabularySchema);

export default Vocabulary;
