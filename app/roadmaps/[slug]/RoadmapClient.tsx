"use client";

import { useState, useEffect } from "react";
import { PlayCircle, BookOpen, Award, FileText, ExternalLink, CheckCircle, ArrowLeft } from "lucide-react";
import type { RoadmapNodeInfo } from "@/data/roadmap-nodes/cyber-security";
import { roadmaps } from "@/data/roadmaps";
import { getToken, getCurrentUser } from "@/lib/auth";
import { getProgress, markNodeDone, markNodeUndone } from "@/lib/api";
import { useLang } from "@/lib/lang-context";

const STATUS_COLORS: Record<string, { border: string; bg: string }> = {
  required:  { border: "#10b981", bg: "#10b98120" },
  important: { border: "#3b82f6", bg: "#3b82f620" },
  optional:  { border: "#8b5cf6", bg: "#8b5cf620" },
};

const TAG_COLORS: Record<string, string> = {
  Free:               "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20",
  Paid:               "bg-amber-500/20 text-amber-400 border border-amber-500/20",
  Official:           "bg-blue-500/20 text-blue-400 border border-blue-500/20",
  Recommended:        "bg-purple-500/20 text-purple-400 border border-purple-500/20",
  "Free Audit":       "bg-teal-500/20 text-teal-400 border border-teal-500/20",
  "Industry Standard":"bg-rose-500/20 text-rose-400 border border-rose-500/20",
};

function Tag({ label }: { label: string }) {
  const cls = TAG_COLORS[label] ?? "bg-white/10 text-gray-300 border border-white/10";
  return <span className={`text-xs px-2 py-0.5 rounded-full ${cls}`}>{label}</span>;
}

function ResourceCard({
  icon, type, resource,
}: {
  icon: React.ReactNode;
  type: string;
  resource: { title: string; url: string; provider?: string; tags: string[]; duration?: string } | undefined;
}) {
  if (!resource) return null;
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">
        {icon} {type}
      </div>
      <a href={resource.url} target="_blank" rel="noopener noreferrer"
        className="flex items-start gap-3 bg-[#161B22] border border-[#21262d] rounded-xl p-4 hover:border-[#30363d] hover:bg-[#1C2128] transition-all group">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors leading-snug">{resource.title}</div>
          {resource.provider && <div className="text-xs text-gray-500 mt-0.5">{resource.provider}</div>}
          <div className="flex gap-1.5 flex-wrap mt-2">
            {resource.tags.map((t) => <Tag key={t} label={t} />)}
            {resource.duration && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">⏱ {resource.duration}</span>
            )}
          </div>
        </div>
        <ExternalLink size={13} className="text-gray-600 group-hover:text-emerald-400 mt-0.5 shrink-0 transition-colors" />
      </a>
    </div>
  );
}

export default function RoadmapClient({
  nodeData,
  roadmapId,
}: {
  nodeData: RoadmapNodeInfo[];
  roadmapId: string;
}) {
  const [selectedId, setSelectedId] = useState(nodeData[0]?.id ?? "");
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const { tx, lang } = useLang();
  const r = tx.roadmap;

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    getProgress(roadmapId, token)
      .then(({ completed: ids }) => setCompleted(new Set(ids)))
      .catch(() => {});
  }, [roadmapId]);

  const roadmapMeta = roadmaps.find((rm) => rm.id === roadmapId);
  const selected = nodeData.find((n) => n.id === selectedId) ?? nodeData[0];
  const selectedIndex = nodeData.findIndex((n) => n.id === (selected?.id ?? ""));
  const nextNode = nodeData[selectedIndex + 1] ?? null;
  const user = getCurrentUser();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/skillforge";

  const s = STATUS_COLORS[selected?.status ?? "required"];
  const statusLabel = r.statusLabels[selected?.status as keyof typeof r.statusLabels] ?? selected?.status;

  const STATUS_GROUPS = [
    { key: "required",  label: r.groups.required,  color: "#10b981" },
    { key: "important", label: r.groups.important, color: "#3b82f6" },
    { key: "optional",  label: r.groups.optional,  color: "#8b5cf6" },
  ];

  const groups = STATUS_GROUPS
    .map((g) => ({ ...g, nodes: nodeData.filter((n) => n.status === g.key) }))
    .filter((g) => g.nodes.length > 0);

  async function handleToggle() {
    const token = getToken();
    if (!token) { window.location.href = `${basePath}/`; return; }
    setBusy(true);
    try {
      if (completed.has(selected.id)) {
        await markNodeUndone(roadmapId, selected.id, token);
      } else {
        await markNodeDone(roadmapId, selected.id, token);
      }
      setCompleted((prev) => {
        const next = new Set(prev);
        if (next.has(selected.id)) next.delete(selected.id); else next.add(selected.id);
        return next;
      });
    } finally { setBusy(false); }
  }

  return (
    <div className="flex flex-col bg-[#0D1117] h-screen overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-[#21262d] px-6 py-4 pt-20 flex items-center gap-4">
        <a href={`${basePath}/roadmaps/`}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors">
          <ArrowLeft size={15} className={lang === "ar" ? "rotate-180" : ""} /> {r.back}
        </a>
        <div className="w-px h-4 bg-[#21262d]" />
        {roadmapMeta && (
          <>
            <span className="text-xl">{roadmapMeta.icon}</span>
            <h1 className="font-bold text-white">{roadmapMeta.title}</h1>
          </>
        )}
      </div>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 border-e border-[#21262d] flex flex-col bg-[#0D1117] overflow-hidden">
          <div className="px-4 py-4 border-b border-[#21262d] shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">{r.progress}</span>
              <span className="text-xs font-semibold text-emerald-400">{completed.size} / {nodeData.length}</span>
            </div>
            <div className="h-1.5 bg-[#21262d] rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${nodeData.length ? (completed.size / nodeData.length) * 100 : 0}%` }} />
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-3">
            {groups.map((group) => (
              <div key={group.key} className="mb-2">
                <div className="px-4 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: group.color }}>
                  {group.label}
                </div>
                {group.nodes.map((node) => {
                  const done = completed.has(node.id);
                  const active = node.id === selectedId;
                  return (
                    <button key={node.id} onClick={() => setSelectedId(node.id)}
                      className={`w-full flex items-center gap-2.5 px-4 py-2 text-left transition-all border-s-2 ${
                        active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500"
                          : "text-gray-500 border-transparent hover:bg-white/5 hover:text-gray-300"
                      }`}>
                      <div className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center text-[9px] font-bold transition-all ${
                        done ? "bg-emerald-500 border-emerald-500 text-black"
                          : active ? "border-emerald-500" : "border-[#30363d]"
                      }`}>
                        {done && "✓"}
                      </div>
                      <span className={`truncate text-xs ${active ? "font-semibold" : "font-medium"}`}>{node.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-[#0D1117]">
          {selected ? (
            <>
              <div className="px-10 pt-10 pb-8 border-b border-[#21262d]">
                <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-5">
                  <span>{r.breadcrumb}</span>
                  <span>›</span>
                  <span style={{ color: s.border }}>{statusLabel}</span>
                </div>

                <h2 className="text-2xl font-extrabold text-white mb-3 leading-tight">{selected.label}</h2>
                <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">{selected.description}</p>

                <div className="flex items-center gap-3 mt-5">
                  <span className="text-xs px-2.5 py-1 rounded-full border font-semibold"
                    style={{ color: s.border, borderColor: s.border, backgroundColor: s.bg }}>
                    {statusLabel}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-6 flex-wrap">
                  {user ? (
                    <button onClick={handleToggle} disabled={busy}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        completed.has(selected.id)
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
                          : "bg-emerald-500 hover:bg-emerald-400 text-black"
                      } ${busy ? "opacity-50 cursor-not-allowed" : ""}`}>
                      <CheckCircle size={14} />
                      {busy ? r.saving : completed.has(selected.id) ? r.completed : r.markComplete}
                    </button>
                  ) : (
                    <a href={`${basePath}/`}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#161B22] border border-[#21262d] text-gray-400 hover:text-white transition-all">
                      {r.signInToTrack}
                    </a>
                  )}
                  {nextNode && (
                    <button onClick={() => setSelectedId(nextNode.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-[#161B22] border border-[#21262d] text-gray-400 hover:text-white hover:border-[#30363d] transition-all">
                      {r.next}: {nextNode.label} <ArrowLeft size={13} className={lang === "ar" ? "" : "rotate-180"} />
                    </button>
                  )}
                </div>
              </div>

              <div className="px-10 py-8">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen size={14} className="text-emerald-400" />
                  <h3 className="text-sm font-semibold text-white">{r.learningResources}</h3>
                </div>
                <div className="flex flex-col gap-5 max-w-2xl">
                  <ResourceCard icon={<PlayCircle size={11} className="text-red-400" />} type={r.resourceTypes.youtube} resource={selected.resources.youtube} />
                  <ResourceCard icon={<BookOpen size={11} className="text-blue-400" />} type={r.resourceTypes.course} resource={selected.resources.course} />
                  <ResourceCard icon={<Award size={11} className="text-amber-400" />} type={r.resourceTypes.certification} resource={selected.resources.certification} />
                  <ResourceCard icon={<FileText size={11} className="text-purple-400" />} type={r.resourceTypes.book} resource={selected.resources.book} />
                  <ResourceCard icon={<ExternalLink size={11} className="text-gray-400" />} type={r.resourceTypes.docs} resource={selected.resources.docs} />
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
              Select a topic from the sidebar
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
