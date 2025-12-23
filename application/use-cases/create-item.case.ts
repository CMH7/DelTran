import { Item } from "@/domain/entities/item.schema";
import { ItemRepo } from "@/domain/repositories/item.repo";

export class CreateItemCase {
  constructor(private readonly itemRepo: ItemRepo) {}

  async execute(item: Item): Promise<{ message: string; data: Item | null }> {
    const result = await this.itemRepo.createItem(item);

    if (!result) {
      return {
        message: "Failed to create item",
        data: null,
      };
    }

    return {
      message: "Item created successfully",
      data: result,
    };
  }
}
