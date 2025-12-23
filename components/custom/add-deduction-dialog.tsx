"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { TransactionDeduction } from "@/domain/entities/deltran.schema";
import { DeductionDoc } from "@/domain/entities/deduction.schema";

interface AddDeductionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAdd: (deduction: TransactionDeduction) => void;
	deductions: DeductionDoc[] | undefined;
}

export default function AddDeductionDialog({
	open,
	onOpenChange,
	onAdd,
	deductions,
}: AddDeductionDialogProps) {
	const [deductionId, setDeductionId] = useState("");
	const [customName, setCustomName] = useState("");
	const [amount, setAmount] = useState(0);
	const [note, setNote] = useState("");

	const isCustom = deductionId === "custom";
	const selectedDeduction = deductions?.find((d) => d.id === deductionId);
	const finalName = isCustom ? customName : selectedDeduction?.name || "";

	const isValid = finalName.trim() !== "" && amount >= 0;

	const handleAdd = () => {
		if (!isValid) return;

		const newDeduction: TransactionDeduction = {
			deductionId: isCustom ? "" : deductionId,
			name: finalName.trim(),
			amount,
			note,
		};

		onAdd(newDeduction);

		// Clear form
		setDeductionId("");
		setCustomName("");
		setAmount(0);
		setNote("");

		// Close dialog
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Deduction</DialogTitle>
					<DialogDescription>
						Select a preset deduction or enter a custom one.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<Field>
						<FieldLabel>Deduction Type</FieldLabel>
						<Select
							value={deductionId || "custom"}
							onValueChange={(value) => {
								setDeductionId(value);
								if (value !== "custom") {
									setCustomName("");
								}
							}}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select or custom" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="custom">Custom</SelectItem>
								{deductions?.map((deduction) => (
									<SelectItem key={deduction.id} value={deduction.id}>
										{deduction.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>

					{isCustom && (
						<Field>
							<FieldLabel>Custom Name</FieldLabel>
							<Input
								value={customName}
								onChange={(e) => setCustomName(e.target.value)}
								placeholder="Enter deduction name"
							/>
						</Field>
					)}

					<Field>
						<FieldLabel>Amount</FieldLabel>
						<Input
							type="number"
							step="0.01"
							min="0"
							value={amount}
							onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
							placeholder="0.00"
						/>
					</Field>

					<Field>
						<FieldLabel>Note (Optional)</FieldLabel>
						<Textarea
							value={note}
							onChange={(e) => setNote(e.target.value)}
							placeholder="Additional notes..."
						/>
					</Field>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={handleAdd} disabled={!isValid}>
						Add Deduction
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
