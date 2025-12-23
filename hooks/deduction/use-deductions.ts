import { DeductionDoc } from "@/domain/entities/deduction.schema";
import { useQuery } from "@tanstack/react-query";

export const useDeductions = () => {
	return useQuery({
		queryKey: ["list-deductions"],
		queryFn: async () => {
			const res = await fetch("/api/deductions", {
				method: "GET",
				headers: { "Content-Type": "application/json" },
			});

			const data = (await res.json()) as {
				success: boolean;
				message?: string;
				data: DeductionDoc[];
			};

			if (!data.success) throw new Error(data.message);

			return data.data ?? [];
		},
	});
};
