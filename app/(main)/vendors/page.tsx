"use client";

import Container from "@/components/custom/container";
import { Button } from "@/components/ui/button";
import { PlusIcon, SquareUser } from "lucide-react";
import useVendors from "@/hooks/use-vendors";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import VendorCard from "@/components/custom/vendor-card";

export default function VendorsPage() {
  const { vendors } = useVendors();

  return (
    <Container>
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          <SquareUser />
          <p className="font-bold text-lg">Vendors</p>
        </div>
        <Button>
          <PlusIcon />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <div>
          <Input placeholder="Search vendors.." />
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 gap-3">
            {vendors.map((vendor, i) => (
              <VendorCard vendor={vendor} key={`vendor-${i}`} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </Container>
  );
}
