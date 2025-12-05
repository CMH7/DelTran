import { z } from "zod";

export const DescriptableSchema = z.object({
  description: z.string().max(200, "Description cannot exceed 200 characters"),
});

export type Descriptable = z.infer<typeof DescriptableSchema>;
