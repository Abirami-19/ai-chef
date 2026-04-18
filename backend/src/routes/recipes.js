import { Router } from "express";
import { query } from "express-validator";
import { getRecipe, searchRecipes } from "../controllers/recipeController.js";

export const recipeRouter = Router();

recipeRouter.get(
  "/search",
  query("ingredients").isString().isLength({ min: 1 }),
  searchRecipes
);

recipeRouter.get(
  "/",
  query("ingredients").isString().isLength({ min: 1 }),
  searchRecipes
);

recipeRouter.get("/:id", getRecipe);
