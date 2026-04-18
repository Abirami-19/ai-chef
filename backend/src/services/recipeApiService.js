import "dotenv/config";
import { safeFetchJson } from "../utils/http.js";

function mapSpoonacularRecipe(item) {
  const extendedIngredients = item.extendedIngredients || [];
  return {
    externalId: String(item.id),
    source: "external",
    title: item.title,
    image: item.image,
    cuisine: item.cuisines?.[0] || "Global",
    spiceLevel: "medium",
    readyInMinutes: item.readyInMinutes || 45,
    ingredients: extendedIngredients.map((ingredient) => ({
      name: ingredient.name,
      amount: ingredient.original || ingredient.amount?.toString() || "",
      isMissing: false
    })),
    instructions:
      item.analyzedInstructions?.[0]?.steps?.map((step) => step.step) ||
      ["Follow source instructions from recipe provider."],
    aiSuggestions: { tips: [], substitutions: [], variations: [] },
    tags: item.dishTypes || []
  };
}

export async function searchRecipesFromApi(ingredients = [], filters = {}) {
  if (!(process.env.SPOONACULAR_API_KEY ?? "")) {
    return [];
  }

  const ingredientsQuery = encodeURIComponent(ingredients.join(","));
  const cuisineQuery =
    filters.cuisine && filters.cuisine !== "All"
      ? `&cuisine=${encodeURIComponent(filters.cuisine)}`
      : "";

  const url = `${process.env.SPOONACULAR_BASE_URL ?? "https://api.spoonacular.com"}/recipes/complexSearch?apiKey=${process.env.SPOONACULAR_API_KEY ?? ""}&addRecipeInformation=true&instructionsRequired=true&fillIngredients=true&number=20&sort=popularity${cuisineQuery}&includeIngredients=${ingredientsQuery}`;

  const data = await safeFetchJson(url);
  return (data.results || []).map(mapSpoonacularRecipe);
}
