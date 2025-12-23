"use client";

import Container from "@/components/custom/container";
import { Button } from "@/components/ui/button";
import { PlusIcon, Receipt, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import DeductionCard from "@/components/custom/deduction-card";
import { useDeductions } from "@/hooks/deduction/use-deductions";
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

export default function DeductionsPage() {
	const router = useRouter();
	const { data: deductions, isLoading, error } = useDeductions();

	const [searchStr, setSearchStr] = useState<string>("");

	const filteredDeductions = useMemo(() => {
		const deductionList = deductions ?? [];

		if (!searchStr) {
			return deductions;
		}

		const s = searchStr.toLowerCase();

		return deductionList.filter((deduction) => {
			const name = deduction.name?.toLowerCase() ?? "";
			const description = deduction.description?.toLowerCase() ?? "";

			return name.includes(s) || description.includes(s);
		});
	}, [searchStr, deductions]);

	return (
		<Container>
			<PageHeader
				title="Deductions"
				icon={<Receipt />}
				end={
					<Button onClick={() => router.push("/deductions/create")}>
						<PlusIcon />
					</Button>
				}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
				<div>
					<Input
						value={searchStr}
						onChange={(e) => setSearchStr(e.target.value)}
						placeholder="Search deductions.."
					/>
				</div>

				<ScrollArea className="h-[calc(100vh-200px)] lg:col-span-3">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
						{isLoading ? (
							<Loader text="Loading deductions" />
						) : error ? (
							<div className="p-4 text-red-500">
								Failed to load deductions
							</div>
						) : filteredDeductions && filteredDeductions.length > 0 ? (
							filteredDeductions.map((deduction) => (
								<DeductionCard deduction={deduction} key={deduction.id} />
							))
						) : (
							<Empty>
								<EmptyHeader>
									<EmptyMedia>
										<Search />
									</EmptyMedia>
									<EmptyTitle>No deductions found</EmptyTitle>
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
