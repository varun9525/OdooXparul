import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/public', publicRoutes);


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
