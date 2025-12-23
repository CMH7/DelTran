import { Deduction } from "@/domain/entities/deduction.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateDeduction = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: async (deduction: Deduction) => {
			const response = await fetch("/api/deductions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(deduction),
			});
			if (!response.ok) {
				throw new Error("Failed to create deduction");
			}
			return response.json();
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["list-deductions"] });
			toast.success("Deduction created successfully!");
			router.push("/deductions");
		},
		onError: () => {
			toast.error("Failed to create deduction.");
		},
	});
};
