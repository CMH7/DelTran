import { VendorRepo } from "@/domain/repositories/vendor.repo";

export class DeleteVendorCase {
	constructor(private readonly vendorRepo: VendorRepo) {}

	async execute(id: string): Promise<{ message: string; success: boolean }> {
		const result = await this.vendorRepo.deleteVendor(id);

		if (!result) {
			return {
				message: "Failed to delete vendor",
				success: false,
			};
		}

		return {
			message: "Vendor deleted successfully",
			success: true,
		};
	}
}
