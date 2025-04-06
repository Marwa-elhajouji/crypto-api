import dotenv from "dotenv";
dotenv.config();

const requiredEnv = ["JWT_SECRET", "HMAC_SECRET", "MONGO_URI"] as const;

for (const name of requiredEnv) {
  if (!process.env[name]) {
    throw new Error(`Missing required env var: ${name}`);
  }
}

export const JWT_SECRET = process.env.JWT_SECRET || "default-jwt-secret";

export const HMAC_SECRET = process.env.HMAC_SECRET || "default-hmac-secret";
export const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/riot-take-home";
export const PORT = parseInt(process.env.PORT || "3000", 10);
