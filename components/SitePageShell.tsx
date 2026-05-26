import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function SitePageShell({ eyebrow, title, description, children }: Props) {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 px-4 py-10 text-white md:px-8">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="text-sm font-semibold text-cyan-200">
            返回智课首页
          </Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-semibold md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">{description}</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8 md:px-8">{children}</section>
    </main>
  );
}
