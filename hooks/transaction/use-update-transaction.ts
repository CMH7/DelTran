import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Deltran } from "@/domain/entities/deltran.schema";

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ id, transaction }: { id: string; transaction: Partial<Deltran> }) => {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "PATCH",
        body: JSON.stringify(transaction),
      });
      if (!response.ok) throw new Error("Failed to update transaction");
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["list-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["get-transaction", variables.id] });
      toast.success("Transaction updated successfully!");
      router.push("/transactions");
    },
    onError: () => {
      toast.error("Failed to update transaction.");
    },
  });
};
