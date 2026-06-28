import { Zap, TrendingUp, Users, Award, Globe, BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About — SkillForge",
  description: "Free, open-source learning platform for roadmaps, certifications, and career guidance.",
};

export default function AboutPage() {
  const pillars = [
    { icon: <TrendingUp size={20} />, title: "Interactive Roadmaps", desc: "Visual, step-by-step learning paths you can actually follow — built by the community for the community." },
    { icon: <Award size={20} />, title: "Real Certifications", desc: "Curated certifications with real prices, difficulty ratings, and direct links to official exam pages." },
    { icon: <BookOpen size={20} />, title: "Curated Courses", desc: "Hand-picked free and paid courses from Google, Harvard, IBM, and the best educators online." },
    { icon: <Globe size={20} />, title: "Completely Free", desc: "No paywalls, no premium tiers, no ads. SkillForge is and always will be 100% free and open source." },
  ];

  return (
    <main className="max-w-4xl mx-auto px-6 pt-28 pb-24">
      {/* Hero */}
      <div className="text-center mb-20">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
          <Zap size={28} className="text-emerald-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-6">
          About <span className="gradient-text">SkillForge</span>
        </h1>
        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
          SkillForge is a free, open-source learning platform that puts everything you need to build a tech career in one place — no subscriptions, no paywalls, no noise.
        </p>
      </div>

      {/* Story */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-6">The Problem We Solve</h2>
        <div className="bg-[#161B22] border border-[#21262d] rounded-2xl p-8">
          <p className="text-gray-400 leading-relaxed mb-4">
            When you want to learn something new in tech, you face the same frustrating problem: information is scattered across dozens of websites, YouTube channels, subreddits, and Discord servers. There's no single place that says "here's exactly what you need to learn, in what order, and here are the best resources to do it."
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            SkillForge fixes that. We've built interactive roadmaps that show you the exact learning path for each field, curated the best certifications with real pricing info, and hand-picked courses from the world's best educators — all completely free to access.
          </p>
          <p className="text-gray-400 leading-relaxed">
            No paywalls. No sponsored content disguised as recommendations. Just clean, accurate, community-maintained learning paths.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-8">What We Offer</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {pillars.map((p) => (
            <div key={p.title} className="bg-[#161B22] border border-[#21262d] rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                {p.icon}
              </div>
              <h3 className="font-bold text-white mb-2">{p.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Open source */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-6">Open Source</h2>
        <div className="bg-[#161B22] border border-[#21262d] rounded-2xl p-8">
          <p className="text-gray-400 leading-relaxed mb-6">
            SkillForge is fully open source under the MIT License. The entire codebase — frontend, backend, and data — is available on GitHub. We welcome contributions of all kinds: new roadmaps, resource updates, bug fixes, and feature ideas.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/MshariSQ/skillforge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#21262d] hover:bg-[#30363d] text-white text-sm font-medium rounded-xl transition-all border border-[#30363d]"
            >
              <ExternalLink size={16} /> View on GitHub
            </a>
            <a
              href="https://github.com/MshariSQ/skillforge/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 text-sm font-medium rounded-xl transition-all"
            >
              Report an Issue
            </a>
          </div>
        </div>
      </section>

      {/* Community */}
      <section>
        <div className="text-center bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-10">
          <Users size={32} className="text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Join the Community</h2>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            Sign in with GitHub to track your progress, bookmark certifications, and be part of the growing SkillForge community.
          </p>
          <Link
            href="/roadmaps"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all text-sm"
          >
            Explore Roadmaps →
          </Link>
        </div>
      </section>
    </main>
  );
}
