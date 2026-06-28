"use client";

import dynamic from "next/dynamic";
import type { Node, Edge } from "reactflow";
import type { RoadmapNodeInfo } from "@/data/roadmap-nodes/cyber-security";

const RoadmapClient = dynamic(() => import("./RoadmapClient"), { ssr: false });

export default function RoadmapWrapper({
  initialNodes,
  initialEdges,
  nodeData,
}: {
  initialNodes: Node[];
  initialEdges: Edge[];
  nodeData: RoadmapNodeInfo[];
}) {
  return (
    <RoadmapClient
      initialNodes={initialNodes}
      initialEdges={initialEdges}
      nodeData={nodeData}
    />
  );
}
