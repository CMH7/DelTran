"use client";

import Container from "@/components/custom/container";
import Loader from "@/components/custom/loader";
import PageHeader from "@/components/custom/page-header";
import { UserPlus } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { Customer, CustomerSchema } from "@/domain/entities/customer.schema";
import { toast } from "sonner";
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
import { useGetCustomer } from "@/hooks/customer/use-get-customer";
import { useUpdateCustomer } from "@/hooks/customer/use-update-customer";
import { Spinner } from "@/components/ui/spinner";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
	const params = useParams();
	const id = params.id as string;

	const { data: customer, isLoading } = useGetCustomer(id);
	const { mutateAsync: updateCustomerAsync, isPending } = useUpdateCustomer();

	const customerDefaultValues: Customer = {
		name: "",
		phone: "",
		address: "",
		email: "",
		note: "",
	};

	const form = useForm({
		defaultValues: customerDefaultValues,
		validators: {
			onSubmit: CustomerSchema as any,
		},
		onSubmit: async ({ value }) => {
			toast.success("Customer updated successfully!");
			await updateCustomerAsync({ id, customer: value });
		},
	});

	useEffect(() => {
		if (customer) {
			form.setFieldValue("name", customer.name);
			form.setFieldValue("phone", customer.phone);
			form.setFieldValue("address", customer.address || "");
			form.setFieldValue("email", customer.email || "");
			form.setFieldValue("note", customer.note || "");
		}
	}, [customer]);

	if (isLoading) {
		return (
			<Container>
				<Loader text="Loading customer..." />
			</Container>
		);
	}

	if (!customer) {
		return (
			<Container>
				<PageHeader title="Customer Not Found" icon={<UserPlus />} />
				<Card>
					<CardContent>
						<p>The customer you are looking for does not exist.</p>
					</CardContent>
				</Card>
			</Container>
		);
	}

	return (
		<Container>
			<PageHeader title="Edit Customer" icon={<UserPlus />} />

			<Card>
				<CardContent>
					<form
						id="edit-customer-form"
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
					>
						<FieldGroup>
							<form.Field name="name">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched &&
										!field.state.meta.isValid;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel>Name</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) =>
													field.handleChange(
														e.target.value,
													)
												}
												aria-invalid={isInvalid}
												placeholder="Customer Name"
												autoComplete="off"
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

							<form.Field name="phone">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched &&
										!field.state.meta.isValid;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel>Phone</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) =>
													field.handleChange(
														e.target.value,
													)
												}
												aria-invalid={isInvalid}
												placeholder="09xx xxx xxx"
												autoComplete="off"
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

							<form.Field name="address">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched &&
										!field.state.meta.isValid;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel>Address (Optional)</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) =>
													field.handleChange(
														e.target.value,
													)
												}
												aria-invalid={isInvalid}
												placeholder="Manila, Philippines"
												autoComplete="off"
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

							<form.Field name="email">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched &&
										!field.state.meta.isValid;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel>Email (Optional)</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) =>
													field.handleChange(
														e.target.value,
													)
												}
												aria-invalid={isInvalid}
												placeholder="customer@email.com"
												autoComplete="off"
												type="email"
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

							<form.Field name="note">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched &&
										!field.state.meta.isValid;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel>Note (Optional)</FieldLabel>
											<Textarea
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) =>
													field.handleChange(
														e.target.value,
													)
												}
												aria-invalid={isInvalid}
												placeholder="Customer preferences, delivery instructions..."
												autoComplete="off"
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
								<Button type="submit" form="edit-customer-form">
									Update
								</Button>
							</>
						)}
					</div>
				</CardFooter>
			</Card>
		</Container>
	);
}
