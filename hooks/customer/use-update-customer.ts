import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Customer } from "@/domain/entities/customer.schema";

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ id, customer }: { id: string; customer: Partial<Customer> }) => {
      const response = await fetch(`/api/customers/${id}`, {
        method: "PATCH",
        body: JSON.stringify(customer),
      });
      if (!response.ok) throw new Error("Failed to update customer");
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["list-customers"] });
      queryClient.invalidateQueries({ queryKey: ["get-customer", variables.id] });
      toast.success("Customer updated successfully!");
      router.push("/customers");
    },
    onError: () => {
      toast.error("Failed to update customer.");
    },
  });
};
