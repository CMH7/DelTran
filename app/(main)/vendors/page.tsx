"use client";

import Container from "@/components/custom/container";
import { Button } from "@/components/ui/button";
import { PlusIcon, SquareUser, UserSearch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import VendorCard from "@/components/custom/vendor-card";
import { useVendors } from "@/hooks/vendor/use-vendors";
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

export default function VendorsPage() {
	const router = useRouter();
	const { data: vendors, isLoading, error } = useVendors();

	const [searchStr, setSearchStr] = useState<string>("");

	const filteredVendors = useMemo(() => {
		const vendorList = vendors ?? [];

		if (!searchStr) {
			return vendors;
		}

		const s = searchStr.toLowerCase();

		return vendorList.filter((vendor) => {
			// guard against potential undefined properties and normalize
			const name = vendor.name?.toLowerCase() ?? "";
			const address = vendor.address?.toLowerCase() ?? "";
			const phone = vendor.phone?.toLowerCase() ?? "";
			const note = vendor.note?.toLowerCase() ?? "";

			return (
				name.includes(s) ||
				address.includes(s) ||
				phone.includes(s) ||
				note.includes(s)
			);
		});
	}, [searchStr, vendors]);

	return (
		<Container>
			<PageHeader
				title="Vendors"
				icon={<SquareUser />}
				end={
					<Button onClick={() => router.push("/vendors/create")}>
						<PlusIcon />
					</Button>
				}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
				<div>
					<Input
						value={searchStr}
						onChange={(e) => setSearchStr(e.target.value)}
						placeholder="Search vendors.."
					/>
				</div>

				<ScrollArea className="h-[calc(100vh-200px)] lg:col-span-3">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
						{isLoading ? (
							<Loader text="Loading vendors" />
						) : error ? (
							<div className="p-4 text-red-500">
								Failed to load vendors
							</div>
						) : filteredVendors && filteredVendors.length > 0 ? (
							filteredVendors.map((vendor) => (
								<VendorCard vendor={vendor} key={vendor.id} />
							))
						) : (
							<Empty>
								<EmptyHeader>
									<EmptyMedia>
										<UserSearch />
									</EmptyMedia>
									<EmptyTitle>No vendors found</EmptyTitle>
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
