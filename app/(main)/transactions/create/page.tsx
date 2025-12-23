"use client";

import Container from "@/components/custom/container";
import PageHeader from "@/components/custom/page-header";
import { PlusIcon, Receipt } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { Deltran, DeltranSchema } from "@/domain/entities/deltran.schema";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCreateTransaction } from "@/hooks/transaction/use-create-transaction";
import { Spinner } from "@/components/ui/spinner";
import { useCustomers } from "@/hooks/customer/use-customers";
import { useItems } from "@/hooks/item/use-items";
import { useDeductions } from "@/hooks/deduction/use-deductions";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { calculateProfit } from "@/lib/transaction-utils";
import AddItemDialog from "@/components/custom/add-item-dialog";
import AddExpenseDialog from "@/components/custom/add-expense-dialog";
import AddDeductionDialog from "@/components/custom/add-deduction-dialog";

export default function Page() {
	const { mutateAsync: createTransactionAsync, isPending } =
		useCreateTransaction();
	const { data: customers } = useCustomers();
	const { data: items } = useItems();
	const { data: deductions } = useDeductions();

	const transactionDefaultValues: Deltran = {
		tranDate: new Date(),
		customerId: "",
		customerName: "",
		deliveryLocation: "",
		deliveryNotes: "",
		capital: 0,
		cxPayAmt: 0,
		items: [],
		expenses: [],
		deductions: [],
		status: "completed",
		refNumber: "",
	};

	const form = useForm({
		defaultValues: transactionDefaultValues,
		validators: {
			onSubmit: DeltranSchema as any,
		},
		onSubmit: async ({ value }) => {
			console.log("value", value);
			await createTransactionAsync(value);
		},
	});

	// Real-time profit calculation
	const profit = useMemo(() => {
		const values = form.state.values;
		return calculateProfit(values);
	}, [form.state.values]);

	// Dialog state
	const [itemDialogOpen, setItemDialogOpen] = useState(false);
	const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
	const [deductionDialogOpen, setDeductionDialogOpen] = useState(false);

	return (
		<Container>
			<PageHeader title="Create Transaction" icon={<Receipt />} />

			<Card>
				<CardContent>
					<form
						id="create-transaction-form"
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
					>
						<FieldGroup>
							{/* Date */}
							<form.Field name="tranDate">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched &&
										!field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel>
												Transaction Date
											</FieldLabel>
											<Input
												type="date"
												value={
													field.state.value instanceof
													Date
														? field.state.value
																.toISOString()
																.split("T")[0]
														: ""
												}
												onChange={(e) =>
													field.handleChange(
														new Date(
															e.target.value,
														),
													)
												}
												onBlur={field.handleBlur}
											/>
											{isInvalid && (
												<FieldError
													errors={
														field.state.meta.errors
													}
												/>
											)}
										</Field>
									);
								}}
							</form.Field>

							{/* Customer Selector */}
							<form.Field name="customerId">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched &&
										!field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel>Customer</FieldLabel>
											<Select
												value={field.state.value}
												onValueChange={(value) => {
													field.handleChange(value);
													const customer =
														customers?.find(
															(c) =>
																c.id === value,
														);
													if (customer) {
														form.setFieldValue(
															"customerName",
															customer.name,
														);
													}
												}}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select customer" />
												</SelectTrigger>
												<SelectContent>
													{customers?.map(
														(customer) => (
															<SelectItem
																key={
																	customer.id
																}
																value={
																	customer.id
																}
															>
																{customer.name}
															</SelectItem>
														),
													)}
												</SelectContent>
											</Select>
											{isInvalid && (
												<FieldError
													errors={
														field.state.meta.errors
													}
												/>
											)}
										</Field>
									);
								}}
							</form.Field>

							{/* Delivery Location */}
							<form.Field name="deliveryLocation">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched &&
										!field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel>
												Delivery Location
											</FieldLabel>
											<Input
												value={field.state.value}
												onChange={(e) =>
													field.handleChange(
														e.target.value,
													)
												}
												onBlur={field.handleBlur}
												placeholder="Street, City"
											/>
											{isInvalid && (
												<FieldError
													errors={
														field.state.meta.errors
													}
												/>
											)}
										</Field>
									);
								}}
							</form.Field>

							{/* Delivery Notes */}
							<form.Field name="deliveryNotes">
								{(field) => {
									return (
										<Field>
											<FieldLabel>
												Delivery Notes (Optional)
											</FieldLabel>
											<Textarea
												value={field.state.value || ""}
												onChange={(e) =>
													field.handleChange(
														e.target.value,
													)
												}
												onBlur={field.handleBlur}
												placeholder="Special instructions..."
											/>
										</Field>
									);
								}}
							</form.Field>

							{/* Capital */}
							<form.Field name="capital">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched &&
										!field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel>Capital</FieldLabel>
											<Input
												type="number"
												step="0.01"
												value={field.state.value}
												onChange={(e) =>
													field.handleChange(
														parseFloat(
															e.target.value,
														) || 0,
													)
												}
												onBlur={field.handleBlur}
												placeholder="0.00"
											/>
											{isInvalid && (
												<FieldError
													errors={
														field.state.meta.errors
													}
												/>
											)}
										</Field>
									);
								}}
							</form.Field>

							{/* Items Section */}
							<div className="border p-4 rounded-md space-y-2">
								<div className="flex justify-between items-center">
									<FieldLabel>Items *</FieldLabel>
									<Button
										type="button"
										size="sm"
										variant="outline"
										onClick={() => setItemDialogOpen(true)}
									>
										<PlusIcon className="w-4 h-4 mr-1" />{" "}
										Add Item
									</Button>
								</div>

								{form.state.values.items.length === 0 && (
									<p className="text-sm text-gray-500">
										No items added yet. Click "Add Item" to
										begin.
									</p>
								)}

								{form.state.values.items.map((_, index) => (
									<div
										key={index}
										className="border p-3 rounded bg-gray-50 space-y-2"
									>
										<div className="grid grid-cols-2 gap-2">
											<div>
												<FieldLabel className="text-xs">
													Item
												</FieldLabel>
												<Select
													value={
														form.state.values.items[
															index
														]?.itemId || ""
													}
													onValueChange={(value) => {
														const item =
															items?.find(
																(i) =>
																	i.id ===
																	value,
															);
														if (item) {
															const newItems = [
																...form.state
																	.values
																	.items,
															];
															newItems[index] = {
																...newItems[
																	index
																],
																itemId: item.id,
																name: item.name,
																price: item.price,
																total:
																	item.price *
																	(newItems[
																		index
																	]?.qty ||
																		1),
															};
															form.setFieldValue(
																"items",
																newItems,
															);
														}
													}}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select item" />
													</SelectTrigger>
													<SelectContent>
														{items?.map((item) => (
															<SelectItem
																key={item.id}
																value={item.id}
															>
																{item.name} - ₱
																{item.price}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>

											<div>
												<FieldLabel className="text-xs">
													Qty
												</FieldLabel>
												<Input
													type="number"
													min="1"
													value={
														form.state.values.items[
															index
														]?.qty || 1
													}
													onChange={(e) => {
														const qty =
															parseInt(
																e.target.value,
															) || 1;
														const newItems = [
															...form.state.values
																.items,
														];
														newItems[index] = {
															...newItems[index],
															qty,
															total:
																(newItems[index]
																	?.price ||
																	0) * qty,
														};
														form.setFieldValue(
															"items",
															newItems,
														);
													}}
												/>
											</div>
										</div>

										<div className="flex justify-between items-center">
											<span className="text-sm font-medium">
												Total: ₱
												{form.state.values.items[
													index
												]?.total?.toFixed(2) || "0.00"}
											</span>
											<Button
												type="button"
												size="sm"
												variant="destructive"
												onClick={() => {
													const newItems =
														form.state.values.items.filter(
															(_, i) =>
																i !== index,
														);
													form.setFieldValue(
														"items",
														newItems,
													);
												}}
											>
												Remove
											</Button>
										</div>
									</div>
								))}
							</div>

							{/* Expenses Section */}
							<div className="border p-4 rounded-md space-y-2">
								<div className="flex justify-between items-center">
									<FieldLabel>Expenses (Optional)</FieldLabel>
									<Button
										type="button"
										size="sm"
										variant="outline"
										onClick={() =>
											setExpenseDialogOpen(true)
										}
									>
										<PlusIcon className="w-4 h-4 mr-1" />{" "}
										Add Expense
									</Button>
								</div>

								{form.state.values.expenses.map((_, index) => (
									<div
										key={index}
										className="border p-3 rounded bg-gray-50 space-y-2"
									>
										<div className="grid grid-cols-2 gap-2">
											<div>
												<FieldLabel className="text-xs">
													Description
												</FieldLabel>
												<Input
													value={
														form.state.values
															.expenses[index]
															?.description || ""
													}
													onChange={(e) => {
														const newExpenses = [
															...form.state.values
																.expenses,
														];
														newExpenses[index] = {
															...newExpenses[
																index
															],
															description:
																e.target.value,
														};
														form.setFieldValue(
															"expenses",
															newExpenses,
														);
													}}
													placeholder="Gas, toll, etc."
												/>
											</div>

											<div>
												<FieldLabel className="text-xs">
													Amount
												</FieldLabel>
												<Input
													type="number"
													step="0.01"
													value={
														form.state.values
															.expenses[index]
															?.amount || 0
													}
													onChange={(e) => {
														const newExpenses = [
															...form.state.values
																.expenses,
														];
														newExpenses[index] = {
															...newExpenses[
																index
															],
															amount:
																parseFloat(
																	e.target
																		.value,
																) || 0,
														};
														form.setFieldValue(
															"expenses",
															newExpenses,
														);
													}}
												/>
											</div>
										</div>

										<Button
											type="button"
											size="sm"
											variant="destructive"
											onClick={() => {
												const newExpenses =
													form.state.values.expenses.filter(
														(_, i) => i !== index,
													);
												form.setFieldValue(
													"expenses",
													newExpenses,
												);
											}}
										>
											Remove
										</Button>
									</div>
								))}
							</div>

							{/* Deductions Section */}
							<div className="border p-4 rounded-md space-y-2">
								<div className="flex justify-between items-center">
									<FieldLabel>
										Deductions (Optional)
									</FieldLabel>
									<Button
										type="button"
										size="sm"
										variant="outline"
										onClick={() =>
											setDeductionDialogOpen(true)
										}
									>
										<PlusIcon className="w-4 h-4 mr-1" />{" "}
										Add Deduction
									</Button>
								</div>

								{form.state.values.deductions.map(
									(_, index) => (
										<div
											key={index}
											className="border p-3 rounded bg-gray-50 space-y-2"
										>
											<div className="grid grid-cols-2 gap-2">
												<div>
													<FieldLabel className="text-xs">
														Deduction
													</FieldLabel>
													<Select
														value={
															form.state.values
																.deductions[
																index
															]?.deductionId ||
															"custom"
														}
														onValueChange={(
															value,
														) => {
															if (
																value !==
																"custom"
															) {
																const deduction =
																	deductions?.find(
																		(d) =>
																			d.id ===
																			value,
																	);
																if (deduction) {
																	const newDeductions =
																		[
																			...form
																				.state
																				.values
																				.deductions,
																		];
																	newDeductions[
																		index
																	] = {
																		...newDeductions[
																			index
																		],
																		deductionId:
																			deduction.id,
																		name: deduction.name,
																	};
																	form.setFieldValue(
																		"deductions",
																		newDeductions,
																	);
																}
															}
														}}
													>
														<SelectTrigger>
															<SelectValue placeholder="Select or custom" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="custom">
																Custom
															</SelectItem>
															{deductions?.map(
																(deduction) => (
																	<SelectItem
																		key={
																			deduction.id
																		}
																		value={
																			deduction.id
																		}
																	>
																		{
																			deduction.name
																		}
																	</SelectItem>
																),
															)}
														</SelectContent>
													</Select>
												</div>

												<div>
													<FieldLabel className="text-xs">
														Amount
													</FieldLabel>
													<Input
														type="number"
														step="0.01"
														value={
															form.state.values
																.deductions[
																index
															]?.amount || 0
														}
														onChange={(e) => {
															const newDeductions =
																[
																	...form
																		.state
																		.values
																		.deductions,
																];
															newDeductions[
																index
															] = {
																...newDeductions[
																	index
																],
																amount:
																	parseFloat(
																		e.target
																			.value,
																	) || 0,
															};
															form.setFieldValue(
																"deductions",
																newDeductions,
															);
														}}
													/>
												</div>
											</div>

											{form.state.values.deductions[index]
												?.deductionId === "" && (
												<div>
													<FieldLabel className="text-xs">
														Custom Name
													</FieldLabel>
													<Input
														value={
															form.state.values
																.deductions[
																index
															]?.name || ""
														}
														onChange={(e) => {
															const newDeductions =
																[
																	...form
																		.state
																		.values
																		.deductions,
																];
															newDeductions[
																index
															] = {
																...newDeductions[
																	index
																],
																name: e.target
																	.value,
															};
															form.setFieldValue(
																"deductions",
																newDeductions,
															);
														}}
														placeholder="Enter deduction name"
													/>
												</div>
											)}

											<Button
												type="button"
												size="sm"
												variant="destructive"
												onClick={() => {
													const newDeductions =
														form.state.values.deductions.filter(
															(_, i) =>
																i !== index,
														);
													form.setFieldValue(
														"deductions",
														newDeductions,
													);
												}}
											>
												Remove
											</Button>
										</div>
									),
								)}
							</div>

							{/* Customer Payment */}
							<form.Field name="cxPayAmt">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched &&
										!field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel>
												Customer Payment
											</FieldLabel>
											<Input
												type="number"
												step="0.01"
												value={field.state.value}
												onChange={(e) =>
													field.handleChange(
														parseFloat(
															e.target.value,
														) || 0,
													)
												}
												onBlur={field.handleBlur}
												placeholder="0.00"
											/>
											{isInvalid && (
												<FieldError
													errors={
														field.state.meta.errors
													}
												/>
											)}
										</Field>
									);
								}}
							</form.Field>

							{/* Status */}
							<form.Field name="status">
								{(field) => {
									return (
										<Field>
											<FieldLabel>Status</FieldLabel>
											<Select
												value={field.state.value}
												onValueChange={(value: any) =>
													field.handleChange(value)
												}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="pending">
														Pending
													</SelectItem>
													<SelectItem value="completed">
														Completed
													</SelectItem>
													<SelectItem value="cancelled">
														Cancelled
													</SelectItem>
												</SelectContent>
											</Select>
										</Field>
									);
								}}
							</form.Field>

							{/* Profit Display */}
							<div className="border-2 border-dashed p-4 rounded-md bg-gray-50">
								<div className="text-center">
									<p className="text-xs text-gray-600 mb-1">
										Calculated Profit
									</p>
									<p
										className={`text-4xl font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}
									>
										₱{profit.toFixed(2)}
									</p>
								</div>
							</div>
						</FieldGroup>
					</form>
				</CardContent>
				<CardFooter>
					<div className="w-full flex justify-end gap-2">
						{isPending ? (
							<Spinner />
						) : (
							<>
								<Button
									variant="outline"
									onClick={() => form.reset()}
								>
									Reset
								</Button>
								<Button
									type="submit"
									form="create-transaction-form"
								>
									Create Transaction
								</Button>
							</>
						)}
					</div>
				</CardFooter>
			</Card>

			<AddItemDialog
				open={itemDialogOpen}
				onOpenChange={setItemDialogOpen}
				onAdd={(item) => {
					form.setFieldValue("items", [
						...form.state.values.items,
						item,
					]);
				}}
				items={items}
			/>

			<AddExpenseDialog
				open={expenseDialogOpen}
				onOpenChange={setExpenseDialogOpen}
				onAdd={(expense) => {
					form.setFieldValue("expenses", [
						...form.state.values.expenses,
						expense,
					]);
				}}
			/>

			<AddDeductionDialog
				open={deductionDialogOpen}
				onOpenChange={setDeductionDialogOpen}
				onAdd={(deduction) => {
					form.setFieldValue("deductions", [
						...form.state.values.deductions,
						deduction,
					]);
				}}
				deductions={deductions}
			/>
		</Container>
	);
}
