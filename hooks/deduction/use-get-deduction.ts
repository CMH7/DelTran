import { DeductionDoc } from "@/domain/entities/deduction.schema";
import { useQuery } from "@tanstack/react-query";

export const useGetDeduction = (id: string) => {
	return useQuery({
		queryKey: ["get-deduction", id],
		queryFn: async () => {
			const res = await fetch(`/api/deductions/${id}`, {
				method: "GET",
				headers: { "Content-Type": "application/json" },
			});

			const data = (await res.json()) as {
				success: boolean;
				message?: string;
				data: DeductionDoc | null;
			};

			if (!data.success) throw new Error(data.message);

			return data.data;
		},
		enabled: !!id,
	});
};
