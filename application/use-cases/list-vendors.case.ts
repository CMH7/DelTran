import { VendorDoc } from "@/domain/entities/vendor.schema";
import { VendorRepo } from "@/domain/repositories/vendor.repo";

export class ListVendorsCase {
	constructor(private readonly vendorRepo: VendorRepo) {}

	async execute(): Promise<{ message: string; data: VendorDoc[] }> {
		const result = await this.vendorRepo.listVendors();

		return {
			message: "Vendors retrieved successfully",
			data: result,
		};
	}
}
