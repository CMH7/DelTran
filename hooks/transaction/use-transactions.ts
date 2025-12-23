import { useQuery } from "@tanstack/react-query";
import type { DeltranDoc } from "@/domain/entities/deltran.schema";

export const useTransactions = (filters?: {
  startDate?: Date;
  endDate?: Date;
  status?: string;
}) => {
  return useQuery({
    queryKey: ["list-transactions", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.startDate) params.set("startDate", filters.startDate.toISOString());
      if (filters?.endDate) params.set("endDate", filters.endDate.toISOString());
      if (filters?.status) params.set("status", filters.status);

      const res = await fetch(`/api/transactions?${params.toString()}`, { method: "GET" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return (data.data ?? []) as DeltranDoc[];
    },
  });
};
