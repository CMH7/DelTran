import { useQuery } from "@tanstack/react-query";
import type { CustomerDoc } from "@/domain/entities/customer.schema";

export const useGetCustomer = (id: string) => {
  return useQuery({
    queryKey: ["get-customer", id],
    queryFn: async () => {
      const res = await fetch(`/api/customers/${id}`, { method: "GET" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.data as CustomerDoc | null;
    },
    enabled: !!id,
  });
};
