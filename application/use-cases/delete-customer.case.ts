import type { CustomerRepo } from "@/domain/repositories/customer.repo";

export class DeleteCustomerCase {
  constructor(private customerRepo: CustomerRepo) {}

  async execute(id: string): Promise<{ message: string; success: boolean }> {
    // Check if customer has transactions
    const transactionCount = await this.customerRepo.countCustomerTransactions(id);
    if (transactionCount > 0) {
      return {
        message: "Cannot delete customer with existing transactions",
        success: false,
      };
    }

    const result = await this.customerRepo.deleteCustomer(id);
    return {
      message: result ? "Customer deleted successfully" : "Failed to delete customer",
      success: result,
    };
  }
}
