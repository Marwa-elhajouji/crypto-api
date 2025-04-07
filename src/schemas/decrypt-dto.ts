import { z } from "zod";
export const decryptDto = z.record(z.string());
export type DecryptDtoType = z.infer<typeof decryptDto>;
