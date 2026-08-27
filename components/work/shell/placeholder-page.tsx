import { Construction } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/work/ui/card";

export function PlaceholderPage({
  title,
  description,
  phase,
}: {
  title: string;
  description: string;
  phase?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <div className="mb-1 flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Construction className="size-4.5" />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Módulo en construcción{phase ? ` · ${phase}` : ""}. El scaffold, el
            aislamiento visual y la autenticación ya están montados.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
