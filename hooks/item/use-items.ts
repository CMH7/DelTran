import { ItemDoc } from "@/domain/entities/item.schema";
import { useQuery } from "@tanstack/react-query";

export const useItems = () => {
  return useQuery({
    queryKey: ["list-items"],
    queryFn: async () => {
      const res = await fetch("/api/items", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = (await res.json()) as {
        success: boolean;
        message?: string;
        data: ItemDoc[];
      };

      if (!data.success) throw new Error(data.message);

      return data.data ?? [];
    },
  });
};
