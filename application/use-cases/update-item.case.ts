import { Item, ItemDoc } from "@/domain/entities/item.schema";
import { ItemRepo } from "@/domain/repositories/item.repo";

export class UpdateItemCase {
  constructor(private readonly itemRepo: ItemRepo) {}

  async execute(
    id: string,
    item: Partial<Item>,
  ): Promise<{ message: string; data: ItemDoc | null }> {
    const result = await this.itemRepo.updateItem(id, item);

    if (!result) {
      return {
        message: "Failed to update item",
        data: null,
      };
    }

    return {
      message: "Item updated successfully",
      data: result,
    };
  }
}
