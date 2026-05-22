import { FeatureShowcase } from "@/components/FeatureShowcase";
import { CooperationPage } from "@/components/CooperationPage";
import { HeroSection } from "@/components/HeroSection";
import { InputForm } from "@/components/InputForm";
import { SchoolDemoSection } from "@/components/SchoolDemoSection";
import { SchoolTrialMode } from "@/components/SchoolTrialMode";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <SchoolTrialMode />
      <FeatureShowcase />
      <section id="classroom-workbench" className="mx-auto flex max-w-6xl scroll-mt-8 flex-col gap-6 px-4 py-8 md:px-8">
        <InputForm />
      </section>
      <SchoolDemoSection />
      <CooperationPage />
    </main>
  );
}
