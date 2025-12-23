"use client";

import Container from "@/components/custom/container";
import Loader from "@/components/custom/loader";
import PageHeader from "@/components/custom/page-header";
import { BoxIcon } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { Item, ItemSchema } from "@/domain/entities/item.schema";
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
import { useGetItem } from "@/hooks/item/use-get-item";
import { useUpdateItem } from "@/hooks/item/use-update-item";
import { useVendors } from "@/hooks/vendor/use-vendors";
import { useCategories } from "@/hooks/category/use-categories";
import { Spinner } from "@/components/ui/spinner";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page() {
  const params = useParams();
  const id = params.id as string;

  const { data: item, isLoading } = useGetItem(id);
  const { data: vendors, isLoading: vendorsLoading } = useVendors();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { mutateAsync: updateItemAsync, isPending } = useUpdateItem();

  const itemDefaultValues: Item = {
    name: "",
    description: "",
    categoryId: "",
    price: 0,
    vendorId: "",
  };

  const form = useForm({
    defaultValues: itemDefaultValues,
    validators: {
      onSubmit: ItemSchema,
    },
    onSubmit: async ({ value }) => {
      toast.success("Item updated successfully!");
      await updateItemAsync({ id, item: value });
    },
  });

  useEffect(() => {
    if (item) {
      form.setFieldValue("name", item.name);
      form.setFieldValue("description", item.description);
      form.setFieldValue("categoryId", item.categoryId);
      form.setFieldValue("price", item.price);
      form.setFieldValue("vendorId", item.vendorId);
    }
  }, [item]);

  if (isLoading) {
    return (
      <Container>
        <Loader text="Loading item..." />
      </Container>
    );
  }

  if (!item) {
    return (
      <Container>
        <PageHeader title="Item Not Found" icon={<BoxIcon />} />
        <Card>
          <CardContent>
            <p>The item you are looking for does not exist.</p>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <PageHeader title="Edit Item" icon={<BoxIcon />} />

      <Card>
        <CardContent>
          <form
            id="edit-item-form"
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
                        placeholder="Item Name"
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
                        placeholder="Item description..."
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="categoryId">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>Category</FieldLabel>
                      {categoriesLoading ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          Loading categories...
                        </div>
                      ) : (
                        <Select
                          value={field.state.value}
                          onValueChange={(value) => field.handleChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="price">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>Price</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(parseFloat(e.target.value))
                        }
                        aria-invalid={isInvalid}
                        placeholder="0.00"
                        autoComplete="off"
                        step="0.01"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="vendorId">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>Vendor</FieldLabel>
                      {vendorsLoading ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          Loading vendors...
                        </div>
                      ) : (
                        <Select
                          value={field.state.value}
                          onValueChange={(value) => field.handleChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a vendor" />
                          </SelectTrigger>
                          <SelectContent>
                            {vendors?.map((vendor) => (
                              <SelectItem key={vendor.id} value={vendor.id}>
                                {vendor.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
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
                <Button variant="outline" onClick={() => form.reset()}>
                  Reset
                </Button>
                <Button type="submit" form="edit-item-form">
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
