import jwt from 'jsonwebtoken';
import User, { LEARNING_LEVELS } from '../models/User.js';
import { seedUserData } from '../services/seedService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const emailPattern = /^\S+@\S+\.\S+$/;

function createError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function sanitizeUser(user) {
  const { password, ...safeUser } = user.toObject();
  return safeUser;
}

function signToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw createError('JWT_SECRET is not configured.', 500);
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function setAuthCookie(response, token, rememberMe = false) {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    // 'none' required for cross-domain (Vercel frontend → separate API host)
    // 'lax' works fine for same-domain local dev
    sameSite: isProduction ? 'none' : 'lax',
  };

  if (rememberMe) {
    cookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000;
  }

  response.cookie('token', token, cookieOptions);
}

function validateRegistration(payload) {
  const { name, email, password, nativeLanguage, learningLanguage, level } = payload;

  if (![name, email, password].every((value) => typeof value === 'string' && value.trim())) {
    throw createError('Name, email, and password are required.');
  }

  if (!emailPattern.test(email.trim())) {
    throw createError('Please provide a valid email address.');
  }

  if (password.length < 8) {
    throw createError('Password must be at least 8 characters long.');
  }

  for (const [field, value] of Object.entries({ nativeLanguage, learningLanguage, avatar: payload.avatar })) {
    if (value !== undefined && (typeof value !== 'string' || !value.trim())) {
      throw createError(`${field} must be a non-empty string.`);
    }
  }

  if (level !== undefined && !LEARNING_LEVELS.includes(level)) {
    throw createError(`Level must be one of: ${LEARNING_LEVELS.join(', ')}.`);
  }
}

export const register = asyncHandler(async (request, response) => {
  validateRegistration(request.body);

  const email = request.body.email.trim().toLowerCase();
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createError('An account with this email already exists.', 409);
  }

  const user = await User.create({
    name: request.body.name.trim(),
    email,
    password: request.body.password,
    nativeLanguage: request.body.nativeLanguage?.trim(),
    learningLanguage: request.body.learningLanguage?.trim(),
    level: request.body.level,
    avatar: request.body.avatar?.trim(),
  });
  const token = signToken(user.id);

  // Auto-seed demo data for new user
  await seedUserData(user._id);

  setAuthCookie(response, token, true);
  response.status(201).json({
    success: true,
    message: 'Account created successfully.',
    data: { user: sanitizeUser(user), token },
  });
});

export const login = asyncHandler(async (request, response) => {
  const { email, password } = request.body;

  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    throw createError('Email and password are required.');
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw createError('Invalid email or password.', 401);
  }

  const token = signToken(user.id);

  // Auto-seed demo data if user missing initial data
  await seedUserData(user._id);

  setAuthCookie(response, token, Boolean(request.body.rememberMe));
  response.status(200).json({
    success: true,
    message: 'Logged in successfully.',
    data: { user: sanitizeUser(user), token },
  });
});

export function logout(_request, response) {
  const isProduction = process.env.NODE_ENV === 'production';
  response.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });
  response.status(200).json({ success: true, message: 'Logged out successfully.' });
}

export const getCurrentUser = asyncHandler(async (request, response) => {
  await seedUserData(request.user._id);

  response.status(200).json({
    success: true,
    message: 'Current user retrieved successfully.',
    data: { user: sanitizeUser(request.user) },
  });
});

