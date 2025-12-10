import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validationResult } from "express-validator";

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: "Validation failed.", details: errors.array() });
    return true;
  }
  return false;
}

export async function register(req, res) {
  if (handleValidation(req, res)) return;

  try {
    const { firstName, lastName, email, password, role, favoriteSport } = req.body;

    // Validate role
    if (role && !["admin", "user", "analyst"].includes(role)) {
      return res.status(400).json({ error: "Invalid role. Must be 'admin', 'user' or 'analyst'." });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists." });

    const newUser = { firstName, lastName, email, password, role, favoriteSport };

    if (req.file) {
      newUser.photo = req.file.buffer;
      newUser.photoType = req.file.mimetype;
    }
    await User.create(newUser);

    return res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

export async function login(req, res) {
  if (handleValidation(req, res)) return;
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "User not exist" });

    const ok = await user.matchPassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const userProfile = await User.findById(user.id).select('-password');

    return res.status(200).json({ message: "Login successful", token, user: userProfile });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}