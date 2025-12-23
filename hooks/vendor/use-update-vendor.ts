import { Vendor } from "@/domain/entities/vendor.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useUpdateVendor = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: async ({
			id,
			vendor,
		}: {
			id: string;
			vendor: Partial<Vendor>;
		}) => {
			const response = await fetch(`/api/vendors/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(vendor),
			});
			if (!response.ok) {
				throw new Error("Failed to update vendor");
			}
			return response.json();
		},
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["list-vendors"] });
			queryClient.invalidateQueries({
				queryKey: ["get-vendor", variables.id],
			});
			toast.success("Vendor updated successfully!");
			router.push("/vendors");
		},
		onError: () => {
			toast.error("Failed to update vendor.");
		},
	});
};
