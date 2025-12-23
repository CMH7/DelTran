import type { Deltran, DeltranDoc } from "@/domain/entities/deltran.schema";
import type { DeltranRepo } from "@/domain/repositories/deltran.repo";

export class UpdateTransactionCase {
  constructor(private transactionRepo: DeltranRepo) {}

  async execute(id: string, transaction: Partial<Deltran>): Promise<{ message: string; data: DeltranDoc | null }> {
    const result = await this.transactionRepo.updateTransaction(id, transaction);
    return {
      message: result ? "Transaction updated successfully" : "Failed to update transaction",
      data: result,
    };
  }
}
