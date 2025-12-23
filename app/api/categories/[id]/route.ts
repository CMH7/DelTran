import {
	getCategoryCase,
	updateCategoryCase,
	deleteCategoryCase,
} from "@/dependency-registry";
import { Category } from "@/domain/entities/category.schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const result = await getCategoryCase.execute(id);

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
		console.error("get category error", err);
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
		const categoryData = body as Partial<Category>;

		const result = await updateCategoryCase.execute(id, categoryData);

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
		console.error("update category error", err);
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
		const result = await deleteCategoryCase.execute(id);

		return NextResponse.json(
			{ success: result.success, message: result.message },
			{ status: 200 },
		);
	} catch (err: unknown) {
		console.error("delete category error", err);
		const message = err instanceof Error ? err.message : "Internal error";
		return NextResponse.json({ success: false, message }, { status: 400 });
	}
}
