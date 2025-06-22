import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';
  let details = null;
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    details = err.details;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized access';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Resource not found';
  } else if (err.code === 'ENOTFOUND') {
    statusCode = 503;
    message = 'Service temporarily unavailable';
  } else if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    message = 'Connection refused';
  } else if (err.code === 'ETIMEDOUT') {
    statusCode = 504;
    message = 'Request timeout';
  } else if (err.name === 'SyntaxError' && err.status === 400) {
    statusCode = 400;
    message = 'Invalid JSON format';
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Something went wrong';
  }

  const errorResponse = {
    success: false,
    error: err.name || 'ServerError',
    message,
    ...(details && { details }),
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      timestamp: new Date().toISOString()
    })
  };

  res.status(statusCode).json(errorResponse);
};

// 404 handler
export const notFoundHandler = (req, res) => {
  logger.warn('404 Not Found:', {
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  res.status(404).json({
    success: false,
    error: 'NotFound',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
    availableEndpoints: [
      'GET /api/products?q=<query>',
      'GET /api/search?q=<query>',
      'GET /api/retailers',
      'GET /api/scraper/status',
      'POST /api/alerts',
      'GET /api/health'
    ]
  });
};

// Async error wrapper
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};