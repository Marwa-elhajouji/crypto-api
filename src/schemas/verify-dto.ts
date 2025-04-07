import { z } from "zod";
export const verifyDto = z.object({
  signature: z.string(),
  data: z.record(z.unknown()),
});
export type VerifyDtoType = z.infer<typeof verifyDto>;
