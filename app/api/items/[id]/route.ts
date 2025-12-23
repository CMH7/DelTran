import {
  getItemCase,
  updateItemCase,
  deleteItemCase,
} from "@/dependency-registry";
import { Item } from "@/domain/entities/item.schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = await getItemCase.execute(id);

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
    console.error("get item error", err);
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
    const itemData = body as Partial<Item>;

    const result = await updateItemCase.execute(id, itemData);

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
    console.error("update item error", err);
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
    const result = await deleteItemCase.execute(id);

    return NextResponse.json(
      { success: result.success, message: result.message },
      { status: 200 },
    );
  } catch (err: unknown) {
    console.error("delete item error", err);
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
