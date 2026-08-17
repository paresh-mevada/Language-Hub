import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 120,
      default: 'New conversation',
    },
    language: {
      type: String,
      trim: true,
      maxlength: 60,
      required: true,
    },
  },
  { timestamps: true },
);

conversationSchema.index({ userId: 1, updatedAt: -1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
