import { Vendor, VendorDoc } from "../entities/vendor.schema";

export interface VendorRepo {
	createVendor(vendor: Vendor): Promise<Vendor>;
	getVendorById(id: string): Promise<Vendor | null>;
	updateVendor(id: string, vendor: Partial<Vendor>): Promise<Vendor | null>;
	deleteVendor(id: string): Promise<boolean>;
	listVendors(): Promise<VendorDoc[]>;
}
