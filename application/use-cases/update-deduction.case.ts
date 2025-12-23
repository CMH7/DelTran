import { Deduction, DeductionDoc } from "@/domain/entities/deduction.schema";
import { DeductionRepo } from "@/domain/repositories/deduction.repo";

export class UpdateDeductionCase {
	constructor(private readonly deductionRepo: DeductionRepo) {}

	async execute(
		id: string,
		deduction: Partial<Deduction>,
	): Promise<{ message: string; data: DeductionDoc | null }> {
		const result = await this.deductionRepo.updateDeduction(id, deduction);

		if (!result) {
			return {
				message: "Failed to update deduction",
				data: null,
			};
		}

		return {
			message: "Deduction updated successfully",
			data: result,
		};
	}
}
