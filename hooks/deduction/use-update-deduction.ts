import { Deduction } from "@/domain/entities/deduction.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useUpdateDeduction = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: async ({
			id,
			deduction,
		}: {
			id: string;
			deduction: Partial<Deduction>;
		}) => {
			const response = await fetch(`/api/deductions/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(deduction),
			});
			if (!response.ok) {
				throw new Error("Failed to update deduction");
			}
			return response.json();
		},
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["list-deductions"] });
			queryClient.invalidateQueries({
				queryKey: ["get-deduction", variables.id],
			});
			toast.success("Deduction updated successfully!");
			router.push("/deductions");
		},
		onError: () => {
			toast.error("Failed to update deduction.");
		},
	});
};
