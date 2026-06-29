"use client";

import { Shield } from "lucide-react";
import { useLang } from "@/lib/lang-context";

export default function PrivacyPage() {
  const { tx } = useLang();
  const p = tx.privacyPage;

  return (
    <main className="max-w-3xl mx-auto px-6 pt-28 pb-24">
      <div className="mb-12">
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-3">
          <Shield size={16} /><span>{p.eyebrow}</span>
        </div>
        <h1 className="text-4xl font-black mb-3">{p.title}</h1>
        <p className="text-gray-500 text-sm">{p.lastUpdated}</p>
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 mb-8">
        <p className="text-sm text-emerald-300 leading-relaxed">
          <strong>{p.shortVersionTitle}</strong> {p.shortVersionText}
        </p>
      </div>

      <div className="space-y-6">
        {p.sections.map((s, i) => (
          <div key={s.title} id={i === 4 ? "cookies" : undefined} className="bg-[#161B22] border border-[#21262d] rounded-2xl p-6">
            <h2 className="font-bold text-white mb-3">{s.title}</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-[#161B22] border border-[#21262d] rounded-2xl p-6 text-center">
        <p className="text-gray-500 text-sm">
          {p.contactNote}{" "}
          <a href="https://github.com/MshariSQ/skillforge/issues" target="_blank" rel="noopener noreferrer"
            className="text-emerald-400 hover:underline">{p.contactLink}</a>.
        </p>
      </div>
    </main>
  );
}
