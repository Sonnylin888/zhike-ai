import { ShieldCheck } from "lucide-react";
import { trustNotes } from "@/lib/cooperation";

export function TrustNotes() {
  return (
    <section className="rounded-lg border border-cyan-900/10 bg-cyan-50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-cyan-700" />
        <h2 className="text-xl font-semibold text-slate-950">产品可信边界</h2>
      </div>
      <div className="grid gap-2 md:grid-cols-5">
        {trustNotes.map((note) => (
          <p key={note} className="rounded-md bg-white px-3 py-3 text-sm leading-6 text-slate-700">
            {note}
          </p>
        ))}
      </div>
    </section>
  );
}
