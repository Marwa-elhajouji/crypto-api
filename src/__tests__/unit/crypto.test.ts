import { isBase64 } from "validator";
import { decrypt, encrypt } from "../../services/crypto";
import { base64Encrypt, base64Decrypt } from "../../utils/base64-crypto";
import { EncryptDtoType } from "../../schemas/encryptDto";
import { DecryptDtoType } from "../../schemas/decryptDto";
describe("encrypt", () => {
  it("should apply base64 to top level values", () => {
    const input: EncryptDtoType = {
      name: "John Doe",
      age: 30,
      contact: {
        email: "john@example.com",
        phone: "123-456-7890",
      },
    };
    const result = encrypt(input, base64Encrypt);

    expect(result).toEqual({
      name: base64Encrypt("John Doe"),
      age: base64Encrypt("30"),
      contact: base64Encrypt(
        JSON.stringify({
          email: "john@example.com",
          phone: "123-456-7890",
        })
      ),
    });
  });
});

describe("decrypt", () => {
  it("should decode base64 values", () => {
    const input: DecryptDtoType = {
      name: "Sm9obiBEb2U=",
      age: "MzA=",
      contact:
        "eyJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJwaG9uZSI6IjEyMy00NTYtNzg5MCJ9",
      birth_date: "1998-11-19",
    };
    const result = decrypt(input, base64Decrypt, isBase64);

    expect(result).toEqual({
      name: "John Doe",
      age: 30,
      contact: {
        email: "john@example.com",
        phone: "123-456-7890",
      },
      birth_date: "1998-11-19",
    });
  });
});

describe("consistency", () => {
  it("should return original payload after encrypt then decrypt", () => {
    const input: EncryptDtoType = {
      name: "Alice",
      age: 42,
      contact: {
        email: "alice@example.com",
        phone: "987-654-3210",
      },
    };

    const encrypted = encrypt(input, base64Encrypt);
    const decrypted = decrypt(encrypted, base64Decrypt, isBase64);

    expect(decrypted).toEqual(input);
  });
});
