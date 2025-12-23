import { ItemDoc } from "@/domain/entities/item.schema";
import { ItemRepo } from "@/domain/repositories/item.repo";

export class GetItemCase {
  constructor(private readonly itemRepo: ItemRepo) {}

  async execute(id: string): Promise<{ message: string; data: ItemDoc | null }> {
    const result = await this.itemRepo.getItemById(id);

    if (!result) {
      return {
        message: "Item not found",
        data: null,
      };
    }

    return {
      message: "Item retrieved successfully",
      data: result,
    };
  }
}
