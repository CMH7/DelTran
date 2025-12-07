import { Vendor } from "@/domain/entities/vendor.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateVendor = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: async (vendor: Vendor) => {
			const response = await fetch("/api/vendors", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(vendor),
			});
			if (!response.ok) {
				throw new Error("Failed to create vendor");
			}
			return response.json();
		},
		onSuccess: (data) => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ["list-vendors"] });
			toast.success("Vendor created successfully!");
			router.push("/vendors");
		},
		onError: () => {
			toast.error("Failed to create vendor.");
		},
	});
};
