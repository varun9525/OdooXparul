import { Router } from 'express';
import {
  createCommunityPostController,
  getCommunityPostsController,
  likeCommunityPostController,
} from '../controllers/community.js';

const router = Router();

router.get('/', getCommunityPostsController);
router.post('/', createCommunityPostController);
router.post('/:postId/like', likeCommunityPostController);

export default router;
