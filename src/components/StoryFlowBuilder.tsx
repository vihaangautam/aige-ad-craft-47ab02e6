
import { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  NodeTypes,
  Controls,
  Background,
  BackgroundVariant,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { StoryNode } from './StoryNode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ZoomIn, ZoomOut, Maximize, Trash2, Save, Play, ArrowRight } from 'lucide-react';
import '@xyflow/react/dist/style.css';

interface StoryNodeData extends Record<string, unknown> {
  title: string;
  description: string;
  nodeType: string;
}

const nodeTypes: NodeTypes = {
  storyNode: StoryNode,
};

const initialNodes: Node<StoryNodeData>[] = [
  {
    id: '1',
    type: 'storyNode',
    position: { x: 250, y: 100 },
    data: {
      title: 'Opening Scene',
      description: 'The story begins in a mysterious forest where our hero finds an ancient map.',
      nodeType: 'Scene',
    },
  },
  {
    id: '2',
    type: 'storyNode',
    position: { x: 100, y: 300 },
    data: {
      title: 'Choice Point',
      description: 'Should the hero follow the map or return to the village?',
      nodeType: 'Option Point',
    },
  },
  {
    id: '3',
    type: 'storyNode',
    position: { x: 400, y: 300 },
    data: {
      title: 'AR Discovery',
      description: 'Use AR to reveal hidden symbols on the map.',
      nodeType: 'AR Filter',
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    style: { stroke: '#f59e0b', strokeWidth: 2 },
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    type: 'smoothstep',
    style: { stroke: '#f59e0b', strokeWidth: 2 },
  },
];

export function StoryFlowBuilder() {
  const [nodes, setNodes] = useState<Node<StoryNodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNodeType, setSelectedNodeType] = useState('Scene');

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            style: { stroke: '#f59e0b', strokeWidth: 2 },
          },
          eds
        )
      ),
    []
  );

  const addNewNode = useCallback(() => {
    const newNode: Node<StoryNodeData> = {
      id: `${nodes.length + 1}`,
      type: 'storyNode',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        title: `New ${selectedNodeType}`,
        description: `This is a new ${selectedNodeType.toLowerCase()} in your story.`,
        nodeType: selectedNodeType,
      },
    };

    setNodes((nds) => [...nds, newNode]);
  }, [nodes.length, selectedNodeType]);

  const nodeTypeOptions = ['Scene', 'Option Point', 'Game', 'AR Filter'];

  return (
    <div className="h-full w-full bg-white">
      {/* Toolbar */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-black">Story Flow Builder</h2>
          <Badge variant="outline" className="text-yellow-600">Interactive Story</Badge>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedNodeType}
            onChange={(e) => setSelectedNodeType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          >
            {nodeTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <Button onClick={addNewNode} size="sm" className="bg-yellow-500 hover:bg-yellow-600">
            Add {selectedNodeType}
          </Button>

          <div className="h-6 w-px bg-gray-300" />

          <Button variant="outline" size="sm">
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>

          <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">
            <Play className="w-4 h-4 mr-1" />
            Preview
          </Button>
        </div>
      </div>

      {/* Flow Canvas */}
      <div className="h-[calc(100%-4rem)]">
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
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e5e7eb" />
          <Controls className="bg-white border border-gray-200 rounded-lg shadow-sm" />
        </ReactFlow>
      </div>
    </div>
  );
}
