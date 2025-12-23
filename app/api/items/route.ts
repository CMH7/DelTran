import { createItemCase, listItemsCase } from "@/dependency-registry";
import { Item } from "@/domain/entities/item.schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await listItemsCase.execute();

    return NextResponse.json(
      {
        success: true,
        data: result.data,
        message: result.message,
      },
      { status: 200 },
    );
  } catch (err: unknown) {
    console.error("list items error", err);
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const itemData = body as Item;

    const result = await createItemCase.execute(itemData);

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
    console.error("create item error", err);
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
