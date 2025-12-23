import { NextRequest, NextResponse } from "next/server";
import type { Deltran } from "@/domain/entities/deltran.schema";
import {
  createTransactionCase,
  listTransactionsCase,
} from "@/dependency-registry";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  // Parse filter parameters
  const filters: {
    startDate?: Date;
    endDate?: Date;
    status?: string;
  } = {};

  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");
  const statusParam = searchParams.get("status");

  if (startDateParam) {
    filters.startDate = new Date(startDateParam);
  }
  if (endDateParam) {
    filters.endDate = new Date(endDateParam);
  }
  if (statusParam) {
    filters.status = statusParam;
  }

  const result = await listTransactionsCase.execute(filters);
  return NextResponse.json(
    { success: true, data: result.data, message: result.message },
    { status: 200 },
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const transactionData: Deltran = {
    ...body,
    tranDate: new Date(body.tranDate),
  };
  const result = await createTransactionCase.execute(transactionData);
  return NextResponse.json(
    { success: !!result.data, data: result.data, message: result.message },
    { status: result.data ? 201 : 400 },
  );
}
