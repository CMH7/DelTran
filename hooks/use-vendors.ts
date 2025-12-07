"use client";

import { Vendor } from "@/domain/entities/vendor.schema";
import { useEffect, useState } from "react";

export default function useVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch("/api/vendors");
      const data = await response.json();
      setVendors(data);
    };

    fetchItems();
  }, []);

  return { vendors };
}
