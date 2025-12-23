import { Vendor, VendorDoc } from "@/domain/entities/vendor.schema";
import { VendorRepo } from "@/domain/repositories/vendor.repo";

export class UpdateVendorCase {
	constructor(private readonly vendorRepo: VendorRepo) {}

	async execute(
		id: string,
		vendor: Partial<Vendor>,
	): Promise<{ message: string; data: VendorDoc | null }> {
		const result = await this.vendorRepo.updateVendor(id, vendor);

		if (!result) {
			return {
				message: "Failed to update vendor",
				data: null,
			};
		}

		return {
			message: "Vendor updated successfully",
			data: result,
		};
	}
}
