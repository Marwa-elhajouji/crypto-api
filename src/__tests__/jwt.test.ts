import { decodeToken } from "../utils/jwt";
import { generateToken } from "./utils";

describe("JWT utils", () => {
  const payload = { userId: "abc123", role: "admin" };

  it("should generate and decode token", () => {
    const token = generateToken(payload);
    const decoded = decodeToken(token);
    expect(decoded).toMatchObject(payload);
  });

  it("should return null for invalid token", () => {
    const result = decodeToken("invalid.token.value");
    expect(result).toBeNull();
  });
});
