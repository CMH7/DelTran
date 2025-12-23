import type { DeltranDoc } from "@/domain/entities/deltran.schema";
import type { DeltranRepo } from "@/domain/repositories/deltran.repo";

export class GetTransactionCase {
  constructor(private transactionRepo: DeltranRepo) {}

  async execute(id: string): Promise<{ message: string; data: DeltranDoc | null }> {
    const result = await this.transactionRepo.getTransactionById(id);
    return {
      message: result ? "Transaction retrieved successfully" : "Transaction not found",
      data: result,
    };
  }
}
