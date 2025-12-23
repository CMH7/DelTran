import { DeductionDoc } from "@/domain/entities/deduction.schema";
import { DeductionRepo } from "@/domain/repositories/deduction.repo";

export class ListDeductionsCase {
	constructor(private readonly deductionRepo: DeductionRepo) {}

	async execute(): Promise<{ message: string; data: DeductionDoc[] }> {
		const result = await this.deductionRepo.listDeductions();

		return {
			message: "Deductions retrieved successfully",
			data: result,
		};
	}
}
