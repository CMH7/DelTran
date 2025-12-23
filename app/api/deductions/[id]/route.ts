import {
	getDeductionCase,
	updateDeductionCase,
	deleteDeductionCase,
} from "@/dependency-registry";
import { Deduction } from "@/domain/entities/deduction.schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const result = await getDeductionCase.execute(id);

		if (!result.data) {
			return NextResponse.json(
				{ success: false, message: result.message },
				{ status: 404 },
			);
		}

		return NextResponse.json(
			{ success: true, data: result.data, message: result.message },
			{ status: 200 },
		);
	} catch (err: unknown) {
		console.error("get deduction error", err);
		const message = err instanceof Error ? err.message : "Internal error";
		return NextResponse.json({ success: false, message }, { status: 400 });
	}
}

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const body = await req.json();
		const deductionData = body as Partial<Deduction>;

		const result = await updateDeductionCase.execute(id, deductionData);

		if (!result.data) {
			return NextResponse.json(
				{ success: false, message: result.message },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ success: true, data: result.data, message: result.message },
			{ status: 200 },
		);
	} catch (err: unknown) {
		console.error("update deduction error", err);
		const message = err instanceof Error ? err.message : "Internal error";
		return NextResponse.json({ success: false, message }, { status: 400 });
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const result = await deleteDeductionCase.execute(id);

		return NextResponse.json(
			{ success: result.success, message: result.message },
			{ status: 200 },
		);
	} catch (err: unknown) {
		console.error("delete deduction error", err);
		const message = err instanceof Error ? err.message : "Internal error";
		return NextResponse.json({ success: false, message }, { status: 400 });
	}
}
