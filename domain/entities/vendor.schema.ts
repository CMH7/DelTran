import { z } from "zod";
import { NameableSchema } from "./commons/nameable.schema";
import { NotableSchema } from "./commons/notable.schema";
import { BaseEntitySchema } from "./commons/base-entity.schema";

export const VendorSchema = NameableSchema.extend({
	phone: z.string().nonempty("Phone number is required"),
	address: z.string().max(255, "Address is too long"),
}).extend(NotableSchema.shape);

export const VendorDocSchema = BaseEntitySchema.extend(VendorSchema.shape);

export type Vendor = z.infer<typeof VendorSchema>;
export type VendorDoc = z.infer<typeof VendorDocSchema>;
