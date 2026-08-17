import mongoose from 'mongoose';

const userLessonProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
      index: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    score: {
      type: Number,
      default: 0,
    },
    maxScore: {
      type: Number,
      default: 0,
    },
    answers: {
      type: Map,
      of: String,
      default: {},
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

userLessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

const UserLessonProgress = mongoose.model('UserLessonProgress', userLessonProgressSchema);

export default UserLessonProgress;
