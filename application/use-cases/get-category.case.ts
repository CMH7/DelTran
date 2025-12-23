import { CategoryDoc } from "@/domain/entities/category.schema";
import { CategoryRepo } from "@/domain/repositories/category.repo";

export class GetCategoryCase {
	constructor(private readonly categoryRepo: CategoryRepo) {}

	async execute(
		id: string,
	): Promise<{ message: string; data: CategoryDoc | null }> {
		const result = await this.categoryRepo.getCategoryById(id);

		if (!result) {
			return {
				message: "Category not found",
				data: null,
			};
		}

		return {
			message: "Category retrieved successfully",
			data: result,
		};
	}
}
