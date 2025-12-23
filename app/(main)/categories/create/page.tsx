"use client";

import Container from "@/components/custom/container";
import PageHeader from "@/components/custom/page-header";
import { FolderPlus } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { Category, CategorySchema } from "@/domain/entities/category.schema";
import { toast } from "sonner";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCreateCategory } from "@/hooks/category/use-create-category";
import { Spinner } from "@/components/ui/spinner";

export default function Page() {
	const categoryDefaultValues: Category = {
		name: "",
		description: "",
	};

	const { mutateAsync: createCategoryAsync, isPending } = useCreateCategory();

	const form = useForm({
		defaultValues: categoryDefaultValues,
		validators: {
			onSubmit: CategorySchema,
		},
		onSubmit: async ({ value }) => {
			toast.success("Category created successfully!");

			await createCategoryAsync(value);
		},
	});

	return (
		<Container>
			<PageHeader title="Create Category" icon={<FolderPlus />} />

			<Card>
				<CardContent>
					<form
						id="create-category-form"
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
												placeholder="e.g., Chemicals"
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

							<form.Field name="description">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched &&
										!field.state.meta.isValid;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel>Description</FieldLabel>
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
												placeholder="Category description..."
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
								<Button type="submit" form="create-category-form">
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
