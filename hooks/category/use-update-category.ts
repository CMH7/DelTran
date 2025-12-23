import { Category } from "@/domain/entities/category.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useUpdateCategory = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: async ({
			id,
			category,
		}: {
			id: string;
			category: Partial<Category>;
		}) => {
			const response = await fetch(`/api/categories/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(category),
			});
			if (!response.ok) {
				throw new Error("Failed to update category");
			}
			return response.json();
		},
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["list-categories"] });
			queryClient.invalidateQueries({
				queryKey: ["get-category", variables.id],
			});
			toast.success("Category updated successfully!");
			router.push("/categories");
		},
		onError: () => {
			toast.error("Failed to update category.");
		},
	});
};
