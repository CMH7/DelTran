import { NextRequest, NextResponse } from "next/server";
import type { Customer } from "@/domain/entities/customer.schema";
import {
  getCustomerCase,
  updateCustomerCase,
  deleteCustomerCase,
} from "@/dependency-registry";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await getCustomerCase.execute(id);
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
  const customerData = body as Partial<Customer>;
  const result = await updateCustomerCase.execute(id, customerData);
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
  const result = await deleteCustomerCase.execute(id);
  return NextResponse.json(
    { success: result.success, message: result.message },
    { status: result.success ? 200 : 400 },
  );
}
