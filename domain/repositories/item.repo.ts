import { Item, ItemDoc } from "../entities/item.schema";

export interface ItemRepo {
  createItem(item: Item): Promise<Item>;
  getItemById(id: string): Promise<ItemDoc | null>;
  updateItem(id: string, item: Partial<Item>): Promise<ItemDoc | null>;
  deleteItem(id: string): Promise<boolean>;
  listItems(): Promise<ItemDoc[]>;
}
