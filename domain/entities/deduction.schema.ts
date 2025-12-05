import { z } from "zod";
import { NameableSchema } from "./commons/nameable.schema";
import { DescriptableSchema } from "./commons/descriptable.schema";

export const DeductionSchema = NameableSchema.extend(
  DescriptableSchema.shape,
).extend({
  showInDashboard: z.boolean(),
});

export type Deduction = z.infer<typeof DeductionSchema>;
