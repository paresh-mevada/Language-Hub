import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function protect(request, _response, next) {
  const authorization = request.headers.authorization || '';
  const bearerToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;
  const token = bearerToken || request.cookies.token;

  if (!token) {
    const error = new Error('Authentication is required.');
    error.statusCode = 401;
    return next(error);
  }

  if (!process.env.JWT_SECRET) {
    const error = new Error('JWT_SECRET is not configured.');
    error.statusCode = 500;
    return next(error);
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    const error = new Error('Your session is invalid or has expired.');
    error.statusCode = 401;
    return next(error);
  }

  const userId = decoded.userId || decoded.id;
  request.user = await User.findById(userId);

  if (!request.user) {
    const error = new Error('The account for this session no longer exists.');
    error.statusCode = 401;
    return next(error);
  }

  return next();
}
