"use client";

import Container from "@/components/custom/container";
import { Button } from "@/components/ui/button";
import { PlusIcon, Folder, FolderSearch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import CategoryCard from "@/components/custom/category-card";
import { useCategories } from "@/hooks/category/use-categories";
import { useMemo, useState } from "react";
import PageHeader from "@/components/custom/page-header";
import { useRouter } from "next/navigation";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import Loader from "@/components/custom/loader";

export default function CategoriesPage() {
	const router = useRouter();
	const { data: categories, isLoading, error } = useCategories();

	const [searchStr, setSearchStr] = useState<string>("");

	const filteredCategories = useMemo(() => {
		const categoryList = categories ?? [];

		if (!searchStr) {
			return categories;
		}

		const s = searchStr.toLowerCase();

		return categoryList.filter((category) => {
			const name = category.name?.toLowerCase() ?? "";
			const description = category.description?.toLowerCase() ?? "";

			return name.includes(s) || description.includes(s);
		});
	}, [searchStr, categories]);

	return (
		<Container>
			<PageHeader
				title="Categories"
				icon={<Folder />}
				end={
					<Button onClick={() => router.push("/categories/create")}>
						<PlusIcon />
					</Button>
				}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
				<div>
					<Input
						value={searchStr}
						onChange={(e) => setSearchStr(e.target.value)}
						placeholder="Search categories.."
					/>
				</div>

				<ScrollArea className="h-[calc(100vh-200px)] lg:col-span-3">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
						{isLoading ? (
							<Loader text="Loading categories" />
						) : error ? (
							<div className="p-4 text-red-500">
								Failed to load categories
							</div>
						) : filteredCategories && filteredCategories.length > 0 ? (
							filteredCategories.map((category) => (
								<CategoryCard category={category} key={category.id} />
							))
						) : (
							<Empty>
								<EmptyHeader>
									<EmptyMedia>
										<FolderSearch />
									</EmptyMedia>
									<EmptyTitle>No categories found</EmptyTitle>
									<EmptyDescription>
										Try to search again
									</EmptyDescription>
								</EmptyHeader>
							</Empty>
						)}
					</div>
				</ScrollArea>
			</div>
		</Container>
	);
}
