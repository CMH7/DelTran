import type { Deltran } from "@/domain/entities/deltran.schema";
import type { DeltranRepo } from "@/domain/repositories/deltran.repo";
import { generateRefNumber } from "@/lib/transaction-utils";

export class CreateTransactionCase {
  constructor(private transactionRepo: DeltranRepo) {}

  async execute(transaction: Deltran): Promise<{ message: string; data: Deltran | null }> {
    // Auto-generate reference number if not provided
    if (!transaction.refNumber) {
      const count = await this.transactionRepo.countTransactionsByDate(transaction.tranDate);
      transaction.refNumber = generateRefNumber(transaction.tranDate, count + 1);
    }

    const result = await this.transactionRepo.createTransaction(transaction);
    return {
      message: result ? "Transaction created successfully" : "Failed to create transaction",
      data: result || null,
    };
  }
}
