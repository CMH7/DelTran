import { z } from "zod";

export const NameableSchema = z.object({
  name: z.string().nonempty("Name cannot be empty"),
});

export type Nameable = z.infer<typeof NameableSchema>;
