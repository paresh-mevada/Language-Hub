import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import grammarRoutes from './routes/grammarRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import userRoutes from './routes/userRoutes.js';
import vocabularyRoutes from './routes/vocabularyRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { notFound } from './middleware/notFoundMiddleware.js';

const app = express();

// 1. Helmet HTTP Security Headers
app.use(helmet());

// 2. CORS Configuration
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      // Allow any explicitly listed origin from CLIENT_URL env var
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Allow any local dev origin (localhost or 127.0.0.1 on any port)
      if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      // Allow all Vercel preview & production deployments (*.vercel.app)
      if (/^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);


// 3. Body Parsers with limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// 4. NoSQL Injection Prevention Middleware
app.use((request, _response, next) => {
  if (request.body && typeof request.body === 'object') {
    sanitizeNoSQL(request.body);
  }
  if (request.query && typeof request.query === 'object') {
    sanitizeNoSQL(request.query);
  }
  if (request.params && typeof request.params === 'object') {
    sanitizeNoSQL(request.params);
  }
  next();
});

function sanitizeNoSQL(obj) {
  for (const key in obj) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeNoSQL(obj[key]);
    }
  }
}

// 5. Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // Limit login/register attempts to 30 per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes.',
  },
});

app.use('/api', globalLimiter);
app.use('/api/auth', authLimiter, authRoutes);

// Health check
app.get('/api/health', (_request, response) => {
  response.status(200).json({
    success: true,
    message: 'Language Hub API is running safely and securely',
  });
});

// App API routes
app.use('/api/users', userRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/grammar', grammarRoutes);
app.use('/api/vocabulary', vocabularyRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
