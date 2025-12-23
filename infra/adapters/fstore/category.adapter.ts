import {
	Category,
	CategoryDoc,
	CategoryDocSchema,
} from "@/domain/entities/category.schema";
import { CategoryRepo } from "@/domain/repositories/category.repo";
import { fbaseAdminFstore } from "@/infra/db/fstore/fbase-admin";

export class FStoreCategoryAdapter implements CategoryRepo {
	async createCategory(category: Category): Promise<Category> {
		try {
			await fbaseAdminFstore.collection("categories").add(category);
			return category;
		} catch (err: unknown) {
			throw err;
		}
	}

	async getCategoryById(id: string): Promise<CategoryDoc | null> {
		const doc = await fbaseAdminFstore.collection("categories").doc(id).get();
		if (!doc.exists) return null;
		return CategoryDocSchema.parse({ id: doc.id, ...doc.data() });
	}

	async updateCategory(
		id: string,
		category: Partial<Category>,
	): Promise<CategoryDoc | null> {
		await fbaseAdminFstore.collection("categories").doc(id).update(category);
		const updated = await fbaseAdminFstore
			.collection("categories")
			.doc(id)
			.get();
		if (!updated.exists) return null;
		return CategoryDocSchema.parse({ id: updated.id, ...updated.data() });
	}

	async deleteCategory(id: string): Promise<boolean> {
		await fbaseAdminFstore.collection("categories").doc(id).delete();
		return true;
	}

	async listCategories(): Promise<CategoryDoc[]> {
		const snap = await fbaseAdminFstore.collection("categories").get();

		return snap.docs.map((category) => {
			const data = category.data() as Category;

			return CategoryDocSchema.parse({
				id: category.id,
				...data,
			});
		});
	}
}
