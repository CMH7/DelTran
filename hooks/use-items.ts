"use client";

import { Item } from "@/domain/entities/item.schema";
import { useEffect, useState } from "react";

export default function useItems() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch("/api/items");
      const data = await response.json();
      setItems(data);
    };

    fetchItems();
  }, []);

  return { items };
}
