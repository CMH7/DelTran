import { z } from "zod";
import { NotableSchema } from "./commons/notable.schema";
import { BaseEntitySchema } from "./commons/base-entity.schema";

// Transaction Item - hybrid approach: ID + snapshot
export const TransactionItemSchema = z.object({
  itemId: z.string().nonempty("Item is required"),
  name: z.string().nonempty("Item name is required"),
  price: z.number().min(0, "Price cannot be negative"),
  qty: z.number().min(1, "Quantity must be at least 1"),
  total: z.number().min(0, "Total cannot be negative"),
});

// Transaction Expense - free-form for v1
export const TransactionExpenseSchema = z.object({
  description: z.string().nonempty("Description is required"),
  amount: z.number().min(0, "Amount cannot be negative"),
}).extend(NotableSchema.shape);

// Transaction Deduction - optional reference to preset
export const TransactionDeductionSchema = z.object({
  deductionId: z.string().optional(),
  name: z.string().nonempty("Name is required"),
  amount: z.number().min(0, "Amount cannot be negative"),
}).extend(NotableSchema.shape);

// Main Transaction Schema (Deltran)
export const DeltranSchema = z.object({
  tranDate: z.date(),

  // Customer info
  customerId: z.string().nonempty("Customer is required"),
  customerName: z.string().nonempty("Customer name is required"),
  deliveryLocation: z.string().max(255, "Delivery location too long"),
  deliveryNotes: z.string().max(200, "Delivery notes too long").optional(),

  // Financial
  capital: z.number().gte(0, "Capital cannot be negative"),
  cxPayAmt: z.number().gte(0, "Payment cannot be negative"),

  // Line items
  items: z.array(TransactionItemSchema).nonempty("At least one item is required"),
  expenses: z.array(TransactionExpenseSchema).default([]),
  deductions: z.array(TransactionDeductionSchema).default([]),

  // Metadata
  status: z.enum(["pending", "completed", "cancelled"]).default("completed"),
  refNumber: z.string().optional(),
});

// Document schema with ID
export const DeltranDocSchema = BaseEntitySchema.extend(DeltranSchema.shape);

// Type exports
export type TransactionItem = z.infer<typeof TransactionItemSchema>;
export type TransactionExpense = z.infer<typeof TransactionExpenseSchema>;
export type TransactionDeduction = z.infer<typeof TransactionDeductionSchema>;
export type Deltran = z.infer<typeof DeltranSchema>;
export type DeltranDoc = z.infer<typeof DeltranDocSchema>;
