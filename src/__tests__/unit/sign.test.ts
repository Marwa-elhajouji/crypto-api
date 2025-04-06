import { sign, signHmac, validateSignature } from "../../services/sign";
import { SignDtoType } from "../../schemas/signDto";
import { VerifyDtoType } from "../../schemas/verifyDto";
describe("sign", () => {
  const secret = "secret";
  const signFn = (json: string) => signHmac(json, secret);

  it("should return the same signature for same input", () => {
    const input1: SignDtoType = {
      message: "Hello World",
      timestamp: 1616161616,
    };
    const input2: SignDtoType = {
      timestamp: 1616161616,
      message: "Hello World",
    };
    const result1 = sign(input1, signFn);
    const result2 = sign(input2, signFn);

    expect(result2).toEqual(result1);
  });
});
describe("validateSignature", () => {
  const secret = "secret";
  const signFn = (json: string) => signHmac(json, secret);
  const data = {
    message: "Hello World",
    timestamp: 1616161616,
  };
  it("should return true for valid signature", () => {
    const { signature } = sign(data, signFn);
    const input: VerifyDtoType = { data, signature };
    const result = validateSignature(input, signFn);
    expect(validateSignature(input, signFn)).toBe(true);
  });
  it("should return false for invalid signature", () => {
    const fakeSig = "0".repeat(64);
    const input: VerifyDtoType = { data, signature: fakeSig };
    const result = validateSignature(input, signFn);
    expect(validateSignature(input, signFn)).toBe(false);
  });
});
describe("consistency", () => {
  const secret = "my-secret";
  const signFn = (json: string) => signHmac(json, secret);

  it("should return true for signature generated from sign", () => {
    const data = {
      username: "bob",
      timestamp: 123456,
    };

    const { signature } = sign(data, (json) => signHmac(json, secret));

    const input: VerifyDtoType = {
      data,
      signature,
    };

    expect(validateSignature(input, signFn)).toBe(true);
  });
});
