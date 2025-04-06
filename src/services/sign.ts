import { createHmac } from "crypto";
import stringify from "json-stable-stringify";
import { SignFn } from "../domain/types";
import { SignDtoType } from "../schemas/signDto";
import { VerifyDtoType } from "../schemas/verifyDto";

export const signHmac = (
  input: string,
  secret: string
): { signature: string } => ({
  signature: createHmac("sha256", secret).update(input).digest("hex"),
});

export const sign = (
  input: SignDtoType,
  signFn: SignFn
): { signature: string } => signFn(stringify(input)!);

export const validateSignature = (
  input: VerifyDtoType,
  signFn: SignFn
): boolean => {
  return sign(input.data, signFn).signature === input.signature;
};
