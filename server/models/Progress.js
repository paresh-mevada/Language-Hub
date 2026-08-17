import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: String, // Format 'YYYY-MM-DD'
      required: true,
      index: true,
    },
    minutesLearned: {
      type: Number,
      default: 0,
      min: 0,
    },
    lessonsCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },
    wordsLearned: {
      type: Number,
      default: 0,
      min: 0,
    },
    conversationsCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

progressSchema.index({ userId: 1, date: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
