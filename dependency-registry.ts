import { CreateVendorCase } from "./application/use-cases/create-vendor.case";
import { ListVendorsCase } from "./application/use-cases/list-vendors.case";
import { GetVendorCase } from "./application/use-cases/get-vendor.case";
import { UpdateVendorCase } from "./application/use-cases/update-vendor.case";
import { DeleteVendorCase } from "./application/use-cases/delete-vendor.case";
import { FStoreVendorAdapter } from "./infra/adapters/fstore/vendor.adapter";

import { CreateItemCase } from "./application/use-cases/create-item.case";
import { ListItemsCase } from "./application/use-cases/list-items.case";
import { GetItemCase } from "./application/use-cases/get-item.case";
import { UpdateItemCase } from "./application/use-cases/update-item.case";
import { DeleteItemCase } from "./application/use-cases/delete-item.case";
import { FStoreItemAdapter } from "./infra/adapters/fstore/item.adapter";

import { CreateCategoryCase } from "./application/use-cases/create-category.case";
import { ListCategoriesCase } from "./application/use-cases/list-categories.case";
import { GetCategoryCase } from "./application/use-cases/get-category.case";
import { UpdateCategoryCase } from "./application/use-cases/update-category.case";
import { DeleteCategoryCase } from "./application/use-cases/delete-category.case";
import { FStoreCategoryAdapter } from "./infra/adapters/fstore/category.adapter";

import { CreateDeductionCase } from "./application/use-cases/create-deduction.case";
import { ListDeductionsCase } from "./application/use-cases/list-deductions.case";
import { GetDeductionCase } from "./application/use-cases/get-deduction.case";
import { UpdateDeductionCase } from "./application/use-cases/update-deduction.case";
import { DeleteDeductionCase } from "./application/use-cases/delete-deduction.case";
import { FStoreDeductionAdapter } from "./infra/adapters/fstore/deduction.adapter";

import { CreateCustomerCase } from "./application/use-cases/create-customer.case";
import { ListCustomersCase } from "./application/use-cases/list-customers.case";
import { GetCustomerCase } from "./application/use-cases/get-customer.case";
import { UpdateCustomerCase } from "./application/use-cases/update-customer.case";
import { DeleteCustomerCase } from "./application/use-cases/delete-customer.case";
import { FStoreCustomerAdapter } from "./infra/adapters/fstore/customer.adapter";

import { CreateTransactionCase } from "./application/use-cases/create-transaction.case";
import { ListTransactionsCase } from "./application/use-cases/list-transactions.case";
import { GetTransactionCase } from "./application/use-cases/get-transaction.case";
import { UpdateTransactionCase } from "./application/use-cases/update-transaction.case";
import { DeleteTransactionCase } from "./application/use-cases/delete-transaction.case";
import { FStoreDeltranAdapter } from "./infra/adapters/fstore/deltran.adapter";

const vendorRepo = new FStoreVendorAdapter();

export const createVendorCase = new CreateVendorCase(vendorRepo);
export const listVendorsCase = new ListVendorsCase(vendorRepo);
export const getVendorCase = new GetVendorCase(vendorRepo);
export const updateVendorCase = new UpdateVendorCase(vendorRepo);
export const deleteVendorCase = new DeleteVendorCase(vendorRepo);

const itemRepo = new FStoreItemAdapter();

export const createItemCase = new CreateItemCase(itemRepo);
export const listItemsCase = new ListItemsCase(itemRepo);
export const getItemCase = new GetItemCase(itemRepo);
export const updateItemCase = new UpdateItemCase(itemRepo);
export const deleteItemCase = new DeleteItemCase(itemRepo);

const categoryRepo = new FStoreCategoryAdapter();

export const createCategoryCase = new CreateCategoryCase(categoryRepo);
export const listCategoriesCase = new ListCategoriesCase(categoryRepo);
export const getCategoryCase = new GetCategoryCase(categoryRepo);
export const updateCategoryCase = new UpdateCategoryCase(categoryRepo);
export const deleteCategoryCase = new DeleteCategoryCase(categoryRepo);

const deductionRepo = new FStoreDeductionAdapter();

export const createDeductionCase = new CreateDeductionCase(deductionRepo);
export const listDeductionsCase = new ListDeductionsCase(deductionRepo);
export const getDeductionCase = new GetDeductionCase(deductionRepo);
export const updateDeductionCase = new UpdateDeductionCase(deductionRepo);
export const deleteDeductionCase = new DeleteDeductionCase(deductionRepo);

const customerRepo = new FStoreCustomerAdapter();

export const createCustomerCase = new CreateCustomerCase(customerRepo);
export const listCustomersCase = new ListCustomersCase(customerRepo);
export const getCustomerCase = new GetCustomerCase(customerRepo);
export const updateCustomerCase = new UpdateCustomerCase(customerRepo);
export const deleteCustomerCase = new DeleteCustomerCase(customerRepo);

const transactionRepo = new FStoreDeltranAdapter();

export const createTransactionCase = new CreateTransactionCase(transactionRepo);
export const listTransactionsCase = new ListTransactionsCase(transactionRepo);
export const getTransactionCase = new GetTransactionCase(transactionRepo);
export const updateTransactionCase = new UpdateTransactionCase(transactionRepo);
export const deleteTransactionCase = new DeleteTransactionCase(transactionRepo);
