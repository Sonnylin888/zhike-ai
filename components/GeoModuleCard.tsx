import { Map } from "lucide-react";
import type { ReactNode } from "react";
import type { GeoModule } from "@/lib/prompt";

export function GeoModuleCard({ module }: { module: GeoModule }) {
  return (
    <SubjectShell icon={<Map className="h-4 w-4" />} title="地理课堂工具">
      <Item label="地图关注" value={module.mapFocus} />
      <Item label="案例分析" value={module.caseStudy} />
      <Item label="现实联系" value={module.realWorldConnection} />
    </SubjectShell>
  );
}

function SubjectShell({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return <div className="rounded-lg border border-cyan-900/10 bg-white p-4"><div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950">{icon}{title}</div><div className="space-y-2">{children}</div></div>;
}

function Item({ label, value }: { label: string; value: string }) {
  return <p className="rounded-md bg-cyan-50 px-3 py-2 text-sm leading-6 text-cyan-950"><span className="font-semibold">{label}：</span>{value}</p>;
}
