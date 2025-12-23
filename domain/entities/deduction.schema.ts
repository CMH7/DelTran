import { z } from "zod";
import { NameableSchema } from "./commons/nameable.schema";
import { DescriptableSchema } from "./commons/descriptable.schema";
import { BaseEntitySchema } from "./commons/base-entity.schema";

export const DeductionSchema = NameableSchema.extend(
  DescriptableSchema.shape,
).extend({
  showInDashboard: z.boolean(),
});

export const DeductionDocSchema = BaseEntitySchema.extend(DeductionSchema.shape);

export type Deduction = z.infer<typeof DeductionSchema>;
export type DeductionDoc = z.infer<typeof DeductionDocSchema>;
