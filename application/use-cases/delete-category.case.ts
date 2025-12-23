import { CategoryRepo } from "@/domain/repositories/category.repo";

export class DeleteCategoryCase {
	constructor(private readonly categoryRepo: CategoryRepo) {}

	async execute(id: string): Promise<{ message: string; success: boolean }> {
		const result = await this.categoryRepo.deleteCategory(id);

		if (!result) {
			return {
				message: "Failed to delete category",
				success: false,
			};
		}

		return {
			message: "Category deleted successfully",
			success: true,
		};
	}
}
