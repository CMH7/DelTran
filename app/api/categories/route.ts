import {
	createCategoryCase,
	listCategoriesCase,
} from "@/dependency-registry";
import { Category } from "@/domain/entities/category.schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
	try {
		const result = await listCategoriesCase.execute();

		return NextResponse.json(
			{
				success: true,
				data: result.data,
				message: result.message,
			},
			{ status: 200 },
		);
	} catch (err: unknown) {
		console.error("list categories error", err);
		const message = err instanceof Error ? err.message : "Internal error";
		return NextResponse.json({ success: false, message }, { status: 400 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const categoryData = body as Category;

		const result = await createCategoryCase.execute(categoryData);

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
		console.error("create category error", err);
		const message = err instanceof Error ? err.message : "Internal error";
		return NextResponse.json({ success: false, message }, { status: 400 });
	}
}
