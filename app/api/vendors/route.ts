import { createVendorCase, listVendorsCase } from "@/dependency-registry";
import { Vendor } from "@/domain/entities/vendor.schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
	try {
		const result = await listVendorsCase.execute();

		return NextResponse.json(
			{
				success: true,
				// return the actual array of vendors at the top-level `data`
				data: result.data,
				message: result.message,
			},
			{ status: 200 },
		);
	} catch (err: unknown) {
		console.error("list vendors error", err);
		const message = err instanceof Error ? err.message : "Internal error";
		return NextResponse.json({ success: false, message }, { status: 400 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const vendorData = body as Vendor;

		const result = await createVendorCase.execute(vendorData);

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
		console.error("create vendor error", err);
		const message = err instanceof Error ? err.message : "Internal error";
		return NextResponse.json({ success: false, message }, { status: 400 });
	}
}
