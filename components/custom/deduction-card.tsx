import React from "react";
import { DeductionDoc } from "@/domain/entities/deduction.schema";
import { BaseProp } from "../props/base-prop";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { EditIcon, TrashIcon } from "lucide-react";
import useSwipeReveal from "../../hooks/use-swipe-reveal";
import { useDeleteDeduction } from "@/hooks/deduction/use-delete-deduction";
import { useRouter } from "next/navigation";

interface DeductionCardProps extends BaseProp {
	deduction: DeductionDoc;
}

/**
 * DeductionCard
 *
 * - Slide left to reveal right-side actions (iOS-like horizontal layout).
 * - If released past 80% of the actions width, the card locks open; otherwise it snaps back.
 * - Uses Pointer Events so it works with mouse and touch.
 * - Only one card can be open at a time via the shared manager inside the hook.
 */
export default function DeductionCard({ deduction }: DeductionCardProps) {
	const router = useRouter();
	const { mutate: deleteDeduction } = useDeleteDeduction();

	// Use the reusable hook for swipe-to-reveal behavior
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
	} = useSwipeReveal({ actionsWidth: 160, idPrefix: "deduction-card" });

	// Action handlers
	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation();
		router.push(`/deductions/${deduction.id}/edit`);
		setIsOpen(false);
	};

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (confirm(`Delete ${deduction.name}?`)) {
			deleteDeduction(deduction.id);
		}
		setIsOpen(false);
	};

	return (
		<div className="relative">
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

			{/* Card content - this moves left (negative translateX) to reveal right-side actions */}
			<div
				ref={containerRef}
				role="button"
				tabIndex={0}
				onKeyDown={onKeyDown}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				onPointerCancel={onPointerCancel}
				className="relative z-10 select-none"
				style={{
					transform: `translateX(${translateX}px)`,
					transition: isDragging
						? "none"
						: "transform 260ms cubic-bezier(.2,.9,.2,1)",
					touchAction: "pan-y", // allow vertical scrolling while handling horizontal swipe
				}}
			>
				<Card>
					<CardHeader>
						<CardTitle>
							<div className="flex justify-between items-start">
								<div className="truncate">{deduction.name}</div>
								{deduction.showInDashboard && (
									<Badge variant="default">Dashboard</Badge>
								)}
							</div>
						</CardTitle>
						<CardDescription>{deduction.description}</CardDescription>
					</CardHeader>
				</Card>
			</div>
		</div>
	);
}
