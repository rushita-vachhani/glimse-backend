import express from 'express';
import { forgotPassword, resetPassword } from '../controllers/passwordController.js';

const router = express.Router();

router.post('/forgot', forgotPassword);
router.put('/reset/:resetToken', resetPassword);

export default router;