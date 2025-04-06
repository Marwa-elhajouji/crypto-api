import { z } from "zod";
export const signDto = z.record(z.unknown());
export type SignDtoType = z.infer<typeof signDto>;
