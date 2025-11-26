---
title: "Building Production-Ready REST APIs with Express.js: A Comprehensive Guide"
publishDate: 2025-10-18
description: "Dive deep into building scalable, maintainable REST APIs using Express.js and Node.js. This comprehensive guide covers everything from fundamental concepts to advanced patterns including middleware architecture, error handling strategies, authentication mechanisms, database integration, API versioning, rate limiting, and deployment best practices. Learn how to structure your application for growth, implement proper security measures, write effective tests, and optimize performance for production environments."
category: "Backend Development"
tags: ["Express.js", "Node.js", "REST API", "Backend", "JavaScript", "Web Development", "API Design"]
thumbnail: "/images/posts/building-rest-api-with-express-js.png"
author: "Putra Prassiesa Abimanyu"
---

# Building Production-Ready REST APIs with Express.js: A Comprehensive Guide

Over the past few years, I've built dozens of REST APIs using Express.js, from simple CRUD applications to complex microservices handling millions of requests daily. Express.js has consistently proven itself as one of the most flexible and powerful frameworks for building APIs in the Node.js ecosystem. In this guide, I'll share everything I've learned about building production-ready REST APIs with Express.js, including patterns that work, common pitfalls to avoid, and best practices that scale.

## Understanding REST and Why Express.js Matters

Before we dive into code, let's establish what makes a good REST API. REST (Representational State Transfer) isn't just about using HTTP methods correctly—it's an architectural style that emphasizes scalability, simplicity, and statelessness. A well-designed REST API should be intuitive, predictable, and easy to consume.

Express.js excels in this space because it doesn't impose rigid structures. It's minimalist yet powerful, giving you complete control over your API's architecture. This flexibility is both its greatest strength and potential weakness. Without proper structure, an Express.js application can quickly become unmaintainable. That's why architectural decisions early in your project matter so much.

## Setting Up Your Express.js Project the Right Way

Many tutorials skip the foundation, jumping straight into routes and controllers. But how you structure your project from day one determines how easily you can scale later. Let me walk you through a project setup that I've refined over time.

First, initialize your project with a proper package.json. Don't just accept all the defaults—think about your project metadata. Here's what a solid initialization looks like:

```bash
mkdir express-api-project
cd express-api-project
npm init -y
```

Now, let's install the essential dependencies:

```bash
npm install express dotenv cors helmet morgan
npm install --save-dev nodemon eslint prettier
```

Each of these packages serves a specific purpose. Express is our framework, dotenv manages environment variables, cors handles Cross-Origin Resource Sharing, helmet adds security headers, and morgan provides request logging. For development, nodemon watches for file changes, while eslint and prettier keep our code clean.

Here's the folder structure I recommend for any serious Express.js API:

```
express-api-project/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── index.js
│   │   └── userRoutes.js
│   ├── services/
│   │   └── userService.js
│   ├── utils/
│   │   ├── logger.js
│   │   └── apiResponse.js
│   └── app.js
├── tests/
│   ├── unit/
│   └── integration/
├── .env
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

This structure separates concerns clearly. Controllers handle HTTP requests and responses, services contain business logic, models define data structures, and middlewares handle cross-cutting concerns. This separation becomes invaluable as your application grows.

## Building the Application Foundation

Let's start with `server.js`, the entry point of our application:

```javascript
require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  server.close(() => process.exit(1));
});
```

Notice the graceful shutdown handlers. These ensure your application closes cleanly, finishing ongoing requests before shutting down. In production, this prevents abrupt connection terminations that can corrupt data or leave transactions incomplete.

Now, let's build `src/app.js`, where we configure Express:

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
```

This setup includes several production-ready features. Helmet adds security headers automatically. The CORS configuration reads allowed origins from environment variables. We limit request body sizes to prevent abuse. The health check endpoint is essential for container orchestration systems like Kubernetes.

## Implementing Robust Error Handling

Error handling is where many Express applications fall short. Poor error handling leads to confusing error messages, security vulnerabilities (leaked stack traces), and difficult debugging. Let's build a comprehensive error handling system.

First, create a custom error class in `src/utils/apiError.js`:

```javascript
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
```

The `isOperational` flag distinguishes between operational errors (like validation failures) and programming errors (like syntax errors). This distinction helps us decide whether to restart the application or just log and continue.

Now, implement the error handler middleware in `src/middlewares/errorHandler.js`:

```javascript
const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  // Default to 500 server error
  if (!statusCode) {
    statusCode = 500;
  }

  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id
  });

  // Don't leak error details in production
  const response = {
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err
    })
  };

  res.status(statusCode).json(response);
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorHandler, asyncHandler };
```

The `asyncHandler` wrapper is crucial. It catches errors in async route handlers and passes them to Express's error handling middleware. Without this, unhandled promise rejections can crash your application.

## Designing RESTful Routes with Proper Controllers

Let's build a complete user management system to demonstrate proper REST API design. Start with routes in `src/routes/userRoutes.js`:

```javascript
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { asyncHandler } = require('../middlewares/errorHandler');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateUser, validateUserId } = require('../middlewares/validation');

// Public routes
router.post(
  '/register',
  validateUser,
  asyncHandler(userController.register)
);

router.post(
  '/login',
  asyncHandler(userController.login)
);

// Protected routes
router.use(authenticate); // All routes below require authentication

router.get(
  '/profile',
  asyncHandler(userController.getProfile)
);

router.put(
  '/profile',
  validateUser,
  asyncHandler(userController.updateProfile)
);

// Admin only routes
router.get(
  '/',
  authorize('admin'),
  asyncHandler(userController.getAllUsers)
);

router.get(
  '/:id',
  validateUserId,
  asyncHandler(userController.getUserById)
);

router.delete(
  '/:id',
  authorize('admin'),
  validateUserId,
  asyncHandler(userController.deleteUser)
);

module.exports = router;
```

This routing structure demonstrates several important patterns. Middleware is applied in logical order: validation before business logic, authentication before authorization. We group routes by access level. The asyncHandler wraps all async functions to catch errors properly.

Now implement the controller in `src/controllers/userController.js`:

```javascript
const userService = require('../services/userService');
const ApiError = require('../utils/apiError');

const userController = {
  async register(req, res) {
    const userData = req.body;
    const result = await userService.createUser(userData);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  },

  async login(req, res) {
    const { email, password } = req.body;
    const result = await userService.authenticateUser(email, password);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  },

  async getProfile(req, res) {
    const userId = req.user.id;
    const user = await userService.getUserById(userId);
    
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  },

  async updateProfile(req, res) {
    const userId = req.user.id;
    const updates = req.body;
    const updatedUser = await userService.updateUser(userId, updates);
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  },

  async getAllUsers(req, res) {
    const { page = 1, limit = 10, search = '' } = req.query;
    const result = await userService.getAllUsers({
      page: parseInt(page),
      limit: parseInt(limit),
      search
    });
    
    res.status(200).json({
      success: true,
      data: result.users,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: result.pages
      }
    });
  },

  async getUserById(req, res) {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  },

  async deleteUser(req, res) {
    const { id } = req.params;
    await userService.deleteUser(id);
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  }
};

module.exports = userController;
```

Controllers should be thin—they handle HTTP concerns like status codes and response formatting, but delegate business logic to services. This separation makes testing easier and keeps controllers focused on their single responsibility.

## Implementing Business Logic in Services

Services contain your application's business logic. They're framework-agnostic, which means you can test them without Express or HTTP mocking. Here's `src/services/userService.js`:

```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/apiError');

const userService = {
  async createUser(userData) {
    const { email, password, name } = userData;
    
    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new ApiError(409, 'Email already registered');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name
    });
    
    // Generate token
    const token = this.generateToken(user);
    
    return {
      user: this.sanitizeUser(user),
      token
    };
  },

  async authenticateUser(email, password) {
    const user = await User.findByEmail(email);
    
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }
    
    const token = this.generateToken(user);
    
    return {
      user: this.sanitizeUser(user),
      token
    };
  },

  async getUserById(userId) {
    const user = await User.findById(userId);
    return user ? this.sanitizeUser(user) : null;
  },

  async updateUser(userId, updates) {
    const allowedUpdates = ['name', 'email', 'bio', 'avatar'];
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});
    
    if (filteredUpdates.email) {
      const existingUser = await User.findByEmail(filteredUpdates.email);
      if (existingUser && existingUser.id !== userId) {
        throw new ApiError(409, 'Email already in use');
      }
    }
    
    const user = await User.update(userId, filteredUpdates);
    return this.sanitizeUser(user);
  },

  async getAllUsers(options) {
    const { page, limit, search } = options;
    const offset = (page - 1) * limit;
    
    const { users, total } = await User.findAll({
      offset,
      limit,
      search
    });
    
    return {
      users: users.map(u => this.sanitizeUser(u)),
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    };
  },

  async deleteUser(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    
    await User.delete(userId);
  },

  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  },

  sanitizeUser(user) {
    const { password, ...sanitized } = user;
    return sanitized;
  }
};

module.exports = userService;
```

Notice how services validate business rules, handle errors, and never touch HTTP concepts like `req` or `res`. The `sanitizeUser` method removes sensitive data before sending responses. This prevents accidentally leaking password hashes or other sensitive fields.

## Building Authentication and Authorization Middleware

Authentication and authorization are critical for any production API. Let's implement both in `src/middlewares/auth.js`:

```javascript
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    // Extract token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication required');
    }
    
    const token = authHeader.substring(7);
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id);
    
    if (!user) {
      throw new ApiError(401, 'Invalid authentication token');
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new ApiError(401, 'Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(new ApiError(401, 'Token expired'));
    } else {
      next(error);
    }
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Insufficient permissions'));
    }
    
    next();
  };
};

module.exports = { authenticate, authorize };
```

This authentication middleware extracts and validates JWT tokens, handles various error cases, and attaches the authenticated user to the request object. The `authorize` function accepts multiple roles, making it flexible for complex permission systems.

## Implementing Request Validation

Validation prevents bad data from entering your system. I use Joi for validation because it's expressive and provides excellent error messages. Here's `src/middlewares/validation.js`:

```javascript
const Joi = require('joi');
const ApiError = require('../utils/apiError');

const schemas = {
  user: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required(),
    bio: Joi.string().max(500).optional(),
    avatar: Joi.string().uri().optional()
  }),

  userUpdate: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    bio: Joi.string().max(500).optional(),
    avatar: Joi.string().uri().optional()
  }).min(1),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  userId: Joi.object({
    id: Joi.string().uuid().required()
  })
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      throw new ApiError(400, 'Validation failed', true, JSON.stringify(errors));
    }
    
    req.body = value;
    next();
  };
};

const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      throw new ApiError(400, 'Invalid parameters', true, JSON.stringify(errors));
    }
    
    req.params = value;
    next();
  };
};

module.exports = {
  validateUser: validate(schemas.user),
  validateUserUpdate: validate(schemas.userUpdate),
  validateLogin: validate(schemas.login),
  validateUserId: validateParams(schemas.userId)
};
```

This validation system provides detailed error messages, strips unknown fields (preventing mass assignment vulnerabilities), and validates both request bodies and parameters.

## Database Integration Best Practices

For this example, let's use PostgreSQL with the `pg` library. Here's `src/config/database.js`:

```javascript
const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  logger.info('Database connection established');
});

pool.on('error', (err) => {
  logger.error('Unexpected database error', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect()
};
```

Now implement the User model in `src/models/User.js`:

```javascript
const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class User {
  static async create(userData) {
    const { email, password, name } = userData;
    const id = uuidv4();
    
    const query = `
      INSERT INTO users (id, email, password, name, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *
    `;
    
    const result = await db.query(query, [id, email, password, name]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async update(id, updates) {
    const allowedFields = ['name', 'email', 'bio', 'avatar'];
    const setClauses = [];
    const values = [];
    let paramCount = 1;
    
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        setClauses.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });
    
    if (setClauses.length === 0) {
      return this.findById(id);
    }
    
    setClauses.push(`updated_at = NOW()`);
    values.push(id);
    
    const query = `
      UPDATE users 
      SET ${setClauses.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll({ offset, limit, search }) {
    let query = 'SELECT * FROM users';
    const values = [];
    let paramCount = 1;
    
    if (search) {
      query += ` WHERE name ILIKE $${paramCount} OR email ILIKE $${paramCount}`;
      values.push(`%${search}%`);
      paramCount++;
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);
    
    const [usersResult, countResult] = await Promise.all([
      db.query(query, values),
      db.query(`SELECT COUNT(*) FROM users ${search ? 'WHERE name ILIKE $1 OR email ILIKE $1' : ''}`, 
               search ? [`%${search}%`] : [])
    ]);
    
    return {
      users: usersResult.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1';
    await db.query(query, [id]);
  }
}

module.exports = User;
```

This model encapsulates all database operations. It uses parameterized queries to prevent SQL injection and provides a clean interface for the service layer.

## Implementing Rate Limiting and Security

Production APIs need protection against abuse. Install rate limiting middleware:

```bash
npm install express-rate-limit
```

Create `src/middlewares/rateLimiter.js`:

```javascript
const rateLimit = require('express-rate-limit');
const ApiError = require('../utils/apiError');

const createRateLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
    max: options.max || 100,
    message: options.message || 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      throw new ApiError(429, options.message || 'Too many requests');
    }
  });
};

const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again later'
});

const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100
});

module.exports = { authLimiter, apiLimiter, createRateLimiter };
```

Apply these limiters in your routes:

```javascript
const { authLimiter } = require('../middlewares/rateLimiter');

router.post('/login', authLimiter, asyncHandler(userController.login));
router.post('/register', authLimiter, asyncHandler(userController.register));
```

## API Versioning Strategy

As your API evolves, you'll need versioning to maintain backward compatibility. I prefer URL-based versioning for its clarity. Update your route structure:

```javascript
// src/routes/index.js
const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');

router.use('/users', userRoutes);

module.exports = router;
```

In `app.js`, mount this under `/api/v1`:

```javascript
app.use('/api/v1', routes);
```

When you need to introduce breaking changes, create a new version:

```javascript
const v1Routes = require('./routes/v1');
const v2Routes = require('./routes/v2');

app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);
```

## Testing Your Express.js API

Testing ensures your API behaves correctly and catches regressions. Install testing dependencies:

```bash
npm install --save-dev jest supertest @types/jest
```

Configure Jest in `package.json`:

```json
{
  "jest": {
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": ["/node_modules/"],
    "testMatch": ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"]
  }
}
```

Create an integration test in `tests/integration/user.test.js`:

```javascript
const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/config/database');

describe('User API', () => {
  beforeAll(async () => {
    // Setup test database
    await db.query('DELETE FROM users');
  });

  afterAll(async () => {
    // Cleanup
    await db.query('DELETE FROM users');
  });

  describe('POST /api/v1/users/register', () => {
    it('should register a new user', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!'
      };

      const response = await request(app)
        .post('/api/v1/users/register')
        .send(newUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(newUser.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should fail with duplicate email', async () => {
      const user = {
        name: 'Jane Doe',
        email: 'john@example.com',
        password: 'Password123!'
      };

      await request(app)
        .post('/api/v1/users/register')
        .send(user)
        .expect(409);
    });

    it('should fail with invalid email', async () => {
      const user = {
        name: 'Invalid User',
        email: 'invalid-email',
        password: 'Password123!'
      };

      await request(app)
        .post('/api/v1/users/register')
        .send(user)
        .expect(400);
    });
  });

  describe('POST /api/v1/users/login', () => {
    it('should login existing user', async () => {
      const credentials = {
        email: 'john@example.com',
        password: 'Password123!'
      };

      const response = await request(app)
        .post('/api/v1/users/login')
        .send(credentials)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
    });

    it('should fail with wrong password', async () => {
      const credentials = {
        email: 'john@example.com',
        password: 'WrongPassword'
      };

      await request(app)
        .post('/api/v1/users/login')
        .send(credentials)
        .expect(401);
    });
  });
});
```

These tests cover happy paths and error cases, ensuring your API handles both correctly.

## Performance Optimization Techniques

Performance matters for production APIs. Here are optimization strategies I use consistently:

### Response Compression

Install compression middleware:

```bash
npm install compression
```

Add to `app.js`:

```javascript
const compression = require('compression');
app.use(compression());
```

This automatically compresses responses, reducing bandwidth usage significantly.

### Database Connection Pooling

We already implemented this in our database configuration. Connection pooling reuses database connections instead of creating new ones for each request, dramatically improving performance under load.

### Caching Strategies

For frequently accessed data, implement caching. Here's a simple Redis-based cache:

```bash
npm install redis
```

Create `src/utils/cache.js`:

```javascript
const redis = require('redis');
const logger = require('./logger');

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});

client.on('error', (err) => {
  logger.error('Redis error:', err);
});

const cache = {
  async get(key) {
    return new Promise((resolve, reject) => {
      client.get(key, (err, data) => {
        if (err) reject(err);
        resolve(data ? JSON.parse(data) : null);
      });
    });
  },

  async set(key, value, expirationInSeconds = 3600) {
    return new Promise((resolve, reject) => {
      client.setex(key, expirationInSeconds, JSON.stringify(value), (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  },

  async delete(key) {
    return new Promise((resolve, reject) => {
      client.del(key, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
};

module.exports = cache;
```

Use caching in your services:

```javascript
async getUserById(userId) {
  const cacheKey = `user:${userId}`;
  const cached = await cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  const user = await User.findById(userId);
  
  if (user) {
    await cache.set(cacheKey, this.sanitizeUser(user));
  }
  
  return user ? this.sanitizeUser(user) : null;
}
```

## Logging and Monitoring

Comprehensive logging is essential for debugging production issues. Create a robust logger in `src/utils/logger.js`:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'express-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger;
```

## Deployment Preparation

Before deploying, ensure your application is production-ready. Create a comprehensive `.env.example`:

```
NODE_ENV=production
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_user
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Logging
LOG_LEVEL=info
```

Create a `Dockerfile` for containerization:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000

USER node

CMD ["node", "server.js"]
```

And a `docker-compose.yml` for local development:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: express_api
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

## Final Thoughts and Production Checklist

Building production-ready REST APIs with Express.js requires attention to many details beyond just handling HTTP requests. Here's a checklist I follow before deploying:

- **Security**: Helmet configured, CORS properly set, input validation on all endpoints, authentication and authorization working correctly
- **Error Handling**: Custom error classes, proper error middleware, no leaked stack traces in production
- **Performance**: Compression enabled, database connection pooling configured, caching implemented for frequently accessed data
- **Monitoring**: Comprehensive logging, health check endpoints, error tracking service integrated
- **Testing**: Integration tests covering critical paths, unit tests for complex business logic
- **Documentation**: API documentation (consider Swagger/OpenAPI), README with setup instructions
- **Environment Configuration**: All secrets in environment variables, different configs for dev/staging/production
- **Graceful Shutdown**: Proper cleanup of database connections and ongoing requests
- **Rate Limiting**: Protection against abuse on sensitive endpoints
- **Database**: Migrations system in place, connection pooling configured, proper indexing

Express.js gives you the flexibility to build APIs exactly how you want them. This flexibility means you need to make good architectural decisions from the start. The patterns I've shared here—separating concerns into routes, controllers, services, and models; implementing robust error handling; adding comprehensive validation; and thinking about performance and security from day one—will help you build APIs that are not just functional, but maintainable and scalable.

Remember that building a great API is iterative. Start with solid foundations, test thoroughly, and refine based on real-world usage. The architecture I've outlined here scales from small projects to large applications handling millions of requests, because it's built on principles that remain constant regardless of scale: separation of concerns, proper error handling, comprehensive testing, and attention to security.

Whether you're building a simple CRUD API or a complex microservice, these patterns will serve you well. Take them, adapt them to your needs, and build something great.
