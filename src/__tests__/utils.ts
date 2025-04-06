import { JWT_SECRET } from "../config/env";
import jwt from "jsonwebtoken";

export type AnyPayload = {
  [key: string]: unknown;
};

export const generateToken = (payload: AnyPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { algorithm: "HS256", expiresIn: "1h" });
};
