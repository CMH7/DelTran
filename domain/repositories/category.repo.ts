import { Category, CategoryDoc } from "../entities/category.schema";

export interface CategoryRepo {
	createCategory(category: Category): Promise<Category>;
	getCategoryById(id: string): Promise<CategoryDoc | null>;
	updateCategory(
		id: string,
		category: Partial<Category>,
	): Promise<CategoryDoc | null>;
	deleteCategory(id: string): Promise<boolean>;
	listCategories(): Promise<CategoryDoc[]>;
}
