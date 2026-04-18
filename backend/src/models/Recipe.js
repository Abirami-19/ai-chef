import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema(
  {
    name: String,
    amount: String,
    isMissing: { type: Boolean, default: false }
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    externalId: { type: String, index: true },
    source: { type: String, enum: ["external", "ai", "hybrid"], default: "external" },
    title: { type: String, required: true },
    image: String,
    cuisine: { type: String, default: "Global" },
    spiceLevel: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    readyInMinutes: Number,
    ingredients: [ingredientSchema],
    instructions: [String],
    aiSuggestions: {
      tips: [String],
      substitutions: [String],
      variations: [String]
    },
    ingredientMatchScore: { type: Number, default: 0 },
    matchedIngredients: [String],
    missingIngredients: [String],
    tags: [String]
  },
  { timestamps: true }
);

export const Recipe = mongoose.model("Recipe", recipeSchema);
