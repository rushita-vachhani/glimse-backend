
import { validationResult } from "express-validator";
import User from "../models/User.js";
import Sport from "../models/Sport.js";
import path from "path";

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: "Validation failed.", details: errors.array() });
    return true; 
  }
  return false;
}

export async function getProfile(req, res) {
  // The user object is attached to the request by the 'protect' middleware.
  console.log("[getProfile] Attempting to retrieve user profile.");
  // The middleware has already fetched the user and removed the password.
  // We can simply return the user object.
  if (req.user) {
    const userProfile = await User.findById(req.user.id).populate('favoriteSport', 'name').select('-password');
    console.log(`[getProfile] User found: ${userProfile.email}. Sending profile.`);
    
    // Convert to object with virtuals to ensure photoUrl is included
    const userObj = userProfile.toObject({ virtuals: true });
    // Remove raw binary photo data to keep response light
    delete userObj.photo;
    delete userObj.photoType;
    
    return res.status(200).json(userObj);
  } else {
    console.error("[getProfile] Error: req.user is not defined. This should not happen if 'protect' middleware is working correctly.");
    return res.status(404).json({ message: "User not found." });
  }
}

export async function editUser(req, res) {
  if (handleValidation(req, res)) return;
  try {
    // User is identified by the JWT from the 'protect' middleware (req.user)
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ error: "User not found." });

    // Get updatable fields from the body
    const { firstName, lastName, favoriteSport, password } = req.body;

    // Update fields if they are provided
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.favoriteSport = favoriteSport || user.favoriteSport;

    // If a new password is provided, the 'pre-save' hook will hash it
    if (password) {
      user.password = password;
    }

    await user.save();

    // Return the updated user, excluding the password
    const updatedUser = await User.findById(req.user.id).populate('favoriteSport', 'name').select('-password');
    
    const userObj = updatedUser.toObject({ virtuals: true });
    delete userObj.photo;
    delete userObj.photoType;

    return res.status(200).json({ message: "Profile updated successfully.", user: userObj });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getSystemAnalytics(req, res) {
  try {
    const totalUsers = await User.countDocuments();
    const totalSports = await Sport.countDocuments();

    // Group users by role
    const usersByRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    // Group users by favorite sport
    const usersBySport = await User.aggregate([
      {
        $lookup: {
          from: "sports",
          localField: "favoriteSport",
          foreignField: "_id",
          as: "sportInfo"
        }
      },
      { $unwind: "$sportInfo" },
      { $group: { _id: "$sportInfo.name", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 } // Top 10 sports
    ]);

    const recentUsers = await User.find({}, 'firstName lastName email role createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      totalUsers,
      totalSports,
      usersByRole,
      usersBySport,
      recentUsers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function deleteUser(req, res) {
  try {
    // Admin deleting a user by ID from params
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ error: "User not found." });
    return res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getAllUsers(req, res) {
  try {
    const users = await User.find({}, { fullName: 1, email: 1, imagePath: 1, _id: 0 });
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getUsers(req, res) {
  try {
    // Admin-only endpoint: returns users WITHOUT password
    const users = await User.find({}, { password: 0, __v: 0 });

    // Process users to include virtuals (photoUrl) but exclude raw photo data
    const safeUsers = users.map(user => {
      const u = user.toObject({ virtuals: true });
      delete u.photo;
      delete u.photoType;
      return u;
    });

    return res.status(200).json(safeUsers);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}


export async function uploadImage(req, res) {
  try {
    // User is identified by the JWT from the 'protect' middleware (req.user)
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    user.photo = req.file.buffer;
    user.photoType = req.file.mimetype;

    const updatedUser = await user.save();

    return res.status(200).json({ message: "Image uploaded successfully.", photoUrl: updatedUser.photoUrl });
  } catch (err) {
    if (err?.message?.includes("Invalid file format")) {
      return res.status(400).json({ error: "Invalid file format. Only JPEG, PNG, and GIF are allowed." });
    }
    return res.status(500).json({ error: "Server error" });
  }
}
