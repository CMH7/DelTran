"use client";

import Container from "@/components/custom/container";
import { Button } from "@/components/ui/button";
import { PlusIcon, SquareUser } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import VendorCard from "@/components/custom/vendor-card";
import { useVendors } from "@/hooks/use-vendors";
import { useMemo, useState } from "react";

export default function VendorsPage() {
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
			<div className="flex justify-between">
				<div className="flex items-center gap-1">
					<SquareUser />
					<p className="font-bold text-lg">Vendors</p>
				</div>
				<Button>
					<PlusIcon />
				</Button>
			</div>

			<div className="grid grid-cols-1 gap-2">
				<div>
					<Input
						value={searchStr}
						onChange={(e) => setSearchStr(e.target.value)}
						placeholder="Search vendors.."
					/>
				</div>

				<ScrollArea className="h-[calc(100vh-200px)]">
					<div className="grid grid-cols-2 gap-2">
						{isLoading ? (
							<div className="p-4">Loading vendors...</div>
						) : error ? (
							<div className="p-4 text-red-500">
								Failed to load vendors
							</div>
						) : filteredVendors && filteredVendors.length > 0 ? (
							filteredVendors.map((vendor) => (
								<VendorCard vendor={vendor} key={vendor.id} />
							))
						) : (
							<div className="p-4 text-muted-foreground">
								No vendors found
							</div>
						)}
					</div>
				</ScrollArea>
			</div>
		</Container>
	);
}
