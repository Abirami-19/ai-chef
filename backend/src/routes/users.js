import { Router } from "express";
import { body } from "express-validator";
import { getProfile, toggleFavorite, updatePreferences } from "../controllers/userController.js";
import { authRequired } from "../middleware/auth.js";

export const userRouter = Router();

userRouter.use(authRequired);

userRouter.get("/me", getProfile);
userRouter.patch(
  "/me/preferences",
  body("preferences").isObject(),
  updatePreferences
);
userRouter.post("/me/favorites/:recipeId", toggleFavorite);
