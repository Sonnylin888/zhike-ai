import { School, UserRoundCheck, Wrench } from "lucide-react";
import { stakeholderValues } from "@/lib/cooperation";

const roleIcons = [School, UserRoundCheck, Wrench];

export function StakeholderValueCards() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {stakeholderValues.map((item, index) => {
        const Icon = roleIcons[index] || UserRoundCheck;
        return (
          <article
            key={item.role}
            className="rounded-lg border border-cyan-900/10 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-950 text-cyan-200">
                <Icon className="h-5 w-5" />
              </div>
              <span className="rounded bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">
                {item.role}
              </span>
            </div>
            <h3 className="mt-4 text-xl font-semibold leading-tight text-slate-950">
              {item.value}
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-6">
              <p className="rounded-md bg-slate-50 px-3 py-2 text-slate-600">
                痛点：{item.painPoint}
              </p>
              <p className="rounded-md bg-cyan-50 px-3 py-2 font-medium text-cyan-900">
                方案：{item.zhikeSolution}
              </p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
