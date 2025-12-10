import express from 'express';
import { register, login } from '../controllers/authController.js';
import { createUserValidation, loginValidation } from '../middleware/validate.js';
import multer from 'multer';

// Multer setup for file uploads
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  if (allowedTypes.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file format. Only JPEG, PNG, and GIF are allowed."));
  }
};
const upload = multer({ storage, fileFilter });

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/auth/register
router.post('/register', upload.single('photo'), createUserValidation, register);

router.post('/login', loginValidation, login);

export default router;
