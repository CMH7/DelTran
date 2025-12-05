import Container from "@/components/custom/container";
import { Card, CardHeader } from "@/components/ui/card";

export default function DeductionsPage() {
  return (
    <Container>
      <Card>
        <CardHeader>
          <h1 className="text-4xl font-bold">Deductions</h1>
          <p className="mt-4">Manage your deductions here.</p>
        </CardHeader>
      </Card>
    </Container>
  );
}
