"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import useItems from "@/hooks/use-items";
import { BoxIcon, PlusIcon } from "lucide-react";

export default function ItemsPage() {
  const { items } = useItems();

  return (
    <div className="max-w-screen py-3 px-6 grid grid-cols-1 gap-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          <BoxIcon />
          <p className="font-bold text-lg">Items</p>
        </div>
        <Button>
          <PlusIcon />
          Add
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <div>
          <Input placeholder="Search items..." />
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 gap-3">
            {items.map((item, i) => (
              <Card key={`item-${i}`}>
                <CardHeader>
                  <CardTitle>
                    <div className="flex justify-between items-start">
                      {item.name}

                      <Badge variant="secondary">₱ {item.price}</Badge>
                    </div>
                  </CardTitle>
                  <CardDescription>{item.vendor.name}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
