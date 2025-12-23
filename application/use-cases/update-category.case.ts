import { Category, CategoryDoc } from "@/domain/entities/category.schema";
import { CategoryRepo } from "@/domain/repositories/category.repo";

export class UpdateCategoryCase {
	constructor(private readonly categoryRepo: CategoryRepo) {}

	async execute(
		id: string,
		category: Partial<Category>,
	): Promise<{ message: string; data: CategoryDoc | null }> {
		const result = await this.categoryRepo.updateCategory(id, category);

		if (!result) {
			return {
				message: "Failed to update category",
				data: null,
			};
		}

		return {
			message: "Category updated successfully",
			data: result,
		};
	}
}
