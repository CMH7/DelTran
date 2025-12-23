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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { TransactionItem } from "@/domain/entities/deltran.schema";
import { ItemDoc } from "@/domain/entities/item.schema";

interface AddItemDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAdd: (item: TransactionItem) => void;
	items: ItemDoc[] | undefined;
}

export default function AddItemDialog({
	open,
	onOpenChange,
	onAdd,
	items,
}: AddItemDialogProps) {
	const [itemId, setItemId] = useState("");
	const [qty, setQty] = useState(1);

	const selectedItem = items?.find((item) => item.id === itemId);
	const price = selectedItem?.price || 0;
	const total = price * qty;

	const isValid = itemId !== "" && qty >= 1;

	const handleAdd = () => {
		if (!isValid || !selectedItem) return;

		const newItem: TransactionItem = {
			itemId,
			name: selectedItem.name,
			price,
			qty,
			total,
		};

		onAdd(newItem);

		// Clear form
		setItemId("");
		setQty(1);

		// Close dialog
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Item</DialogTitle>
					<DialogDescription>
						Select an item and enter the quantity.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<Field>
						<FieldLabel>Item</FieldLabel>
						<Select value={itemId} onValueChange={setItemId}>
							<SelectTrigger>
								<SelectValue placeholder="Select item" />
							</SelectTrigger>
							<SelectContent>
								{items?.map((item) => (
									<SelectItem key={item.id} value={item.id}>
										{item.name} - ₱{item.price.toFixed(2)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>

					<Field>
						<FieldLabel>Quantity</FieldLabel>
						<Input
							type="number"
							min="1"
							value={qty}
							onChange={(e) => setQty(parseInt(e.target.value) || 1)}
						/>
					</Field>

					{selectedItem && (
						<div className="border p-3 rounded bg-gray-50">
							<div className="flex justify-between text-sm">
								<span className="text-gray-600">Price:</span>
								<span className="font-medium">₱{price.toFixed(2)}</span>
							</div>
							<div className="flex justify-between text-sm mt-1">
								<span className="text-gray-600">Total:</span>
								<span className="font-bold text-lg">₱{total.toFixed(2)}</span>
							</div>
						</div>
					)}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={handleAdd} disabled={!isValid}>
						Add Item
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
