import mongoose from 'mongoose';

export const LESSON_CATEGORIES = [
  'Grammar',
  'Vocabulary',
  'Speaking',
  'Listening',
  'Reading',
  'Writing',
];

export const LESSON_LEVELS = [
  'Beginner',
  'Elementary',
  'Intermediate',
  'Upper Intermediate',
  'Advanced',
];

const exerciseSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['multiple_choice', 'fill_in_the_blank'],
    required: true,
  },
  question: {
    type: String,
    required: true,
    trim: true,
  },
  options: {
    type: [String],
    default: [],
  },
  correctAnswer: {
    type: String,
    required: true,
    trim: true,
  },
  explanation: {
    type: String,
    trim: true,
    default: '',
  },
});

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    category: {
      type: String,
      enum: LESSON_CATEGORIES,
      default: 'Grammar',
    },
    level: {
      type: String,
      enum: LESSON_LEVELS,
      default: 'Beginner',
    },
    duration: {
      type: String,
      default: '15 mins',
      trim: true,
    },
    language: {
      type: String,
      default: 'English',
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    exercises: [exerciseSchema],
  },
  { timestamps: true },
);

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;
