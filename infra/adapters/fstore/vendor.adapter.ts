import {
	Vendor,
	VendorDoc,
	VendorDocSchema,
} from "@/domain/entities/vendor.schema";
import { VendorRepo } from "@/domain/repositories/vendor.repo";
import { fbaseAdminFstore } from "@/infra/db/fstore/fbase-admin";

export class FStoreVendorAdapter implements VendorRepo {
	async createVendor(vendor: Vendor): Promise<Vendor> {
		try {
			await fbaseAdminFstore.collection("vendors").add(vendor);
			return vendor;
		} catch (err: unknown) {
			throw err;
		}
	}
	async getVendorById(id: string): Promise<VendorDoc | null> {
		const doc = await fbaseAdminFstore.collection("vendors").doc(id).get();
		if (!doc.exists) return null;
		return VendorDocSchema.parse({ id: doc.id, ...doc.data() });
	}
	async updateVendor(
		id: string,
		vendor: Partial<Vendor>,
	): Promise<VendorDoc | null> {
		await fbaseAdminFstore.collection("vendors").doc(id).update(vendor);
		const updated = await fbaseAdminFstore.collection("vendors").doc(id).get();
		if (!updated.exists) return null;
		return VendorDocSchema.parse({ id: updated.id, ...updated.data() });
	}
	async deleteVendor(id: string): Promise<boolean> {
		await fbaseAdminFstore.collection("vendors").doc(id).delete();
		return true;
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
