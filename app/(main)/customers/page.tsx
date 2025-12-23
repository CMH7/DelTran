"use client";

import Container from "@/components/custom/container";
import { Button } from "@/components/ui/button";
import { PlusIcon, Users, UserSearch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import CustomerCard from "@/components/custom/customer-card";
import { useCustomers } from "@/hooks/customer/use-customers";
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

export default function CustomersPage() {
	const router = useRouter();
	const { data: customers, isLoading, error } = useCustomers();

	const [searchStr, setSearchStr] = useState<string>("");

	const filteredCustomers = useMemo(() => {
		const customerList = customers ?? [];

		if (!searchStr) {
			return customers;
		}

		const s = searchStr.toLowerCase();

		return customerList.filter((customer) => {
			const name = customer.name?.toLowerCase() ?? "";
			const address = customer.address?.toLowerCase() ?? "";
			const phone = customer.phone?.toLowerCase() ?? "";
			const email = customer.email?.toLowerCase() ?? "";
			const note = customer.note?.toLowerCase() ?? "";

			return (
				name.includes(s) ||
				address.includes(s) ||
				phone.includes(s) ||
				email.includes(s) ||
				note.includes(s)
			);
		});
	}, [searchStr, customers]);

	return (
		<Container>
			<PageHeader
				title="Customers"
				icon={<Users />}
				end={
					<Button onClick={() => router.push("/customers/create")}>
						<PlusIcon />
					</Button>
				}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
				<div>
					<Input
						value={searchStr}
						onChange={(e) => setSearchStr(e.target.value)}
						placeholder="Search customers.."
					/>
				</div>

				<ScrollArea className="h-[calc(100vh-200px)] lg:col-span-3">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
						{isLoading ? (
							<Loader text="Loading customers" />
						) : error ? (
							<div className="p-4 text-red-500">
								Failed to load customers
							</div>
						) : filteredCustomers && filteredCustomers.length > 0 ? (
							filteredCustomers.map((customer) => (
								<CustomerCard customer={customer} key={customer.id} />
							))
						) : (
							<Empty>
								<EmptyHeader>
									<EmptyMedia>
										<UserSearch />
									</EmptyMedia>
									<EmptyTitle>No customers found</EmptyTitle>
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
