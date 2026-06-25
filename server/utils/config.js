import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT ?? 3000;
export const MONGO_URI = process.env.MONGO_URI;
export const DB_NAME = process.env.DB_NAME || "gen-web-ai-db";
export const JWT_SECRET = process.env.JWT_SECRET;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
export const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
export const MODEL_NAME = "deepseek/deepseek-chat";
