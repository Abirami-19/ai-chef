import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { User } from "../models/User.js";

function signToken(user) {
  return jwt.sign(
    {
      sub: user._id,
      username: user.username,
      email: user.email
    },
    process.env.JWT_SECRET ?? "change-me",
    { expiresIn: "7d" }
  );
}

export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    return res.status(409).json({ message: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ username, email, passwordHash });

  return res.status(201).json({
    token: signToken(user),
    user: { id: user._id, username: user.username, email: user.email }
  });
}

export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.json({
    token: signToken(user),
    user: { id: user._id, username: user.username, email: user.email }
  });
}
