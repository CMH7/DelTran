import { NextRequest, NextResponse } from "next/server";
import type { Customer } from "@/domain/entities/customer.schema";
import {
  createCustomerCase,
  listCustomersCase,
} from "@/dependency-registry";

export async function GET() {
  const result = await listCustomersCase.execute();
  return NextResponse.json(
    { success: true, data: result.data, message: result.message },
    { status: 200 },
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const customerData = body as Customer;
  const result = await createCustomerCase.execute(customerData);
  return NextResponse.json(
    { success: !!result.data, data: result.data, message: result.message },
    { status: result.data ? 201 : 400 },
  );
}
