import "dotenv/config";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { connectDb } from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { authRouter } from "./routes/auth.js";
import { commentRouter } from "./routes/comments.js";
import { recipeRouter } from "./routes/recipes.js";
import { userRouter } from "./routes/users.js";

async function bootstrap() {
  try {
    await connectDb(process.env.MONGODB_URI ?? "mongodb://localhost:27017/ai-chef");
    console.log("MongoDB connection: success");
  } catch (error) {
    console.warn("MongoDB connection: failed, continuing in degraded mode", error.message);
  }

  const app = express();

  app.use(cors({ origin: process.env.CLIENT_URL ?? "http://localhost:5173", credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "ai-chef-backend" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/recipes", recipeRouter);
  app.use("/api/comments", commentRouter);
  app.use("/api/users", userRouter);

  app.use(notFound);
  app.use(errorHandler);

  const port = Number(process.env.PORT ?? 5000);
  console.log("Environment loaded:", {
    PORT: process.env.PORT ? "set" : "default",
    MONGODB_URI: process.env.MONGODB_URI ? "set" : "missing",
    JWT_SECRET: process.env.JWT_SECRET ? "set" : "missing",
    CLIENT_URL: process.env.CLIENT_URL ? "set" : "default"
  });

  app.listen(port, () => {
    console.log(`API server listening on http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
