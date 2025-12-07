import { Item } from "@/domain/entities/item.schema";
import { NextResponse } from "next/server";

export async function GET() {
  const data: Item[] = [
    {
      name: "Neltex 100 CC",
      description: "A high-quality item",
      price: 100,
      category: {
        name: "Chemicals",
        description: "Chemicals",
      },
      vendor: {
        name: "Vicky",
        phone: "123-456-7890",
        address: "123 Main St",
        note: "",
      },
    },
    {
      name: "Neltex 200 CC",
      description: "A high-quality item",
      price: 100,
      category: {
        name: "Chemicals",
        description: "Chemicals",
      },
      vendor: {
        name: "Vicky",
        phone: "123-456-7890",
        address: "123 Main St",
        note: "",
      },
    },
    {
      name: "Neltex 400 CC",
      description: "A high-quality item",
      price: 100,
      category: {
        name: "Chemicals",
        description: "Chemicals",
      },
      vendor: {
        name: "Vicky",
        phone: "123-456-7890",
        address: "123 Main St",
        note: "",
      },
    },
  ];

  return NextResponse.json(data);
}
