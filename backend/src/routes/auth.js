import { Router } from "express";
import { body } from "express-validator";
import { login, register } from "../controllers/authController.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  body("username").isLength({ min: 3, max: 32 }),
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  register
);

authRouter.post("/login", body("email").isEmail(), body("password").isLength({ min: 8 }), login);
