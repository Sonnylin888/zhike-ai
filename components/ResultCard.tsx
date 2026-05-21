import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ResultCardProps = {
  title: string;
  items: string[];
};

export function ResultCard({ title, items }: ResultCardProps) {
  return (
    <Card className="h-full border-teal-900/10 bg-white/88 backdrop-blur">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3 text-sm leading-6 text-slate-700">
          {items.map((item, index) => (
            <li key={`${title}-${index}`} className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-teal-700">
                {index + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
