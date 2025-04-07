import { pipe, map, toPairs, fromPairs } from "lodash/fp";
import { EncryptFn, DecryptFn, IsEncrypted } from "../types";
import { EncryptDtoType } from "../schemas/encrypt-dto";
import { DecryptDtoType } from "../schemas/decrypt-dto";
const parse = (decoded: string): unknown => {
  try {
    return JSON.parse(decoded);
  } catch {
    return decoded;
  }
};

export const encrypt = (
  input: EncryptDtoType,
  encryptFn: EncryptFn
): Record<string, string> => {
  return pipe(
    toPairs,
    map(([key, value]) => [
      key,
      typeof value === "string"
        ? encryptFn(value)
        : encryptFn(JSON.stringify(value)),
    ]),
    fromPairs
  )(input);
};

export const decrypt = (
  input: DecryptDtoType,
  decryptFn: DecryptFn,
  isEncrypted: IsEncrypted
): Record<string, unknown> => {
  return pipe(
    toPairs,
    map(([keyBy, value]) => [
      keyBy,
      isEncrypted(value) ? pipe(decryptFn, parse)(value) : value,
    ]),
    fromPairs
  )(input);
};
