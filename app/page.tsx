import { AIStatusPanel } from "@/components/AIStatusPanel";
import { AgencyPresentationMode } from "@/components/AgencyPresentationMode";
import { AuthGate } from "@/components/AuthGate";
import { FeatureShowcase } from "@/components/FeatureShowcase";
import { CooperationPage } from "@/components/CooperationPage";
import { DeliveryGuide } from "@/components/DeliveryGuide";
import { HeroSection } from "@/components/HeroSection";
import { InputForm } from "@/components/InputForm";
import { SchoolDemoSection } from "@/components/SchoolDemoSection";
import { SchoolTrialMode } from "@/components/SchoolTrialMode";
import { StartupHealthCheck } from "@/components/StartupHealthCheck";
import { WebFirstSection } from "@/components/WebFirstSection";
import { WorkbenchHeader } from "@/components/WorkbenchHeader";

export default function Home() {
  return (
    <AuthGate>
      <main className="min-h-screen">
        <WorkbenchHeader />
        <HeroSection />
        <WebFirstSection />
        <section className="mx-auto max-w-6xl px-4 pt-8 md:px-8">
          <StartupHealthCheck />
          <div className="mt-4">
            <AIStatusPanel />
          </div>
        </section>
        <AgencyPresentationMode />
        <SchoolTrialMode />
        <FeatureShowcase />
        <section id="classroom-workbench" className="mx-auto flex max-w-6xl scroll-mt-8 flex-col gap-6 px-4 py-8 md:px-8">
          <InputForm />
        </section>
        <SchoolDemoSection />
        <CooperationPage />
        <DeliveryGuide />
      </main>
    </AuthGate>
  );
}
