import { z } from "zod";

export const BaseEntitySchema = z.object({
  id: z.string().nonempty("ID cannot be null or empty"),
});

export type BaseEntity = z.infer<typeof BaseEntitySchema>;
