import Joi from 'joi';

// Validation schemas
const searchQuerySchema = Joi.object({
  q: Joi.string().trim().min(1).max(200).required().messages({
    'string.empty': 'Search query cannot be empty',
    'string.min': 'Search query must be at least 1 character',
    'string.max': 'Search query must be less than 200 characters',
    'any.required': 'Search query is required'
  }),
  limit: Joi.number().integer().min(1).max(100).default(50),
  offset: Joi.number().integer().min(0).default(0)
});

const priceAlertSchema = Joi.object({
  product_id: Joi.string().trim().required().messages({
    'string.empty': 'Product ID is required',
    'any.required': 'Product ID is required'
  }),
  target_price: Joi.number().positive().required().messages({
    'number.positive': 'Target price must be greater than 0',
    'any.required': 'Target price is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  })
});

const scrapingRequestSchema = Joi.object({
  type: Joi.string().valid('full', 'popular', 'retailer', 'search').required().messages({
    'any.only': 'Scraping type must be one of: full, popular, retailer, or search',
    'any.required': 'Scraping type is required'
  }),
  retailer: Joi.string().when('type', {
    is: 'retailer',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  query: Joi.string().when('type', {
    is: 'search',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});

// Validation middleware factory
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid input data',
        details: errorDetails
      });
    }

    // Replace the original data with validated and sanitized data
    req[property] = value;
    next();
  };
};

// Specific validation middleware
export const validateSearchQuery = validate(searchQuerySchema, 'query');
export const validatePriceAlert = validate(priceAlertSchema);
export const validateScrapingRequest = validate(scrapingRequestSchema);

// Input sanitization middleware
export const sanitizeInput = (req, res, next) => {
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    
    // Remove potential XSS vectors
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  };

  const sanitizeObject = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };

  // Sanitize request body, query, and params
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);

  next();
};

// Rate limiting validation
export const validateRateLimit = (req, res, next) => {
  // Add custom rate limiting logic here if needed
  // For now, we rely on express-rate-limit middleware
  next();
};