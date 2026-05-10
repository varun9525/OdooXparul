import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware } from './middleware/auth.js';
import { initializeDatabase } from './config/initDb.js';
import db from './config/database.js';
import authRoutes from './routes/auth.js';
import tripRoutes from './routes/trips.js';
import communityRoutes from './routes/community.js';
import publicRoutes from './routes/public.js';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

const getAllowedOrigins = () => {
  const defaultOrigins = ['http://localhost:5173', 'http://localhost:5174'];
  const singleOrigin = process.env.FRONTEND_URL?.trim();
  const extraOrigins = process.env.FRONTEND_URLS
    ? process.env.FRONTEND_URLS.split(',').map((origin) => origin.trim()).filter(Boolean)
    : [];

  return [...new Set([...defaultOrigins, ...(singleOrigin ? [singleOrigin] : []), ...extraOrigins])];
};

const allowedOrigins = getAllowedOrigins();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));


// Initialize database and start server
const startServer = async () => {
  try {
    // initialize underlying DB adapter (attempt Postgres, fallback SQLite)
    await db.initialize();
    await initializeDatabase();
    app.listen(port, () => {
      console.log(`✓ Server is running on http://localhost:${port}`);
      console.log(`✓ Allowed frontend origins: ${allowedOrigins.join(', ')}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
