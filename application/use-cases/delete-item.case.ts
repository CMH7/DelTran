import { ItemRepo } from "@/domain/repositories/item.repo";

export class DeleteItemCase {
  constructor(private readonly itemRepo: ItemRepo) {}

  async execute(id: string): Promise<{ message: string; success: boolean }> {
    const result = await this.itemRepo.deleteItem(id);

    if (!result) {
      return {
        message: "Failed to delete item",
        success: false,
      };
    }

    return {
      message: "Item deleted successfully",
      success: true,
    };
  }
}
