"use client";

import Container from "@/components/custom/container";
import Loader from "@/components/custom/loader";
import PageHeader from "@/components/custom/page-header";
import { FolderEdit } from "lucide-react";
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
import { useGetCategory } from "@/hooks/category/use-get-category";
import { useUpdateCategory } from "@/hooks/category/use-update-category";
import { Spinner } from "@/components/ui/spinner";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
	const params = useParams();
	const id = params.id as string;

	const { data: category, isLoading } = useGetCategory(id);
	const { mutateAsync: updateCategoryAsync, isPending } = useUpdateCategory();

	const categoryDefaultValues: Category = {
		name: "",
		description: "",
	};

	const form = useForm({
		defaultValues: categoryDefaultValues,
		validators: {
			onSubmit: CategorySchema,
		},
		onSubmit: async ({ value }) => {
			toast.success("Category updated successfully!");
			await updateCategoryAsync({ id, category: value });
		},
	});

	useEffect(() => {
		if (category) {
			form.setFieldValue("name", category.name);
			form.setFieldValue("description", category.description);
		}
	}, [category]);

	if (isLoading) {
		return (
			<Container>
				<Loader text="Loading category..." />
			</Container>
		);
	}

	if (!category) {
		return (
			<Container>
				<PageHeader title="Category Not Found" icon={<FolderEdit />} />
				<Card>
					<CardContent>
						<p>The category you are looking for does not exist.</p>
					</CardContent>
				</Card>
			</Container>
		);
	}

	return (
		<Container>
			<PageHeader title="Edit Category" icon={<FolderEdit />} />

			<Card>
				<CardContent>
					<form
						id="edit-category-form"
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
								<Button type="submit" form="edit-category-form">
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
