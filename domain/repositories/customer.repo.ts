import type { Customer, CustomerDoc } from "../entities/customer.schema";

export interface CustomerRepo {
  createCustomer(customer: Customer): Promise<Customer>;
  getCustomerById(id: string): Promise<CustomerDoc | null>;
  updateCustomer(id: string, customer: Partial<Customer>): Promise<CustomerDoc | null>;
  deleteCustomer(id: string): Promise<boolean>;
  listCustomers(): Promise<CustomerDoc[]>;
  countCustomerTransactions(customerId: string): Promise<number>;
}
