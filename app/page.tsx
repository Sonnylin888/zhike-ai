import { InputForm } from "@/components/InputForm";

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-8 md:px-8 md:py-10">
      <section className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="inline-flex w-fit items-center rounded-md border border-teal-900/10 bg-white/70 px-3 py-1 text-xs font-medium text-teal-800 backdrop-blur">
            AI 教学助手 MVP
          </div>
          <div className="max-w-3xl">
            <h1 className="text-3xl font-semibold tracking-normal text-slate-950 md:text-5xl">
              30 秒生成一份可演示的高中地理教学方案
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">
              老师只需输入学段、学科、课题和教材版本，系统结合本地教材样本生成教案结构、PPT 大纲、课堂互动与课后练习。
            </p>
          </div>
        </div>

        <InputForm />
      </section>
    </main>
  );
}
