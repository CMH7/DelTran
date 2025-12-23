import type { DeltranRepo } from "@/domain/repositories/deltran.repo";

export class DeleteTransactionCase {
  constructor(private transactionRepo: DeltranRepo) {}

  async execute(id: string): Promise<{ message: string; success: boolean }> {
    const result = await this.transactionRepo.deleteTransaction(id);
    return {
      message: result ? "Transaction deleted successfully" : "Failed to delete transaction",
      success: result,
    };
  }
}
