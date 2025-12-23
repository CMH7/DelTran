import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Deltran } from "@/domain/entities/deltran.schema";

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (transaction: Deltran) => {
      const response = await fetch("/api/transactions", {
        method: "POST",
        body: JSON.stringify(transaction),
      });
      if (!response.ok) throw new Error("Failed to create transaction");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-transactions"] });
      toast.success("Transaction created successfully!");
      router.push("/transactions");
    },
    onError: () => {
      toast.error("Failed to create transaction.");
    },
  });
};
