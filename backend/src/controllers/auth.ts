import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';
import { sendError, sendSuccess } from '../utils/helpers.js';

export const registerController = async (req: any, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, username, password, firstName, lastName } = req.body;

    // Check if user exists
    const userExists = await db.query('SELECT * FROM users WHERE email = $1 OR username = $2', [
      email,
      username,
    ]);

    if (userExists.rows.length > 0) {
      return sendError(res, 'User with this email or username already exists', 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    const userId = uuidv4();

    // Create user
    const result = await db.query(
      'INSERT INTO users (id, email, username, password, first_name, last_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, username, first_name, last_name',
      [userId, email, username, hashedPassword, firstName || null, lastName || null]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    sendSuccess(res, { user, token }, 201);
  } catch (error) {
    console.error('Register error:', error);
    sendError(res, 'Registration failed', 500);
  }
};

export const loginController = async (req: any, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return sendError(res, 'Invalid credentials', 401);
    }

    // Check password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return sendError(res, 'Invalid credentials', 401);
    }

    // Generate token
    const token = generateToken(user.id);

    sendSuccess(res, {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    sendError(res, 'Login failed', 500);
  }
};

export const getProfileController = async (req: any, res: Response) => {
  try {
    const userId = req.userId;

    const result = await db.query('SELECT id, email, username, first_name, last_name, bio, avatar_url, created_at FROM users WHERE id = $1', [
      userId,
    ]);

    if (result.rows.length === 0) {
      return sendError(res, 'User not found', 404);
    }

    const user = result.rows[0];
    sendSuccess(res, {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      bio: user.bio,
      avatarUrl: user.avatar_url,
      createdAt: user.created_at,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    sendError(res, 'Failed to get profile', 500);
  }
};

export const updateProfileController = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { firstName, lastName, bio, avatarUrl } = req.body;

    const result = await db.query(
      'UPDATE users SET first_name = COALESCE($1, first_name), last_name = COALESCE($2, last_name), bio = COALESCE($3, bio), avatar_url = COALESCE($4, avatar_url), updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING id, email, username, first_name, last_name, bio, avatar_url',
      [firstName, lastName, bio, avatarUrl, userId]
    );

    if (result.rows.length === 0) {
      return sendError(res, 'User not found', 404);
    }

    const user = result.rows[0];
    sendSuccess(res, {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      bio: user.bio,
      avatarUrl: user.avatar_url,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    sendError(res, 'Failed to update profile', 500);
  }
};

// Validation middleware functions
export const validateRegister = [
  body('email').isEmail().withMessage('Invalid email'),
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const validateLogin = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
];
