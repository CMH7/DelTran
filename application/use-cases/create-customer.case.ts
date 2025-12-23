import type { Customer } from "@/domain/entities/customer.schema";
import type { CustomerRepo } from "@/domain/repositories/customer.repo";

export class CreateCustomerCase {
  constructor(private customerRepo: CustomerRepo) {}

  async execute(customer: Customer): Promise<{ message: string; data: Customer | null }> {
    const result = await this.customerRepo.createCustomer(customer);
    return {
      message: result ? "Customer created successfully" : "Failed to create customer",
      data: result || null,
    };
  }
}
