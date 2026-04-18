import "dotenv/config";
import { safeFetchJson } from "../utils/http.js";

function fallbackEnhancements(recipe) {
  const title = recipe.title || "this dish";
  return {
    tips: [
      `Toast whole spices briefly before cooking ${title} to increase aroma.`,
      "Layer salt gradually to keep flavor balanced.",
      "Rest the dish for 5 minutes before serving for better texture."
    ],
    substitutions: [
      "Replace cream with coconut milk for a dairy-free version.",
      "Use tamari in place of soy sauce for gluten-sensitive diets.",
      "Swap white rice for brown rice to increase fiber."
    ],
    variations: [
      "Spicy: add chili oil and crushed red pepper.",
      "Healthy: reduce oil by 25% and add steamed vegetables.",
      "Vegan: replace animal proteins with tofu or chickpeas."
    ],
    instructions:
      recipe.instructions?.length > 0
        ? recipe.instructions
        : [
            "Prepare ingredients by washing, chopping, and measuring everything.",
            "Cook aromatics first, then build flavors in layers.",
            "Simmer until ingredients are cooked through and flavors combine.",
            "Adjust seasoning, garnish, and serve warm."
          ]
  };
}

async function geminiEnhanceRecipe(recipe, userIngredients = []) {
  if (!(process.env.GEMINI_API_KEY ?? "")) {
    return fallbackEnhancements(recipe);
  }

  const prompt = `You are a chef assistant. Given recipe JSON and user ingredients, return strict JSON with keys: tips (array), substitutions (array), variations (array), instructions (array).\nRecipe: ${JSON.stringify(
    recipe
  )}\nUser Ingredients: ${userIngredients.join(", ")}\nKeep suggestions practical and concise.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY ?? ""}`;

  try {
    const data = await safeFetchJson(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, responseMimeType: "application/json" }
      })
    });

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return fallbackEnhancements(recipe);
    }

    const parsed = JSON.parse(text);
    return {
      tips: parsed.tips ?? [],
      substitutions: parsed.substitutions ?? [],
      variations: parsed.variations ?? [],
      instructions: parsed.instructions?.length ? parsed.instructions : recipe.instructions ?? []
    };
  } catch {
    return fallbackEnhancements(recipe);
  }
}

export async function enhanceRecipeWithAI(recipe, userIngredients) {
  if ((process.env.AI_PROVIDER ?? "gemini") === "gemini") {
    return geminiEnhanceRecipe(recipe, userIngredients);
  }

  return fallbackEnhancements(recipe);
}

export async function generateFallbackRecipes(userIngredients, filters = {}) {
  const base = userIngredients.join(", ") || "rice, onion, tomato";

  return [
    {
      externalId: `ai-${Date.now()}-1`,
      source: "ai",
      title: `AI Masala Skillet with ${userIngredients[0] ?? "Veggies"}`,
      image:
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80",
      cuisine: filters.cuisine && filters.cuisine !== "All" ? filters.cuisine : "Indian",
      spiceLevel: filters.spiceLevel || "medium",
      readyInMinutes: 30,
      ingredients: base.split(",").map((i) => ({ name: i.trim(), amount: "as needed", isMissing: false })),
      instructions: [
        "Heat oil in a skillet and sauté aromatics until fragrant.",
        "Add vegetables/protein and cook until lightly browned.",
        "Add spices and moisture (water/coconut milk), then simmer.",
        "Finish with herbs and citrus, then serve hot."
      ],
      aiSuggestions: {
        tips: ["Use fresh ginger-garlic paste for depth."],
        substitutions: ["Use paneer or tofu based on preference."],
        variations: ["Add spinach and lentils for a hearty one-pot meal."]
      },
      ingredientMatchScore: 55,
      matchedIngredients: userIngredients,
      missingIngredients: []
    }
  ];
}
