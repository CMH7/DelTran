import type { CustomerDoc } from "@/domain/entities/customer.schema";
import type { CustomerRepo } from "@/domain/repositories/customer.repo";

export class ListCustomersCase {
  constructor(private customerRepo: CustomerRepo) {}

  async execute(): Promise<{ message: string; data: CustomerDoc[] }> {
    const result = await this.customerRepo.listCustomers();
    return {
      message: "Customers retrieved successfully",
      data: result,
    };
  }
}
