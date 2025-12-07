import { VendorDoc } from "@/domain/entities/vendor.schema";
import { useQuery } from "@tanstack/react-query";

export const useVendors = () => {
	return useQuery({
		queryKey: ["list-vendors"],
		queryFn: async () => {
			const res = await fetch("/api/vendors", {
				method: "GET",
				headers: { "Content-Type": "application/json" },
			});

			const data = (await res.json()) as {
				success: boolean;
				message?: string;
				data: VendorDoc[];
			};

			if (!data.success) throw new Error(data.message);

			return data.data ?? [];
		},
	});
};
