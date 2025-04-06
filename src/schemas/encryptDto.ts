import { z } from "zod";
export const encryptDto = z.record(z.unknown());
export type EncryptDtoType = z.infer<typeof encryptDto>;
