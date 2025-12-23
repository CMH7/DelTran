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
import { CustomerDoc } from "@/domain/entities/customer.schema";
import useSwipeReveal from "../../hooks/use-swipe-reveal";
import { CopyButton } from "../ui/shadcn-io/copy-button";
import { toast } from "sonner";
import { useDeleteCustomer } from "@/hooks/customer/use-delete-customer";
import { useRouter } from "next/navigation";

interface CustomerCardProps extends BaseProp {
	customer: CustomerDoc;
}

export default function CustomerCard({ customer }: CustomerCardProps) {
	const router = useRouter();
	const { mutate: deleteCustomer } = useDeleteCustomer();

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
	} = useSwipeReveal({ actionsWidth: 160, idPrefix: "customer-card" });

	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation();
		router.push(`/customers/${customer.id}/edit`);
		setIsOpen(false);
	};

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (confirm(`Delete ${customer.name}?`)) {
			deleteCustomer(customer.id);
		}
		setIsOpen(false);
	};

	return (
		<div className="w-full relative">
			{/* Right-side actions (horizontal layout) */}
			<div
				className="absolute inset-y-0 right-0 flex items-center justify-center pr-2"
				style={{
					width: actionsWidth,
					zIndex: 0,
				}}
				aria-hidden={false}
			>
				<div className="w-full flex items-center justify-evenly gap-2 h-full">
					<Button
						onClick={handleDelete}
						variant="destructive"
						size="lg"
					>
						<TrashIcon />
					</Button>

					<Button onClick={handleEdit} variant="secondary" size="lg">
						<EditIcon />
					</Button>
				</div>
			</div>

			{/* Card content - this moves left (negative translateX) to reveal right actions */}
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
								<div className="truncate">{customer.name}</div>

								<div className="flex items-center gap-2 border px-1 rounded-md">
									<span className="text-xs">
										{customer.phone}
									</span>
									<CopyButton
										size="sm"
										variant="ghost"
										content={customer.phone}
										onCopy={() => {
											toast.success(
												"Phone number copied!",
											);
										}}
									/>
								</div>
							</div>
						</CardTitle>
						<CardDescription>
							{customer.address || customer.email || "No address or email"}
						</CardDescription>
					</CardHeader>
					{customer.note && (
						<CardContent>
							<div className="rounded-md p-1 text-xs text-slate-700 bg-gray-100">
								{customer.note}
							</div>
						</CardContent>
					)}
				</Card>
			</div>
		</div>
	);
}
