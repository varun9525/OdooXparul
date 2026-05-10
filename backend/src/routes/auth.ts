import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { registerController, loginController, getProfileController, updateProfileController, validateRegister, validateLogin } from '../controllers/auth.js';

const router = Router();

router.post('/register', validateRegister, registerController);
router.post('/login', validateLogin, loginController);
router.get('/profile', authMiddleware, getProfileController);
router.put('/profile', authMiddleware, updateProfileController);

export default router;
