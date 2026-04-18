import { Router } from "express";
import { body } from "express-validator";
import { addComment, getRecipeComments } from "../controllers/commentController.js";
import { authRequired } from "../middleware/auth.js";

export const commentRouter = Router();

commentRouter.get("/:recipeId", getRecipeComments);
commentRouter.post("/:recipeId", authRequired, body("content").isLength({ min: 1, max: 1000 }), addComment);
