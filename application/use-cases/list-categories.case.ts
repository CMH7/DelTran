import { CategoryDoc } from "@/domain/entities/category.schema";
import { CategoryRepo } from "@/domain/repositories/category.repo";

export class ListCategoriesCase {
	constructor(private readonly categoryRepo: CategoryRepo) {}

	async execute(): Promise<{ message: string; data: CategoryDoc[] }> {
		const result = await this.categoryRepo.listCategories();

		return {
			message: "Categories retrieved successfully",
			data: result,
		};
	}
}
