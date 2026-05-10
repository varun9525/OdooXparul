import { Router } from 'express';
import {
  createCommunityPostController,
  getCommunityPostsController,
  likeCommunityPostController,
} from '../controllers/community.js';

import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Auth required for community interactions
router.use(authMiddleware);

router.get('/', getCommunityPostsController);
router.post('/', createCommunityPostController);
router.post('/:postId/like', likeCommunityPostController);

export default router;
