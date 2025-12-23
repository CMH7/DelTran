import { DeductionRepo } from "@/domain/repositories/deduction.repo";

export class DeleteDeductionCase {
	constructor(private readonly deductionRepo: DeductionRepo) {}

	async execute(id: string): Promise<{ message: string; success: boolean }> {
		const result = await this.deductionRepo.deleteDeduction(id);

		if (!result) {
			return {
				message: "Failed to delete deduction",
				success: false,
			};
		}

		return {
			message: "Deduction deleted successfully",
			success: true,
		};
	}
}
