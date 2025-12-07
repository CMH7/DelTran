import { Vendor } from "@/domain/entities/vendor.schema";
import { VendorRepo } from "@/domain/repositories/vendor.repo";

export class CreateVendorCase {
	constructor(private readonly vendorRepo: VendorRepo) {}

	async execute(
		vendor: Vendor,
	): Promise<{ message: string; data: Vendor | null }> {
		const result = await this.vendorRepo.createVendor(vendor);

		if (!result) {
			return {
				message: "Failed to create vendor",
				data: null,
			};
		}

		return {
			message: "Vendor created successfully",
			data: result,
		};
	}
}
