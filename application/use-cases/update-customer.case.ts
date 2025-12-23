import type { Customer, CustomerDoc } from "@/domain/entities/customer.schema";
import type { CustomerRepo } from "@/domain/repositories/customer.repo";

export class UpdateCustomerCase {
  constructor(private customerRepo: CustomerRepo) {}

  async execute(id: string, customer: Partial<Customer>): Promise<{ message: string; data: CustomerDoc | null }> {
    const result = await this.customerRepo.updateCustomer(id, customer);
    return {
      message: result ? "Customer updated successfully" : "Failed to update customer",
      data: result,
    };
  }
}
