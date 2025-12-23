import { useQuery } from "@tanstack/react-query";
import type { CustomerDoc } from "@/domain/entities/customer.schema";

export const useCustomers = () => {
  return useQuery({
    queryKey: ["list-customers"],
    queryFn: async () => {
      const res = await fetch("/api/customers", { method: "GET" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return (data.data ?? []) as CustomerDoc[];
    },
  });
};
