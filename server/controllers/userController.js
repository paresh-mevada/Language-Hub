import User, { LEARNING_LEVELS } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export const getUserProfile = asyncHandler(async (request, response) => {
  const user = await User.findById(request.user.id).select('-password').lean();
  if (!user) {
    throw createError('User profile not found.', 404);
  }

  response.status(200).json({
    success: true,
    message: 'User profile retrieved successfully.',
    data: { user },
  });
});

export const updateUserProfile = asyncHandler(async (request, response) => {
  const { name, avatar, nativeLanguage, learningLanguage, level } = request.body;

  const user = await User.findById(request.user.id);
  if (!user) {
    throw createError('User not found.', 404);
  }

  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim() || name.trim().length < 2 || name.trim().length > 80) {
      throw createError('Name must be between 2 and 80 characters.', 400);
    }
    user.name = name.trim();
  }

  if (avatar !== undefined && typeof avatar === 'string') {
    user.avatar = avatar.trim();
  }

  if (nativeLanguage !== undefined && typeof nativeLanguage === 'string') {
    user.nativeLanguage = nativeLanguage.trim() || 'Not selected';
  }

  if (learningLanguage !== undefined && typeof learningLanguage === 'string') {
    user.learningLanguage = learningLanguage.trim() || 'Not selected';
  }

  if (level !== undefined) {
    if (!LEARNING_LEVELS.includes(level)) {
      throw createError('Invalid learning level.', 400);
    }
    user.level = level;
  }

  await user.save();

  const updatedUser = user.toObject();
  delete updatedUser.password;

  response.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    data: { user: updatedUser },
  });
});
