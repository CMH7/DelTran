"use client";

import Container from "@/components/custom/container";
import ItemCard from "@/components/custom/item-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useItems } from "@/hooks/item/use-items";
import { useVendors } from "@/hooks/vendor/use-vendors";
import { BoxIcon, PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import PageHeader from "@/components/custom/page-header";
import { useRouter } from "next/navigation";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import Loader from "@/components/custom/loader";

export default function ItemsPage() {
  const router = useRouter();
  const { data: items, isLoading, error } = useItems();
  const { data: vendors } = useVendors();

  const [searchStr, setSearchStr] = useState<string>("");

  const vendorMap = useMemo(() => {
    if (!vendors) return {};
    return vendors.reduce(
      (acc, v) => ({ ...acc, [v.id]: v.name }),
      {} as Record<string, string>,
    );
  }, [vendors]);

  const filteredItems = useMemo(() => {
    const itemList = items ?? [];

    if (!searchStr) {
      return items;
    }

    const s = searchStr.toLowerCase();

    return itemList.filter((item) => {
      const name = item.name?.toLowerCase() ?? "";
      const description = item.description?.toLowerCase() ?? "";
      const vendorName = vendorMap[item.vendorId]?.toLowerCase() ?? "";

      return (
        name.includes(s) ||
        description.includes(s) ||
        vendorName.includes(s)
      );
    });
  }, [searchStr, items, vendorMap]);

  return (
    <Container>
      <PageHeader
        title="Items"
        icon={<BoxIcon />}
        end={
          <Button onClick={() => router.push("/items/create")}>
            <PlusIcon />
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <div>
          <Input
            value={searchStr}
            onChange={(e) => setSearchStr(e.target.value)}
            placeholder="Search items..."
          />
        </div>

        <ScrollArea className="h-[calc(100vh-200px)] lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {isLoading ? (
              <Loader text="Loading items" />
            ) : error ? (
              <div className="p-4 text-red-500">Failed to load items</div>
            ) : filteredItems && filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <ItemCard
                  item={item}
                  vendorName={vendorMap[item.vendorId]}
                  key={item.id}
                />
              ))
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia>
                    <BoxIcon />
                  </EmptyMedia>
                  <EmptyTitle>No items found</EmptyTitle>
                  <EmptyDescription>Try to search again</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
        </ScrollArea>
      </div>
    </Container>
  );
}
