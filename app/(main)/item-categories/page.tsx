import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ItemCategoriesPage() {
  return (
    <div className="p-3">
      <Card className="min-w-fit">
        <CardHeader>
          <CardTitle>Item Categories</CardTitle>
          <CardDescription>Manage your item categories here.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
