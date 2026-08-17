import mongoose from 'mongoose';

const grammarCheckSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    correctedText: {
      type: String,
      required: true,
      trim: true,
    },
    explanation: {
      type: String,
      required: true,
      trim: true,
    },
    alternativeSentence: {
      type: String,
      trim: true,
      default: '',
    },
    language: {
      type: String,
      trim: true,
      default: 'English',
    },
    hasErrors: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const GrammarCheck = mongoose.model('GrammarCheck', grammarCheckSchema);

export default GrammarCheck;
