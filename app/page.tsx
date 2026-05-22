import { FeatureShowcase } from "@/components/FeatureShowcase";
import { HeroSection } from "@/components/HeroSection";
import { InputForm } from "@/components/InputForm";
import { SchoolDemoSection } from "@/components/SchoolDemoSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeatureShowcase />
      <section id="classroom-workbench" className="mx-auto flex max-w-6xl scroll-mt-8 flex-col gap-6 px-4 py-8 md:px-8">
        <InputForm />
      </section>
      <SchoolDemoSection />
    </main>
  );
}
