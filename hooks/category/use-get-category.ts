import { CategoryDoc } from "@/domain/entities/category.schema";
import { useQuery } from "@tanstack/react-query";

export const useGetCategory = (id: string) => {
	return useQuery({
		queryKey: ["get-category", id],
		queryFn: async () => {
			const res = await fetch(`/api/categories/${id}`, {
				method: "GET",
				headers: { "Content-Type": "application/json" },
			});

			const data = (await res.json()) as {
				success: boolean;
				message?: string;
				data: CategoryDoc;
			};

			if (!data.success) throw new Error(data.message);

			return data.data;
		},
		enabled: !!id,
	});
};
