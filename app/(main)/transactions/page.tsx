"use client";

import Container from "@/components/custom/container";
import { Button } from "@/components/ui/button";
import { PlusIcon, Receipt, FileSearch } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import TransactionCard from "@/components/custom/transaction-card";
import { useTransactions } from "@/hooks/transaction/use-transactions";
import { useMemo } from "react";
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

export default function TransactionsPage() {
	const router = useRouter();
	const { data: transactions, isLoading, error } = useTransactions();

	// Sort transactions by date (most recent first)
	const sortedTransactions = useMemo(() => {
		if (!transactions) return [];
		return [...transactions].sort((a, b) =>
			new Date(b.tranDate).getTime() - new Date(a.tranDate).getTime()
		);
	}, [transactions]);

	return (
		<Container>
			<PageHeader
				title="Transactions"
				icon={<Receipt />}
				end={
					<Button onClick={() => router.push("/transactions/create")}>
						<PlusIcon />
					</Button>
				}
			/>

			<ScrollArea className="h-[calc(100vh-200px)]">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
					{isLoading ? (
						<Loader text="Loading transactions" />
					) : error ? (
						<div className="p-4 text-red-500">
							Failed to load transactions
						</div>
					) : sortedTransactions && sortedTransactions.length > 0 ? (
						sortedTransactions.map((transaction) => (
							<TransactionCard transaction={transaction} key={transaction.id} />
						))
					) : (
						<Empty>
							<EmptyHeader>
								<EmptyMedia>
									<FileSearch />
								</EmptyMedia>
								<EmptyTitle>No transactions found</EmptyTitle>
								<EmptyDescription>
									Create your first transaction
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					)}
				</div>
			</ScrollArea>
		</Container>
	);
}
