import { base64Encrypt, base64Decrypt } from "../../utils/base64-crypto";

describe("base64-crypto utils", () => {
  const original = "Hello World!";
  const encoded = "SGVsbG8gV29ybGQh";

  it("should encode string to base64", () => {
    const result = base64Encrypt(original);
    expect(result).toBe(encoded);
  });

  it("should decode base64 string to original", () => {
    const result = base64Decrypt(encoded);
    expect(result).toBe(original);
  });

  it("should be reversible", () => {
    const result = base64Decrypt(base64Encrypt(original));
    expect(result).toBe(original);
  });


});
