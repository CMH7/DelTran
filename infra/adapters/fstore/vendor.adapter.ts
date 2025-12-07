import {
	Vendor,
	VendorDoc,
	VendorDocSchema,
} from "@/domain/entities/vendor.schema";
import { VendorRepo } from "@/domain/repositories/vendor.repo";
import { fbaseAdminFstore } from "@/infra/db/fstore/fbase-admin";
import { fbaseClientFstore } from "@/infra/db/fstore/fbase-client";
import { addDoc, collection, getDocs, query } from "firebase/firestore";

export class FStoreVendorAdapter implements VendorRepo {
	async createVendor(vendor: Vendor): Promise<Vendor> {
		try {
			const vendorsCol = collection(fbaseClientFstore, "vendors");
			await addDoc(vendorsCol, vendor);

			return vendor;
		} catch (err: unknown) {
			throw err;
		}
	}
	async getVendorById(id: string): Promise<Vendor | null> {
		throw new Error("Method not implemented.");
	}
	async updateVendor(
		id: string,
		vendor: Partial<Vendor>,
	): Promise<Vendor | null> {
		throw new Error("Method not implemented.");
	}
	async deleteVendor(id: string): Promise<boolean> {
		throw new Error("Method not implemented.");
	}

	async listVendors(): Promise<VendorDoc[]> {
		const snap = await fbaseAdminFstore.collection("vendors").get();

		return snap.docs.map((vendor) => {
			const data = vendor.data() as Vendor;

			return VendorDocSchema.parse({
				id: vendor.id,
				...data,
			});
		});
	}
}
