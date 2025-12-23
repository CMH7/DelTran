"use client";

import Container from "@/components/custom/container";
import Loader from "@/components/custom/loader";
import PageHeader from "@/components/custom/page-header";
import { UserPlus } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { Vendor, VendorSchema } from "@/domain/entities/vendor.schema";
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
import { useGetVendor } from "@/hooks/vendor/use-get-vendor";
import { useUpdateVendor } from "@/hooks/vendor/use-update-vendor";
import { Spinner } from "@/components/ui/spinner";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
	const params = useParams();
	const id = params.id as string;

	const { data: vendor, isLoading } = useGetVendor(id);
	const { mutateAsync: updateVendorAsync, isPending } = useUpdateVendor();

	const vendorDefaultValues: Vendor = {
		name: "",
		phone: "",
		address: "",
		note: "",
	};

	const form = useForm({
		defaultValues: vendorDefaultValues,
		validators: {
			onSubmit: VendorSchema,
		},
		onSubmit: async ({ value }) => {
			toast.success("Vendor updated successfully!");
			await updateVendorAsync({ id, vendor: value });
		},
	});

	useEffect(() => {
		if (vendor) {
			form.setFieldValue("name", vendor.name);
			form.setFieldValue("phone", vendor.phone);
			form.setFieldValue("address", vendor.address);
			form.setFieldValue("note", vendor.note);
		}
	}, [vendor]);

	if (isLoading) {
		return (
			<Container>
				<Loader text="Loading vendor..." />
			</Container>
		);
	}

	if (!vendor) {
		return (
			<Container>
				<PageHeader title="Vendor Not Found" icon={<UserPlus />} />
				<Card>
					<CardContent>
						<p>The vendor you are looking for does not exist.</p>
					</CardContent>
				</Card>
			</Container>
		);
	}

	return (
		<Container>
			<PageHeader title="Edit Vendor" icon={<UserPlus />} />

			<Card>
				<CardContent>
					<form
						id="edit-vendor-form"
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
												placeholder="Vendor Name"
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
											<FieldLabel>Location</FieldLabel>
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

							<form.Field name="note">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched &&
										!field.state.meta.isValid;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel>Note</FieldLabel>
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
												placeholder="Full payment first before item..."
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
								<Button type="submit" form="edit-vendor-form">
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
