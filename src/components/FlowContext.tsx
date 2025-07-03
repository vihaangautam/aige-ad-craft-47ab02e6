import React, { createContext, useContext, useState } from "react";
// Fallback types if reactflow is not installed
type Node = any;
type Edge = any;
// Try to import from reactflow if available
// import type { Node, Edge } from "reactflow";

interface FlowContextType {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  isStaticTemplate: boolean;
  setIsStaticTemplate: React.Dispatch<React.SetStateAction<boolean>>;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export const FlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isStaticTemplate, setIsStaticTemplate] = useState(false);

  return (
    <FlowContext.Provider value={{ nodes, setNodes, edges, setEdges, isStaticTemplate, setIsStaticTemplate }}>
      {children}
    </FlowContext.Provider>
  );
};

export function useFlow() {
  const ctx = useContext(FlowContext);
  if (!ctx) throw new Error("useFlow must be used within a FlowProvider");
  return ctx;
} 