import { z } from "zod";
import { DescriptableSchema } from "./commons/descriptable.schema";
import { NameableSchema } from "./commons/nameable.schema";

export const ExpenseCategorySchema = NameableSchema.extend(
  DescriptableSchema.shape,
).extend({
  showInDashboard: z.boolean(),
});

export type ExpenseCategory = z.infer<typeof ExpenseCategorySchema>;
