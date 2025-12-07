import { z } from "zod";
import { NameableSchema } from "./commons/nameable.schema";
import { NotableSchema } from "./commons/notable.schema";

export const VendorSchema = NameableSchema.extend({
  phone: z.string().nonempty("Phone number is required"),
  address: z.string().max(255, "Address is too long"),
}).extend(NotableSchema.shape);

export type Vendor = z.infer<typeof VendorSchema>;
