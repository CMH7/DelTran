import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Customer } from "@/domain/entities/customer.schema";

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (customer: Customer) => {
      const response = await fetch("/api/customers", {
        method: "POST",
        body: JSON.stringify(customer),
      });
      if (!response.ok) throw new Error("Failed to create customer");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-customers"] });
      toast.success("Customer created successfully!");
      router.push("/customers");
    },
    onError: () => {
      toast.error("Failed to create customer.");
    },
  });
};
