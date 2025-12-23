import { Item } from "@/domain/entities/item.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ id, item }: { id: string; item: Partial<Item> }) => {
      const response = await fetch(`/api/items/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });
      if (!response.ok) {
        throw new Error("Failed to update item");
      }
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["list-items"] });
      queryClient.invalidateQueries({ queryKey: ["get-item", variables.id] });
      toast.success("Item updated successfully!");
      router.push("/items");
    },
    onError: () => {
      toast.error("Failed to update item.");
    },
  });
};
