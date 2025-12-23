import { ItemDoc } from "@/domain/entities/item.schema";
import { ItemRepo } from "@/domain/repositories/item.repo";

export class ListItemsCase {
  constructor(private readonly itemRepo: ItemRepo) {}

  async execute(): Promise<{ message: string; data: ItemDoc[] | null }> {
    const result = await this.itemRepo.listItems();

    if (!result) {
      return {
        message: "Failed to list items",
        data: null,
      };
    }

    return {
      message: "Items retrieved successfully",
      data: result,
    };
  }
}
