import { z } from "zod";

export const NotableSchema = z.object({
  note: z.string().max(200, "Notes cannot exceed 200 characters").optional(),
});

export type Notable = z.infer<typeof NotableSchema>;
