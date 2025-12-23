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
import { Field, FieldLabel } from "@/components/ui/field";
import { TransactionExpense } from "@/domain/entities/deltran.schema";

interface AddExpenseDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAdd: (expense: TransactionExpense) => void;
}

export default function AddExpenseDialog({
	open,
	onOpenChange,
	onAdd,
}: AddExpenseDialogProps) {
	const [description, setDescription] = useState("");
	const [amount, setAmount] = useState(0);
	const [note, setNote] = useState("");

	const isValid = description.trim() !== "" && amount >= 0;

	const handleAdd = () => {
		if (!isValid) return;

		const newExpense: TransactionExpense = {
			description: description.trim(),
			amount,
			note,
		};

		onAdd(newExpense);

		// Clear form
		setDescription("");
		setAmount(0);
		setNote("");

		// Close dialog
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Expense</DialogTitle>
					<DialogDescription>
						Enter expense details for this transaction.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<Field>
						<FieldLabel>Description</FieldLabel>
						<Input
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Gas, toll, etc."
						/>
					</Field>

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
						Add Expense
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
