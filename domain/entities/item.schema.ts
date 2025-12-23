import { z } from "zod";
import { DescriptableSchema } from "./commons/descriptable.schema";
import { NameableSchema } from "./commons/nameable.schema";
import { BaseEntitySchema } from "./commons/base-entity.schema";

export const ItemSchema = NameableSchema.extend(
  DescriptableSchema.shape,
).extend({
  categoryId: z.string().nonempty("Category is required"),
  price: z.number().min(0, "Price cannot be negative"),
  vendorId: z.string().nonempty("Vendor ID is required"),
});

export const ItemDocSchema = BaseEntitySchema.extend(ItemSchema.shape);

export type Item = z.infer<typeof ItemSchema>;
export type ItemDoc = z.infer<typeof ItemDocSchema>;
