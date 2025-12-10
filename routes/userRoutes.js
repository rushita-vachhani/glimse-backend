import express from "express";
import {
  editUser,
  deleteUser,
  getAllUsers,
  getUsers,
  uploadImage,
  getProfile,
  getSystemAnalytics
} from "../controllers/userController.js";

import { createUserValidation, editUserValidation, loginValidation } from "../middleware/validate.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import { body } from "express-validator";

// Use memory storage to handle file buffer for DB storage
const storage = multer.memoryStorage();
/*
const storage = multer.diskStorage({
  destination: "public/images/",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "user-" + uniqueSuffix + path.extname(file.originalname));
  },
});
*/

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  if (allowedTypes.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file format. Only JPEG, PNG, and GIF are allowed."));
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

const router = express.Router();

// ----------------------------
// PUBLIC ROUTES
// ----------------------------


// ----------------------------
// PROTECTED ROUTES
// ----------------------------

// --- Routes for the authenticated user ---

// GET & UPDATE current user's profile
router.route("/profile")
  .get(protect, getProfile)
  .put(protect, editUserValidation, editUser);

// Upload/update current user's profile picture
router.post("/profile/photo", protect, upload.single("photo"), uploadImage);

// Analyst/Admin System Analytics
router.get("/analyst-data", protect, authorize('analyst', 'admin'), getSystemAnalytics);

// ----------------------------
// ADMIN-ONLY ROUTES
// ----------------------------

// Use a router group for admin routes affecting all users
router.route("/")
  .get(
    protect,
    authorize('admin'),
    getUsers // GET /api/users - For admins to get a list of all users.
  );

// Routes for a specific user by ID
router.route("/:id")
  // You could add GET /api/users/:id for an admin to get a specific user
  // .get(protect, authorize('admin'), getUserById)
  .delete(
    protect,
    authorize('admin'),
    deleteUser
  );

export default router;
