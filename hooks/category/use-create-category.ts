import { Category } from "@/domain/entities/category.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateCategory = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: async (category: Category) => {
			const response = await fetch("/api/categories", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(category),
			});
			if (!response.ok) {
				throw new Error("Failed to create category");
			}
			return response.json();
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["list-categories"] });
			toast.success("Category created successfully!");
			router.push("/categories");
		},
		onError: () => {
			toast.error("Failed to create category.");
		},
	});
};
