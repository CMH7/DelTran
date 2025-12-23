import { useQuery } from "@tanstack/react-query";
import type { DeltranDoc } from "@/domain/entities/deltran.schema";

export const useGetTransaction = (id: string) => {
  return useQuery({
    queryKey: ["get-transaction", id],
    queryFn: async () => {
      const res = await fetch(`/api/transactions/${id}`, { method: "GET" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.data as DeltranDoc | null;
    },
    enabled: !!id,
  });
};
