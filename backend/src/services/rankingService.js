const CUISINE_PRIORITY = {
  indian: 25,
  asian: 20,
  thai: 18,
  chinese: 18,
  japanese: 18,
  korean: 18,
  global: 10
};

const SPICE_BOOST = {
  low: 5,
  medium: 8,
  high: 10
};

export function normalizeIngredient(text) {
  return text.trim().toLowerCase();
}

export function computeIngredientScore(userIngredients, recipeIngredients) {
  const userSet = new Set(userIngredients.map(normalizeIngredient));
  const normalizedRecipe = recipeIngredients.map(normalizeIngredient);

  const matched = normalizedRecipe.filter((item) => userSet.has(item));
  const missing = normalizedRecipe.filter((item) => !userSet.has(item));

  const completeness = normalizedRecipe.length
    ? matched.length / normalizedRecipe.length
    : 0;

  const score = Math.round(completeness * 70 + matched.length * 4 - missing.length * 1.5);

  return {
    score: Math.max(score, 0),
    matched,
    missing,
    tier:
      missing.length === 0 && matched.length > 0
        ? "high"
        : matched.length > 0
          ? "partial"
          : "low"
  };
}

export function computeRecipeRanking(recipe, filters = {}) {
  const cuisineKey = (recipe.cuisine || "global").toLowerCase();
  const cuisineBonus = CUISINE_PRIORITY[cuisineKey] ?? CUISINE_PRIORITY.global;
  const spiceBonus = SPICE_BOOST[(recipe.spiceLevel || "medium").toLowerCase()] ?? 0;

  const cookTimePenalty =
    filters.maxCookingTime && recipe.readyInMinutes > filters.maxCookingTime
      ? Math.min((recipe.readyInMinutes - filters.maxCookingTime) * 0.8, 20)
      : 0;

  const filterCuisineBoost =
    filters.cuisine && filters.cuisine !== "All" && recipe.cuisine === filters.cuisine
      ? 12
      : 0;

  return recipe.ingredientMatchScore + cuisineBonus + spiceBonus + filterCuisineBoost - cookTimePenalty;
}

export function sortByRanking(recipes, filters) {
  return recipes
    .map((recipe) => ({
      ...recipe,
      rankingScore: computeRecipeRanking(recipe, filters)
    }))
    .sort((a, b) => b.rankingScore - a.rankingScore);
}
