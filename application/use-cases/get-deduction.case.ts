import { DeductionDoc } from "@/domain/entities/deduction.schema";
import { DeductionRepo } from "@/domain/repositories/deduction.repo";

export class GetDeductionCase {
	constructor(private readonly deductionRepo: DeductionRepo) {}

	async execute(
		id: string,
	): Promise<{ message: string; data: DeductionDoc | null }> {
		const result = await this.deductionRepo.getDeductionById(id);

		if (!result) {
			return {
				message: "Deduction not found",
				data: null,
			};
		}

		return {
			message: "Deduction retrieved successfully",
			data: result,
		};
	}
}
