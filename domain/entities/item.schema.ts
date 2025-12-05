import { z } from "zod";
import { DescriptableSchema } from "./commons/descriptable.schema";
import { NameableSchema } from "./commons/nameable.schema";
import { VendorSchema } from "./vendor.schema";

export const ItemCategorySchema = NameableSchema.extend({
  description: z.string().nonempty("Description cannot be empty"),
});

export const ItemSchema = NameableSchema.extend(
  DescriptableSchema.shape,
).extend({
  category: ItemCategorySchema,
  price: z.number().min(0, "Price cannot be negative"),
  vendor: VendorSchema,
});

export type ItemCategory = z.infer<typeof ItemCategorySchema>;
export type Item = z.infer<typeof ItemSchema>;
