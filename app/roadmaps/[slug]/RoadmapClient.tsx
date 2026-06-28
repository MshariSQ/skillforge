"use client";

import { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  Node, Edge, Background, Controls, MiniMap,
  useNodesState, useEdgesState, BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { X, PlayCircle, BookOpen, Award, FileText, ExternalLink, CheckCircle } from "lucide-react";
import type { RoadmapNodeInfo } from "@/data/roadmap-nodes/cyber-security";
import { getToken, getCurrentUser } from "@/lib/auth";
import { getProgress, markNodeDone, markNodeUndone } from "@/lib/api";

const TAG_COLORS: Record<string, string> = {
  Free: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20",
  Paid: "bg-amber-500/20 text-amber-400 border border-amber-500/20",
  Official: "bg-blue-500/20 text-blue-400 border border-blue-500/20",
  Recommended: "bg-purple-500/20 text-purple-400 border border-purple-500/20",
  "Free Audit": "bg-teal-500/20 text-teal-400 border border-teal-500/20",
  "Industry Standard": "bg-rose-500/20 text-rose-400 border border-rose-500/20",
};

const STATUS_COLORS: Record<string, { border: string; bg: string; label: string }> = {
  required:  { border: "#10b981", bg: "#10b98120", label: "Required" },
  important: { border: "#3b82f6", bg: "#3b82f620", label: "Important" },
  optional:  { border: "#8b5cf6", bg: "#8b5cf620", label: "Optional" },
};

function Tag({ label }: { label: string }) {
  const cls = TAG_COLORS[label] ?? "bg-white/10 text-gray-300 border border-white/10";
  return <span className={`text-xs px-2 py-0.5 rounded-full ${cls}`}>{label}</span>;
}

function ResourceRow({ icon, title, resource }: {
  icon: React.ReactNode; title: string;
  resource: { title: string; url: string; provider?: string; tags: string[]; duration?: string } | undefined;
}) {
  if (!resource) return null;
  return (
    <div className="bg-[#0D1117] rounded-xl p-4 border border-[#21262d]">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
        {icon}<span className="uppercase tracking-wider">{title}</span>
      </div>
      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-start justify-between gap-2 group">
        <div>
          <div className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">{resource.title}</div>
          {resource.provider && <div className="text-xs text-gray-500 mt-0.5">{resource.provider}</div>}
          <div className="flex flex-wrap gap-1 mt-2">
            {resource.tags.map((t) => <Tag key={t} label={t} />)}
            {resource.duration && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">⏱ {resource.duration}</span>
            )}
          </div>
        </div>
        <ExternalLink size={14} className="text-gray-600 group-hover:text-emerald-400 mt-1 shrink-0 transition-colors" />
      </a>
    </div>
  );
}

function NodePanel({
  node, roadmapId, completed, onToggle, onClose,
}: {
  node: RoadmapNodeInfo; roadmapId: string; completed: boolean;
  onToggle: () => void; onClose: () => void;
}) {
  const s = STATUS_COLORS[node.status];
  const user = getCurrentUser();
  const [busy, setBusy] = useState(false);

  async function handleToggle() {
    const token = getToken();
    if (!token) { window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH ?? "/skillforge"}/`; return; }
    setBusy(true);
    try {
      if (completed) {
        await markNodeUndone(roadmapId, node.id, token);
      } else {
        await markNodeDone(roadmapId, node.id, token);
      }
      onToggle();
    } finally { setBusy(false); }
  }

  return (
    <div className="absolute right-0 top-0 bottom-0 w-96 bg-[#161B22] border-l border-[#21262d] z-10 overflow-y-auto">
      <div className="sticky top-0 bg-[#161B22] border-b border-[#21262d] px-5 py-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 rounded-full border"
              style={{ color: s.border, backgroundColor: s.bg, borderColor: s.border }}>
              {s.label}
            </span>
          </div>
          <h3 className="font-bold text-white text-lg">{node.label}</h3>
        </div>
        <button onClick={onClose} className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
          <X size={18} />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-4">
        <p className="text-sm text-gray-400 leading-relaxed">{node.description}</p>

        {user ? (
          <button
            onClick={handleToggle}
            disabled={busy}
            className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
              completed
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
                : "bg-emerald-500 hover:bg-emerald-400 text-black"
            } ${busy ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <CheckCircle size={15} />
            {busy ? "Saving…" : completed ? "Completed ✓ (click to undo)" : "Mark as Complete"}
          </button>
        ) : (
          <div className="text-xs text-center text-gray-500 py-2 bg-[#0D1117] rounded-xl border border-[#21262d]">
            <a href={`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787"}/api/auth/github`}
              className="text-emerald-400 hover:underline">Sign in</a> to track your progress
          </div>
        )}

        <ResourceRow icon={<PlayCircle size={13} />} title="YouTube" resource={node.resources.youtube} />
        <ResourceRow icon={<BookOpen size={13} />} title="Course" resource={node.resources.course} />
        <ResourceRow icon={<Award size={13} />} title="Certification" resource={node.resources.certification} />
        <ResourceRow icon={<FileText size={13} />} title="Book" resource={node.resources.book} />
        <ResourceRow icon={<ExternalLink size={13} />} title="Official Docs" resource={node.resources.docs} />
      </div>
    </div>
  );
}

function NodeCard({ node, completed }: { node: RoadmapNodeInfo; completed: boolean }) {
  const s = STATUS_COLORS[node.status];
  return (
    <div className={`bg-[#161B22] border rounded-2xl p-5 transition-colors ${
      completed ? "border-emerald-500/40" : "border-[#21262d] hover:border-[#30363d]"
    }`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs px-2 py-0.5 rounded-full border font-medium"
          style={{ color: s.border, borderColor: s.border, backgroundColor: s.bg }}>
          {s.label}
        </span>
        {completed && <CheckCircle size={14} className="text-emerald-400" />}
      </div>
      <h3 className="font-bold text-white text-sm mb-2">{node.label}</h3>
      <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3">{node.description}</p>
      <div className="flex flex-col gap-0.5 border-t border-[#21262d] pt-3">
        {node.resources.youtube && (
          <a href={node.resources.youtube.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-emerald-400 hover:bg-white/5 rounded-lg px-2 py-1.5 transition-all -mx-2">
            <PlayCircle size={13} className="text-red-400 shrink-0" />
            <span className="truncate">{node.resources.youtube.title}</span>
          </a>
        )}
        {node.resources.course && (
          <a href={node.resources.course.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-emerald-400 hover:bg-white/5 rounded-lg px-2 py-1.5 transition-all -mx-2">
            <BookOpen size={13} className="text-blue-400 shrink-0" />
            <span className="truncate">{node.resources.course.title}</span>
          </a>
        )}
        {node.resources.certification && (
          <a href={node.resources.certification.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-emerald-400 hover:bg-white/5 rounded-lg px-2 py-1.5 transition-all -mx-2">
            <Award size={13} className="text-amber-400 shrink-0" />
            <span className="truncate">{node.resources.certification.title}</span>
          </a>
        )}
        {node.resources.book && (
          <a href={node.resources.book.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-emerald-400 hover:bg-white/5 rounded-lg px-2 py-1.5 transition-all -mx-2">
            <FileText size={13} className="text-purple-400 shrink-0" />
            <span className="truncate">{node.resources.book.title}</span>
          </a>
        )}
        {node.resources.docs && (
          <a href={node.resources.docs.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-emerald-400 hover:bg-white/5 rounded-lg px-2 py-1.5 transition-all -mx-2">
            <ExternalLink size={13} className="text-gray-400 shrink-0" />
            <span className="truncate">{node.resources.docs.title}</span>
          </a>
        )}
      </div>
    </div>
  );
}

export default function RoadmapClient({
  initialNodes, initialEdges, nodeData, roadmapId,
}: {
  initialNodes: Node[]; initialEdges: Edge[];
  nodeData: RoadmapNodeInfo[]; roadmapId: string;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [selected, setSelected] = useState<RoadmapNodeInfo | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    getProgress(roadmapId, token)
      .then(({ completed: ids }) => {
        setCompleted(new Set(ids));
        applyCompletedStyles(new Set(ids));
      })
      .catch(() => {});
  }, [roadmapId]);

  function applyCompletedStyles(done: Set<string>) {
    setNodes((nds) =>
      nds.map((n) =>
        done.has(n.id)
          ? { ...n, style: { ...n.style, border: "2px solid #10b981", boxShadow: "0 0 16px #10b98140" } }
          : n
      )
    );
  }

  function handleToggle(nodeId: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId); else next.add(nodeId);
      applyCompletedStyles(next);
      return next;
    });
  }

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const info = nodeData.find((n) => n.id === node.id);
      setSelected(info ?? null);
    },
    [nodeData]
  );

  return (
    <div className="flex flex-col">
      {/* Interactive roadmap canvas */}
      <div className="relative h-[55vh] min-h-[400px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} color="#21262d" gap={24} size={1} />
          <Controls className="!bg-[#161B22] !border-[#21262d] !shadow-none" />
          <MiniMap
            nodeColor={(n) => {
              if (completed.has(n.id)) return "#10b981";
              const info = nodeData.find((d) => d.id === n.id);
              return STATUS_COLORS[info?.status ?? "optional"].border;
            }}
            className="!bg-[#161B22] !border-[#21262d]"
          />
        </ReactFlow>

        {selected && (
          <NodePanel
            node={selected}
            roadmapId={roadmapId}
            completed={completed.has(selected.id)}
            onToggle={() => handleToggle(selected.id)}
            onClose={() => setSelected(null)}
          />
        )}
      </div>

      {/* Resources list below the canvas */}
      <div className="border-t border-[#21262d] bg-[#0D1117] px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen size={16} className="text-emerald-400" />
            <h2 className="text-base font-semibold text-white">Learning Resources</h2>
            <span className="text-xs text-gray-600">— click a node above for details, or use the links below</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {nodeData.map((node) => (
              <NodeCard key={node.id} node={node} completed={completed.has(node.id)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
