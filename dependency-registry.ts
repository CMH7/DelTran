import { CreateVendorCase } from "./application/use-cases/create-vendor.case";
import { ListVendorsCase } from "./application/use-cases/list-vendors.case";
import { FStoreVendorAdapter } from "./infra/adapters/fstore/vendor.adapter";

const vendorRepo = new FStoreVendorAdapter();

export const createVendorCase = new CreateVendorCase(vendorRepo);
export const listVendorsCase = new ListVendorsCase(vendorRepo);
