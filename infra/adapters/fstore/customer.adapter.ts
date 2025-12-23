import type { Customer, CustomerDoc } from "@/domain/entities/customer.schema";
import { CustomerDocSchema } from "@/domain/entities/customer.schema";
import type { CustomerRepo } from "@/domain/repositories/customer.repo";
import { fbaseAdminFstore } from "@/infra/db/fstore/fbase-admin";

export class FStoreCustomerAdapter implements CustomerRepo {
  async createCustomer(customer: Customer): Promise<Customer> {
    await fbaseAdminFstore.collection("customers").add(customer);
    return customer;
  }

  async getCustomerById(id: string): Promise<CustomerDoc | null> {
    const doc = await fbaseAdminFstore.collection("customers").doc(id).get();
    if (!doc.exists) return null;
    return CustomerDocSchema.parse({ id: doc.id, ...doc.data() });
  }

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<CustomerDoc | null> {
    await fbaseAdminFstore.collection("customers").doc(id).update(customer);
    const updated = await fbaseAdminFstore.collection("customers").doc(id).get();
    if (!updated.exists) return null;
    return CustomerDocSchema.parse({ id: updated.id, ...updated.data() });
  }

  async deleteCustomer(id: string): Promise<boolean> {
    await fbaseAdminFstore.collection("customers").doc(id).delete();
    return true;
  }

  async listCustomers(): Promise<CustomerDoc[]> {
    const snap = await fbaseAdminFstore.collection("customers").get();
    return snap.docs.map((customer) => {
      const data = customer.data() as Customer;
      return CustomerDocSchema.parse({ id: customer.id, ...data });
    });
  }

  async countCustomerTransactions(customerId: string): Promise<number> {
    // Query transactions collection for this customerId
    const snap = await fbaseAdminFstore
      .collection("transactions")
      .where("customerId", "==", customerId)
      .get();
    return snap.size;
  }
}
