import React from "react";
import { BaseProp } from "../props/base-prop";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { EditIcon, TrashIcon } from "lucide-react";
import { DeltranDoc } from "@/domain/entities/deltran.schema";
import useSwipeReveal from "../../hooks/use-swipe-reveal";
import { useDeleteTransaction } from "@/hooks/transaction/use-delete-transaction";
import { useRouter } from "next/navigation";
import { calculateProfit } from "@/lib/transaction-utils";
import { Badge } from "../ui/badge";

interface TransactionCardProps extends BaseProp {
	transaction: DeltranDoc;
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
	const router = useRouter();
	const { mutate: deleteTransaction } = useDeleteTransaction();

	const {
		containerRef,
		translateX,
		isDragging,
		isOpen,
		actionsWidth,
		onPointerDown,
		onPointerMove,
		onPointerUp,
		onPointerCancel,
		onKeyDown,
		setIsOpen,
	} = useSwipeReveal({ actionsWidth: 160, idPrefix: "transaction-card" });

	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation();
		router.push(`/transactions/${transaction.id}/edit`);
		setIsOpen(false);
	};

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (confirm(`Delete transaction ${transaction.refNumber}?`)) {
			deleteTransaction(transaction.id);
		}
		setIsOpen(false);
	};

	const profit = calculateProfit(transaction);
	const profitColor = profit >= 0 ? "text-green-600" : "text-red-600";

	return (
		<div className="w-full relative">
			{/* Right-side actions */}
			<div
				className="absolute inset-y-0 right-0 flex items-center justify-center pr-2"
				style={{
					width: actionsWidth,
					zIndex: 0,
				}}
				aria-hidden={false}
			>
				<div className="w-full flex items-center justify-evenly gap-2 h-full">
					<Button onClick={handleDelete} variant="destructive" size="lg">
						<TrashIcon />
					</Button>
					<Button onClick={handleEdit} variant="secondary" size="lg">
						<EditIcon />
					</Button>
				</div>
			</div>

			{/* Card content */}
			<div
				ref={containerRef}
				role="button"
				tabIndex={0}
				onKeyDown={onKeyDown}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={(e) => onPointerUp(e)}
				onPointerCancel={(e) => onPointerCancel(e)}
				className="relative z-10 select-none"
				style={{
					transform: `translateX(${translateX}px)`,
					transition: isDragging
						? "none"
						: "transform 260ms cubic-bezier(.2,.9,.2,1)",
					touchAction: "pan-y",
				}}
			>
				<Card>
					<CardHeader>
						<CardTitle>
							<div className="flex justify-between items-start">
								<div className="truncate">{transaction.customerName}</div>
								<Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
									{transaction.status}
								</Badge>
							</div>
						</CardTitle>
						<CardDescription>
							{transaction.refNumber} • {transaction.items.length} item(s)
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex justify-between items-center">
							<div className="text-sm text-gray-600">
								Total: ₱{transaction.cxPayAmt.toFixed(2)}
							</div>
							<div className={`text-lg font-bold ${profitColor}`}>
								Profit: ₱{profit.toFixed(2)}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
