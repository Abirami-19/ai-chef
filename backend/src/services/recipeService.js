import { Recipe } from "../models/Recipe.js";
import { Comment } from "../models/Comment.js";
import { enhanceRecipeWithAI, generateFallbackRecipes } from "./aiService.js";
import { searchRecipesFromApi } from "./recipeApiService.js";
import { computeIngredientScore, sortByRanking } from "./rankingService.js";

export async function searchAndRankRecipes({ ingredients, filters }) {
  const externalRecipes = await searchRecipesFromApi(ingredients, filters);

  const enriched = await Promise.all(
    externalRecipes.map(async (recipe) => {
      const scoreInfo = computeIngredientScore(
        ingredients,
        recipe.ingredients.map((item) => item.name)
      );

      const ai = await enhanceRecipeWithAI(recipe, ingredients);

      return {
        ...recipe,
        instructions: ai.instructions,
        aiSuggestions: {
          tips: ai.tips,
          substitutions: ai.substitutions,
          variations: ai.variations
        },
        ingredientMatchScore: scoreInfo.score,
        matchedIngredients: scoreInfo.matched,
        missingIngredients: scoreInfo.missing,
        ingredients: recipe.ingredients.map((i) => ({
          ...i,
          isMissing: scoreInfo.missing.includes(i.name.toLowerCase())
        })),
        matchTier: scoreInfo.tier
      };
    })
  );

  const fallbackNeeded = enriched.length < 5;
  const fallback = fallbackNeeded ? await generateFallbackRecipes(ingredients, filters) : [];

  const allRecipes = sortByRanking([...enriched, ...fallback], filters);

  await Recipe.insertMany(allRecipes.slice(0, 10), { ordered: false }).catch(() => null);

  return allRecipes;
}

export async function getRecipeById(recipeId) {
  const recipe =
    (await Recipe.findOne({ $or: [{ _id: recipeId }, { externalId: recipeId }] }).lean()) || null;

  if (!recipe) {
    return null;
  }

  const comments = await Comment.find({ recipeId: recipe.externalId || String(recipe._id) })
    .sort({ createdAt: -1 })
    .lean();

  const related = await Recipe.find({
    cuisine: recipe.cuisine,
    _id: { $ne: recipe._id }
  })
    .sort({ ingredientMatchScore: -1 })
    .limit(6)
    .lean();

  return { ...recipe, comments, relatedRecipes: related };
}
