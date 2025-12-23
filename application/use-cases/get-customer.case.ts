import type { CustomerDoc } from "@/domain/entities/customer.schema";
import type { CustomerRepo } from "@/domain/repositories/customer.repo";

export class GetCustomerCase {
  constructor(private customerRepo: CustomerRepo) {}

  async execute(id: string): Promise<{ message: string; data: CustomerDoc | null }> {
    const result = await this.customerRepo.getCustomerById(id);
    return {
      message: result ? "Customer retrieved successfully" : "Customer not found",
      data: result,
    };
  }
}
