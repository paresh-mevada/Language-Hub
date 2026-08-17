import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export const LEARNING_LEVELS = [
  'Beginner',
  'Elementary',
  'Intermediate',
  'Upper Intermediate',
  'Advanced',
];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^\S+@\S+\.\S+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    nativeLanguage: {
      type: String,
      trim: true,
      default: 'Not selected',
    },
    learningLanguage: {
      type: String,
      trim: true,
      default: 'Not selected',
    },
    level: {
      type: String,
      enum: LEARNING_LEVELS,
      default: 'Beginner',
    },
    avatar: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
