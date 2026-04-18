import { validationResult } from "express-validator";
import { Comment } from "../models/Comment.js";
import { User } from "../models/User.js";

export async function addComment(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await User.findById(req.user.sub);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const comment = await Comment.create({
    recipeId: req.params.recipeId,
    userId: user._id,
    username: user.username,
    content: req.body.content
  });

  return res.status(201).json({ comment });
}

export async function getRecipeComments(req, res) {
  const comments = await Comment.find({ recipeId: req.params.recipeId }).sort({ createdAt: -1 });
  return res.json({ comments });
}
