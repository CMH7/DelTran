import { Category } from "@/domain/entities/category.schema";
import { CategoryRepo } from "@/domain/repositories/category.repo";

export class CreateCategoryCase {
	constructor(private readonly categoryRepo: CategoryRepo) {}

	async execute(
		category: Category,
	): Promise<{ message: string; data: Category | null }> {
		const result = await this.categoryRepo.createCategory(category);

		if (!result) {
			return {
				message: "Failed to create category",
				data: null,
			};
		}

		return {
			message: "Category created successfully",
			data: result,
		};
	}
}
