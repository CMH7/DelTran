import type { Deltran, DeltranDoc } from "@/domain/entities/deltran.schema";
import { DeltranDocSchema } from "@/domain/entities/deltran.schema";
import type { DeltranRepo } from "@/domain/repositories/deltran.repo";
import { fbaseAdminFstore } from "@/infra/db/fstore/fbase-admin";

export class FStoreDeltranAdapter implements DeltranRepo {
  async createTransaction(transaction: Deltran): Promise<Deltran> {
    await fbaseAdminFstore.collection("transactions").add(transaction);
    return transaction;
  }

  async getTransactionById(id: string): Promise<DeltranDoc | null> {
    const doc = await fbaseAdminFstore.collection("transactions").doc(id).get();
    if (!doc.exists) return null;
    return DeltranDocSchema.parse({ id: doc.id, ...doc.data() });
  }

  async updateTransaction(id: string, transaction: Partial<Deltran>): Promise<DeltranDoc | null> {
    await fbaseAdminFstore.collection("transactions").doc(id).update(transaction);
    const updated = await fbaseAdminFstore.collection("transactions").doc(id).get();
    if (!updated.exists) return null;
    return DeltranDocSchema.parse({ id: updated.id, ...updated.data() });
  }

  async deleteTransaction(id: string): Promise<boolean> {
    await fbaseAdminFstore.collection("transactions").doc(id).delete();
    return true;
  }

  async listTransactions(filters?: {
    startDate?: Date;
    endDate?: Date;
    status?: string;
  }): Promise<DeltranDoc[]> {
    let query: any = fbaseAdminFstore.collection("transactions");

    // Apply filters
    if (filters?.startDate) {
      query = query.where("tranDate", ">=", filters.startDate);
    }
    if (filters?.endDate) {
      query = query.where("tranDate", "<=", filters.endDate);
    }
    if (filters?.status) {
      query = query.where("status", "==", filters.status);
    }

    const snap = await query.get();
    return snap.docs.map((transaction: any) => {
      const data = transaction.data() as Deltran;
      return DeltranDocSchema.parse({ id: transaction.id, ...data });
    });
  }

  async countTransactionsByDate(date: Date): Promise<number> {
    // Get transactions on this specific date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const snap = await fbaseAdminFstore
      .collection("transactions")
      .where("tranDate", ">=", startOfDay)
      .where("tranDate", "<=", endOfDay)
      .get();

    return snap.size;
  }
}
