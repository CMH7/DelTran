import { NextRequest, NextResponse } from "next/server";
import type { Deltran } from "@/domain/entities/deltran.schema";
import {
  getTransactionCase,
  updateTransactionCase,
  deleteTransactionCase,
} from "@/dependency-registry";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await getTransactionCase.execute(id);
  return NextResponse.json(
    { success: !!result.data, data: result.data, message: result.message },
    { status: result.data ? 200 : 404 },
  );
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const transactionData: Partial<Deltran> = {
    ...body,
    tranDate: body.tranDate ? new Date(body.tranDate) : undefined,
  };
  const result = await updateTransactionCase.execute(id, transactionData);
  return NextResponse.json(
    { success: !!result.data, data: result.data, message: result.message },
    { status: result.data ? 200 : 400 },
  );
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await deleteTransactionCase.execute(id);
  return NextResponse.json(
    { success: result.success, message: result.message },
    { status: result.success ? 200 : 400 },
  );
}
