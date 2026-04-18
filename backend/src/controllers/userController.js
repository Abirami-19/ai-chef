import { validationResult } from "express-validator";
import { User } from "../models/User.js";
import { Comment } from "../models/Comment.js";

export async function getProfile(req, res) {
  const user = await User.findById(req.user.sub).lean();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const comments = await Comment.find({ userId: req.user.sub })
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

  return res.json({
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      favorites: user.favorites,
      preferences: user.preferences,
      commentHistory: comments
    }
  });
}

export async function updatePreferences(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await User.findByIdAndUpdate(
    req.user.sub,
    { $set: { preferences: req.body.preferences } },
    { new: true }
  ).lean();

  return res.json({ preferences: user.preferences });
}

export async function toggleFavorite(req, res) {
  const user = await User.findById(req.user.sub);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const recipeId = req.params.recipeId;
  if (user.favorites.includes(recipeId)) {
    user.favorites = user.favorites.filter((id) => id !== recipeId);
  } else {
    user.favorites.push(recipeId);
  }

  await user.save();

  return res.json({ favorites: user.favorites });
}
