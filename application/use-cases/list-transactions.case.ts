import type { DeltranDoc } from "@/domain/entities/deltran.schema";
import type { DeltranRepo } from "@/domain/repositories/deltran.repo";

export class ListTransactionsCase {
  constructor(private transactionRepo: DeltranRepo) {}

  async execute(filters?: {
    startDate?: Date;
    endDate?: Date;
    status?: string;
  }): Promise<{ message: string; data: DeltranDoc[] }> {
    const result = await this.transactionRepo.listTransactions(filters);
    return {
      message: "Transactions retrieved successfully",
      data: result,
    };
  }
}
