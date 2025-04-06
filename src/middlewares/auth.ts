import { JWT_SECRET } from "../config/env";
import { expressjwt } from "express-jwt";

export const authenticateJWT = expressjwt({
  secret: JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "user",
});
