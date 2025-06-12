import { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Save, ArrowLeft, ArrowRight } from 'lucide-react';
import { StoryNode } from './StoryNode';

interface StoryNodeData {
  title: string;
  description: string;
  nodeType: 'Scene' | 'Option Point' | 'Game' | 'AR Filter' | string;
  [key: string]: any;
}

interface StoryFlowBuilderProps {
  onBack: () => void;
  onNext: () => void;
}

const nodeTypes = {
  storyNode: StoryNode,
};

const initialNodes: Node<StoryNodeData>[] = [
  {
    id: '1',
    type: 'storyNode',
    position: { x: 250, y: 50 },
    data: {
      title: 'Opening Scene',
      description: 'User enters the virtual showroom',
      nodeType: 'Scene',
    },
  },
];

const initialEdges: Edge[] = [];

export function StoryFlowBuilder({ onBack, onNext }: StoryFlowBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeIdCounter, setNodeIdCounter] = useState(2);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNewNode = (nodeType: string) => {
    const newNode: Node<StoryNodeData> = {
      id: nodeIdCounter.toString(),
      type: 'storyNode',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        title: `New ${nodeType}`,
        description: `Description for ${nodeType.toLowerCase()}`,
        nodeType,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter(nodeIdCounter + 1);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Story Flow Builder</h1>
          <p className="text-gray-600">Design interactive ad experiences with branching narratives</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold" onClick={onNext}>
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Story Elements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => addNewNode('Scene')} className="bg-blue-500 hover:bg-blue-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Scene
            </Button>
            <Button onClick={() => addNewNode('Option Point')} className="bg-yellow-400 hover:bg-yellow-500 text-black">
              <Plus className="w-4 h-4 mr-2" />
              Choice Point
            </Button>
            <Button onClick={() => addNewNode('Game')} className="bg-green-500 hover:bg-green-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Mini Game
            </Button>
            <Button onClick={() => addNewNode('AR Filter')} className="bg-purple-500 hover:bg-purple-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              AR Filter
            </Button>
            <Button variant="outline" className="ml-auto border-yellow-400 text-yellow-700 hover:bg-yellow-50">
              <Save className="w-4 h-4 mr-2" />
              Save Flow
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Flow Canvas */}
      <Card className="h-[600px]">
        <CardContent className="p-0 h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-50"
          >
            <Controls />
            <MiniMap />
            <Background color="#aaa" gap={16} />
          </ReactFlow>
        </CardContent>
      </Card>
    </div>
  );
}
