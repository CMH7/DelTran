import { Vendor } from "@/domain/entities/vendor.schema";
import { NextResponse } from "next/server";

export async function GET() {
  const data: Vendor[] = [
    {
      name: "Vicky",
      phone: "123-456-7890",
      address: "123 Main St",
      note: "",
    },
    {
      name: "John",
      phone: "987-654-3210",
      address: "456 Elm St",
      note: "",
    },
    {
      name: "Jane",
      phone: "555-555-5555",
      address: "789 Oak St",
      note: "",
    },
  ];

  return NextResponse.json(data);
}
