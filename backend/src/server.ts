import express, { Express, Response } from 'express';
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

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);

// Protected routes
app.use('/api/trips', authMiddleware, tripRoutes);
app.use('/api/community', authMiddleware, communityRoutes);

// Health check
app.get('/api/health', (_req, res: Response) => {
  res.json({ status: 'OK', message: 'Traveloop backend is running' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // initialize underlying DB adapter (attempt Postgres, fallback SQLite)
    await db.initialize();
    await initializeDatabase();
    app.listen(port, () => {
      console.log(`✓ Server is running on http://localhost:${port}`);
      console.log(`✓ Frontend URL configured: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
