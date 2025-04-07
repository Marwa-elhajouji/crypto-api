import { generateToken } from "../../utils/generate-token";
import { JWT_SECRET } from "../../config/env";
import jwt from "jsonwebtoken";

describe("generateToken", () => {
  const payload = { userId: "123", role: "admin" };

  it("should generate a valid JWT token", () => {
    const token = generateToken(payload);

    const decoded = jwt.decode(token) as jwt.JwtPayload;
    expect(decoded.userId).toBe("123");
    expect(decoded.role).toBe("admin");
  });

  it("should generate a token that expires in 1h", () => {
    const now = Math.floor(Date.now() / 1000);
    const token = generateToken(payload);
    const decoded = jwt.decode(token) as jwt.JwtPayload;

    expect(decoded.exp).toBeDefined();
    expect(decoded.exp! - now).toBeLessThanOrEqual(3600);
  });

  it("should be verifiable with the same secret", () => {
    const token = generateToken(payload);
    const verified = jwt.verify(token, JWT_SECRET);

    expect(verified).toMatchObject(payload);
  });
});
