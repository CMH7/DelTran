import { createDeductionCase, listDeductionsCase } from "@/dependency-registry";
import { Deduction } from "@/domain/entities/deduction.schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
	try {
		const result = await listDeductionsCase.execute();

		return NextResponse.json(
			{
				success: true,
				data: result.data,
				message: result.message,
			},
			{ status: 200 },
		);
	} catch (err: unknown) {
		console.error("list deductions error", err);
		const message = err instanceof Error ? err.message : "Internal error";
		return NextResponse.json({ success: false, message }, { status: 400 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const deductionData = body as Deduction;

		const result = await createDeductionCase.execute(deductionData);

		if (!result.data)
			return NextResponse.json(
				{ success: false, message: result.message },
				{ status: 400 },
			);

		return NextResponse.json(
			{ success: true, data: result.data, message: result.message },
			{ status: 201 },
		);
	} catch (err: unknown) {
		console.error("create deduction error", err);
		const message = err instanceof Error ? err.message : "Internal error";
		return NextResponse.json({ success: false, message }, { status: 400 });
	}
}
