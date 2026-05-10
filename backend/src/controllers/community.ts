import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database.js';
import { sendError, sendSuccess } from '../utils/helpers.js';

export const getCommunityPostsController = async (_req: any, res: Response) => {
  try {
    const result = await db.query(`
      SELECT cp.id, cp.title, cp.content, cp.destination, cp.likes_count, cp.created_at,
             u.username, u.first_name, u.last_name, u.avatar_url
      FROM community_posts cp
      INNER JOIN users u ON u.id = cp.user_id
      ORDER BY cp.created_at DESC
    `);

    sendSuccess(res, result.rows.map((post: any) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      destination: post.destination,
      likesCount: post.likes_count,
      createdAt: post.created_at,
      author: {
        username: post.username,
        firstName: post.first_name,
        lastName: post.last_name,
        avatarUrl: post.avatar_url,
      },
    })));
  } catch (error) {
    console.error('Get community posts error:', error);
    sendError(res, 'Failed to get community posts', 500);
  }
};

export const createCommunityPostController = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { title, content, destination } = req.body;

    if (!title || !content) {
      return sendError(res, 'Title and content are required', 400);
    }

    const id = uuidv4();
    const result = await db.query(
      'INSERT INTO community_posts (id, user_id, title, content, destination) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, content, destination, likes_count, created_at',
      [id, userId, title, content, destination || null]
    );

    sendSuccess(res, {
      id: result.rows[0].id,
      title: result.rows[0].title,
      content: result.rows[0].content,
      destination: result.rows[0].destination,
      likesCount: result.rows[0].likes_count,
      createdAt: result.rows[0].created_at,
    }, 201);
  } catch (error) {
    console.error('Create community post error:', error);
    sendError(res, 'Failed to create community post', 500);
  }
};

export const likeCommunityPostController = async (req: any, res: Response) => {
  try {
    const { postId } = req.params;
    const result = await db.query(
      'UPDATE community_posts SET likes_count = likes_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, likes_count',
      [postId]
    );

    if (result.rows.length === 0) {
      return sendError(res, 'Post not found', 404);
    }

    sendSuccess(res, { id: result.rows[0].id, likesCount: result.rows[0].likes_count });
  } catch (error) {
    console.error('Like community post error:', error);
    sendError(res, 'Failed to like community post', 500);
  }
};
