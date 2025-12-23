import { Deduction } from "@/domain/entities/deduction.schema";
import { DeductionRepo } from "@/domain/repositories/deduction.repo";

export class CreateDeductionCase {
	constructor(private readonly deductionRepo: DeductionRepo) {}

	async execute(
		deduction: Deduction,
	): Promise<{ message: string; data: Deduction | null }> {
		const result = await this.deductionRepo.createDeduction(deduction);

		if (!result) {
			return {
				message: "Failed to create deduction",
				data: null,
			};
		}

		return {
			message: "Deduction created successfully",
			data: result,
		};
	}
}
