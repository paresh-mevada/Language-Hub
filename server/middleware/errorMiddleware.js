export function errorHandler(error, _request, response, _next) {
  let statusCode = error.statusCode || error.status || 500;
  let message = error.message || 'An unexpected error occurred.';

  // 1. Mongoose Duplicate Key Error (E11000)
  if (error.code === 11000) {
    statusCode = 409;
    const keys = Object.keys(error.keyValue || {});
    message = keys.length > 0
      ? `A record with this ${keys.join(', ')} already exists.`
      : 'A record with this information already exists.';
  }

  // 2. Mongoose Validation Error
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((val) => val.message)
      .join('. ');
  }

  // 3. Mongoose Cast Error (Invalid ObjectId)
  if (error.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for resource ID: ${error.value}`;
  }

  // 4. JWT Authentication Errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Authentication failed. Token is invalid.';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication session expired. Please sign in again.';
  }

  const isProduction = process.env.NODE_ENV === 'production';

  response.status(statusCode).json({
    success: false,
    message: statusCode === 500 && isProduction ? 'An unexpected server error occurred.' : message,
  });
}
