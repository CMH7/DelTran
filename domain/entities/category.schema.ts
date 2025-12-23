import { z } from "zod";
import { NameableSchema } from "./commons/nameable.schema";
import { DescriptableSchema } from "./commons/descriptable.schema";
import { BaseEntitySchema } from "./commons/base-entity.schema";

export const CategorySchema = NameableSchema.extend(DescriptableSchema.shape);

export const CategoryDocSchema = BaseEntitySchema.extend(CategorySchema.shape);

export type Category = z.infer<typeof CategorySchema>;
export type CategoryDoc = z.infer<typeof CategoryDocSchema>;
