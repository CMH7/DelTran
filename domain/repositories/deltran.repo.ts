import type { Deltran, DeltranDoc } from "../entities/deltran.schema";

export interface DeltranRepo {
  createTransaction(transaction: Deltran): Promise<Deltran>;
  getTransactionById(id: string): Promise<DeltranDoc | null>;
  updateTransaction(id: string, transaction: Partial<Deltran>): Promise<DeltranDoc | null>;
  deleteTransaction(id: string): Promise<boolean>;
  listTransactions(filters?: {
    startDate?: Date;
    endDate?: Date;
    status?: string;
  }): Promise<DeltranDoc[]>;
  countTransactionsByDate(date: Date): Promise<number>;
}
