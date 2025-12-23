import { z } from "zod";
import { NameableSchema } from "./commons/nameable.schema";
import { NotableSchema } from "./commons/notable.schema";
import { BaseEntitySchema } from "./commons/base-entity.schema";

export const CustomerSchema = NameableSchema.extend({
  phone: z.string().nonempty("Phone is required"),
  address: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
}).extend(NotableSchema.shape);

export const CustomerDocSchema = BaseEntitySchema.extend(CustomerSchema.shape);

export type Customer = z.infer<typeof CustomerSchema>;
export type CustomerDoc = z.infer<typeof CustomerDocSchema>;
