import type { Deltran } from "@/domain/entities/deltran.schema";

/**
 * Calculate profit from transaction
 * Formula: payment - capital - totalExpenses - totalDeductions
 */
export function calculateProfit(transaction: Deltran): number {
	const totalExpenses = transaction.expenses.reduce(
		(sum, expense) => sum + expense.amount,
		0,
	);
	const totalDeductions = transaction.deductions.reduce(
		(sum, deduction) => sum + deduction.amount,
		0,
	);

	return (
		transaction.cxPayAmt -
		transaction.capital -
		totalExpenses -
		totalDeductions
	);
}

/**
 * Generate transaction reference number
 * Format: DT-YYYYMMDD-####
 * @param date Transaction date
 * @param count Number of transactions on this date (1-indexed)
 */
export function generateRefNumber(date: Date, count: number): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const sequence = String(count).padStart(4, "0");

	return `DT-${year}${month}${day}-${sequence}`;
}
