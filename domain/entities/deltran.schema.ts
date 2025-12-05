import { z } from "zod";
import { ExpenseCategorySchema } from "./expense-category.schema";
import { NotableSchema } from "./commons/notable.schema";
import { ItemSchema } from "./item.schema";
import { NameableSchema } from "./commons/nameable.schema";

export const SaleDeductionSchema = NameableSchema.extend({
  amount: z.number().min(0, "Amount cannot be negative"),
}).extend(NotableSchema.shape);

export const DTExpenseSchema = ExpenseCategorySchema.extend({
  qty: z.number().min(1, "Quantity cannot be less than 1"),
  amount: z.number().min(0, "Amount cannot be negative"),
  total: z.number().min(0, "Total cannot be negative"),
}).extend(NotableSchema.shape);

export const AfterSaleDeductionSchema = NameableSchema.extend({
  amount: z.number().min(0, "Amount cannot be negative"),
}).extend(NotableSchema.shape);

export const DeltranSchema = z.object({
  tranDate: z.date(),
  capital: z.number().gte(0, "Capital cannot be negative"),
  items: z.array(ItemSchema).nonempty("Items cannot be empty"),
  saleDeductions: z.array(SaleDeductionSchema),
  cxPayAmt: z.number().gte(0, "Customer payment cannot be negative"),
  expenses: z.array(DTExpenseSchema),
  afterSaleDeductions: z.array(AfterSaleDeductionSchema),
});

export type DTSaleDeduction = z.infer<typeof SaleDeductionSchema>;
export type DTExpense = z.infer<typeof DTExpenseSchema>;
export type DTAfterSaleDeduction = z.infer<typeof AfterSaleDeductionSchema>;
export type Deltran = z.infer<typeof DeltranSchema>;
