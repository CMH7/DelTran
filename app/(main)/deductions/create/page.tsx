"use client";

import Container from "@/components/custom/container";
import PageHeader from "@/components/custom/page-header";
import { Receipt } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { Deduction, DeductionSchema } from "@/domain/entities/deduction.schema";
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
import { useCreateDeduction } from "@/hooks/deduction/use-create-deduction";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";

export default function Page() {
	const { mutateAsync: createDeductionAsync, isPending } = useCreateDeduction();

	const deductionDefaultValues: Deduction = {
		name: "",
		description: "",
		showInDashboard: false,
	};

	const form = useForm({
		defaultValues: deductionDefaultValues,
		validators: {
			onSubmit: DeductionSchema,
		},
		onSubmit: async ({ value }) => {
			toast.success("Deduction created successfully!");

			await createDeductionAsync(value);
		},
	});

	return (
		<Container>
			<PageHeader title="Create Deduction" icon={<Receipt />} />

			<Card>
				<CardContent>
					<form
						id="create-deduction-form"
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
					>
						<FieldGroup>
							<form.Field name="name">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel>Name</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="Loan Repayment"
												autoComplete="off"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>

							<form.Field name="description">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel>Description</FieldLabel>
											<Textarea
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="Monthly loan repayment to bank..."
												autoComplete="off"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>

							<form.Field name="showInDashboard">
								{(field) => (
									<Field>
										<div className="flex items-center space-x-2">
											<Checkbox
												id={field.name}
												checked={field.state.value}
												onCheckedChange={(checked) =>
													field.handleChange(checked === true)
												}
											/>
											<FieldLabel htmlFor={field.name}>
												Show in Dashboard
											</FieldLabel>
										</div>
									</Field>
								)}
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
								<Button variant="outline" onClick={() => form.reset()}>
									Reset
								</Button>
								<Button type="submit" form="create-deduction-form">
									Add
								</Button>
							</>
						)}
					</div>
				</CardFooter>
			</Card>
		</Container>
	);
}
