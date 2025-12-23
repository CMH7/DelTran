import {
	Deduction,
	DeductionDoc,
	DeductionDocSchema,
} from "@/domain/entities/deduction.schema";
import { DeductionRepo } from "@/domain/repositories/deduction.repo";
import { fbaseAdminFstore } from "@/infra/db/fstore/fbase-admin";

export class FStoreDeductionAdapter implements DeductionRepo {
	async createDeduction(deduction: Deduction): Promise<Deduction> {
		try {
			await fbaseAdminFstore.collection("deductions").add(deduction);
			return deduction;
		} catch (err: unknown) {
			throw err;
		}
	}
	async getDeductionById(id: string): Promise<DeductionDoc | null> {
		const doc = await fbaseAdminFstore.collection("deductions").doc(id).get();
		if (!doc.exists) return null;
		return DeductionDocSchema.parse({ id: doc.id, ...doc.data() });
	}
	async updateDeduction(
		id: string,
		deduction: Partial<Deduction>,
	): Promise<DeductionDoc | null> {
		await fbaseAdminFstore.collection("deductions").doc(id).update(deduction);
		const updated = await fbaseAdminFstore.collection("deductions").doc(id).get();
		if (!updated.exists) return null;
		return DeductionDocSchema.parse({ id: updated.id, ...updated.data() });
	}
	async deleteDeduction(id: string): Promise<boolean> {
		await fbaseAdminFstore.collection("deductions").doc(id).delete();
		return true;
	}

	async listDeductions(): Promise<DeductionDoc[]> {
		const snap = await fbaseAdminFstore.collection("deductions").get();

		return snap.docs.map((deduction) => {
			const data = deduction.data() as Deduction;

			return DeductionDocSchema.parse({
				id: deduction.id,
				...data,
			});
		});
	}
}
