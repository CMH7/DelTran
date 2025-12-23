import { VendorDoc } from "@/domain/entities/vendor.schema";
import { useQuery } from "@tanstack/react-query";

export const useGetVendor = (id: string) => {
	return useQuery({
		queryKey: ["get-vendor", id],
		queryFn: async () => {
			const res = await fetch(`/api/vendors/${id}`, {
				method: "GET",
				headers: { "Content-Type": "application/json" },
			});

			const data = (await res.json()) as {
				success: boolean;
				message?: string;
				data: VendorDoc;
			};

			if (!data.success) throw new Error(data.message);

			return data.data;
		},
		enabled: !!id,
	});
};
