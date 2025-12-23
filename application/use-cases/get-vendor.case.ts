import { VendorDoc } from "@/domain/entities/vendor.schema";
import { VendorRepo } from "@/domain/repositories/vendor.repo";

export class GetVendorCase {
	constructor(private readonly vendorRepo: VendorRepo) {}

	async execute(id: string): Promise<{ message: string; data: VendorDoc | null }> {
		const result = await this.vendorRepo.getVendorById(id);

		if (!result) {
			return {
				message: "Vendor not found",
				data: null,
			};
		}

		return {
			message: "Vendor retrieved successfully",
			data: result,
		};
	}
}
