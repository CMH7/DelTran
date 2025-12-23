import { Deduction, DeductionDoc } from "../entities/deduction.schema";

export interface DeductionRepo {
	createDeduction(deduction: Deduction): Promise<Deduction>;
	getDeductionById(id: string): Promise<DeductionDoc | null>;
	updateDeduction(
		id: string,
		deduction: Partial<Deduction>,
	): Promise<DeductionDoc | null>;
	deleteDeduction(id: string): Promise<boolean>;
	listDeductions(): Promise<DeductionDoc[]>;
}
