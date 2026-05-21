import { InputForm } from "@/components/InputForm";

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <section className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex items-center justify-between gap-4 rounded-lg border border-white/60 bg-white/76 px-4 py-3 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-950 text-sm font-semibold text-cyan-200">
              AI
            </div>
            <div>
              <p className="text-base font-semibold text-slate-950">
                AI Teaching Demo
              </p>
              <p className="text-xs text-slate-500">课堂演示型 AI 教学助手 MVP</p>
            </div>
          </div>
          <div className="hidden rounded-md bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700 sm:block">
            Slide-ready
          </div>
        </header>

        <div className="flex flex-col gap-3">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-semibold tracking-normal text-slate-950 md:text-5xl">
              30 秒生成一套可直接试讲的 AI 课件
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">
              老师只需输入学段、学科、课题和教材版本，系统结合本地教材样本生成页面化 PPT、教案结构、课堂互动与课后练习。
            </p>
          </div>
        </div>

        <InputForm />
      </section>
    </main>
  );
}
