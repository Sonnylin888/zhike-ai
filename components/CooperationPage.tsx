import { ArrowRight, Building2, Lightbulb, MapPinned } from "lucide-react";
import { CooperationCTA } from "@/components/CooperationCTA";
import { DemoPackageSection } from "@/components/DemoPackageSection";
import { PilotPlanSection } from "@/components/PilotPlanSection";
import { StakeholderValueCards } from "@/components/StakeholderValueCards";
import { TrustNotes } from "@/components/TrustNotes";
import { ValueMetrics } from "@/components/ValueMetrics";
import { cooperationScenarios } from "@/lib/cooperation";

export function CooperationPage() {
  return (
    <section
      id="cooperation"
      className="mx-auto flex max-w-6xl scroll-mt-8 flex-col gap-5 px-4 py-12 md:px-8"
    >
      <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-950 text-white shadow-[0_24px_70px_rgba(15,23,42,0.24)]">
        <div className="grid gap-8 p-6 md:grid-cols-[1.05fr_0.95fr] md:p-8">
          <div>
            <p className="inline-flex items-center gap-2 rounded-md bg-cyan-300/12 px-3 py-1.5 text-sm font-semibold text-cyan-100">
              <Building2 className="h-4 w-4" />
              Cooperation Page
            </p>
            <h2 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl">
              AI 未来课堂合作方案
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              zhike-ai 面向学校试讲、教研展示和未来课堂方案沟通，聚焦教师主导的 AI 课堂工作流，帮助学校把 AI 教育落到具体课堂场景里。
            </p>
          </div>
          <div className="grid content-start gap-3">
            <div className="rounded-lg border border-white/10 bg-white/8 p-4">
              <div className="flex items-center gap-2 text-cyan-100">
                <Lightbulb className="h-4 w-4" />
                <span className="text-sm font-semibold">合作价值</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                用可演示、可试讲、可反馈的课堂包说明 AI 如何减轻教师重复工作，而不是替代教师。
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/8 p-4">
              <div className="flex items-center gap-2 text-cyan-100">
                <MapPinned className="h-4 w-4" />
                <span className="text-sm font-semibold">适用场景</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {cooperationScenarios.map((scenario) => (
                  <span key={scenario} className="rounded bg-white/10 px-2 py-1 text-xs text-cyan-50/86">
                    {scenario}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-white/10 px-6 py-4 text-sm font-semibold text-cyan-100 md:px-8">
          School Pilot
          <ArrowRight className="h-4 w-4" />
          Teacher Workflow
          <ArrowRight className="h-4 w-4" />
          Future Classroom
        </div>
      </div>

      <StakeholderValueCards />
      <PilotPlanSection />
      <ValueMetrics />
      <DemoPackageSection />
      <TrustNotes />
      <CooperationCTA />
    </section>
  );
}
