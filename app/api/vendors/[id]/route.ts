import {
	getVendorCase,
	updateVendorCase,
	deleteVendorCase,
} from "@/dependency-registry";
import { Vendor } from "@/domain/entities/vendor.schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const result = await getVendorCase.execute(id);

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
		console.error("get vendor error", err);
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
		const vendorData = body as Partial<Vendor>;

		const result = await updateVendorCase.execute(id, vendorData);

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
		console.error("update vendor error", err);
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
		const result = await deleteVendorCase.execute(id);

		return NextResponse.json(
			{ success: result.success, message: result.message },
			{ status: 200 },
		);
	} catch (err: unknown) {
		console.error("delete vendor error", err);
		const message = err instanceof Error ? err.message : "Internal error";
		return NextResponse.json({ success: false, message }, { status: 400 });
	}
}
