import { Item, ItemDoc, ItemDocSchema, ItemSchema } from "@/domain/entities/item.schema";
import { ItemRepo } from "@/domain/repositories/item.repo";
import { fbaseAdminFstore } from "@/infra/db/fstore/fbase-admin";

export class FStoreItemAdapter implements ItemRepo {
  async createItem(item: Item): Promise<Item> {
    try {
      await fbaseAdminFstore.collection("items").add(item);
      return item;
    } catch (err: unknown) {
      throw err;
    }
  }

  async getItemById(id: string): Promise<ItemDoc | null> {
    const doc = await fbaseAdminFstore.collection("items").doc(id).get();
    if (!doc.exists) return null;
    return ItemDocSchema.parse({ id: doc.id, ...doc.data() });
  }

  async updateItem(id: string, item: Partial<Item>): Promise<ItemDoc | null> {
    await fbaseAdminFstore.collection("items").doc(id).update(item);
    const updated = await fbaseAdminFstore.collection("items").doc(id).get();
    if (!updated.exists) return null;
    return ItemDocSchema.parse({ id: updated.id, ...updated.data() });
  }

  async deleteItem(id: string): Promise<boolean> {
    await fbaseAdminFstore.collection("items").doc(id).delete();
    return true;
  }

  async listItems(): Promise<ItemDoc[]> {
    const snap = await fbaseAdminFstore.collection("items").get();

    return snap.docs.map((item) => {
      const data = item.data() as Item;

      return ItemDocSchema.parse({
        id: item.id,
        ...data,
      });
    });
  }
}
