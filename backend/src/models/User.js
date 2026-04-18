import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    favorites: [{ type: String }],
    preferences: {
      cuisine: {
        type: [String],
        default: ["Indian", "Asian", "Global"]
      },
      spiceLevel: { type: String, enum: ["low", "medium", "high"], default: "medium" },
      maxCookingTime: { type: Number, default: 60 }
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
