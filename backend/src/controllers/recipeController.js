import { validationResult } from "express-validator";
import { searchAndRankRecipes, getRecipeById } from "../services/recipeService.js";

export async function searchRecipes(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const ingredients = String(req.query.ingredients || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (ingredients.length === 0) {
    return res.status(400).json({ message: "Please provide at least one ingredient" });
  }

  const filters = {
    cuisine: req.query.cuisine || "All",
    spiceLevel: req.query.spiceLevel || "medium",
    maxCookingTime: req.query.maxCookingTime ? Number(req.query.maxCookingTime) : undefined
  };

  const recipes = await searchAndRankRecipes({ ingredients, filters });
  return res.json({ recipes, total: recipes.length });
}

export async function getRecipe(req, res) {
  const recipe = await getRecipeById(req.params.id);
  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  return res.json({ recipe });
}
