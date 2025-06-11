
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  useReactFlow,
  NodeTypes,
} from '@xyflow/react';
import { useState, useCallback, useRef } from 'react';
import { StoryNode } from './StoryNode';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

interface StoryFlowBuilderProps {
  onBack: () => void;
  onNext: () => void;
}

const initialNodes: Node<StoryNodeData>[] = [
  {
    id: '1',
    type: 'storyNode',
    position: { x: 250, y: 50 },
    data: {
      title: 'Scene 1',
      description: 'Father enters village',
      nodeType: 'Scene',
    },
  },
];

const initialEdges: Edge[] = [];

function FlowBuilder({ onBack, onNext }: StoryFlowBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<StoryNodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeId, setNodeId] = useState(2);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, fitView, zoomIn, zoomOut } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const getDefaultDescription = (type: string) => {
    switch (type) {
      case 'Scene': return 'New scene description';
      case 'Option Point': return 'User choice point';
      case 'Game': return 'Interactive game element';
      case 'AR Filter': return 'AR visual effect';
      default: return 'Description';
    }
  };

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node<StoryNodeData> = {
        id: nodeId.toString(),
        type: 'storyNode',
        position,
        data: {
          title: `${type} ${nodeId}`,
          description: getDefaultDescription(type),
          nodeType: type,
        },
      };

      setNodes((nds) => [...nds, newNode]);
      setNodeId((id) => id + 1);
    },
    [screenToFlowPosition, nodeId, setNodes]
  );

  const clearAll = () => {
    setNodes([]);
    setEdges([]);
    setNodeId(1);
  };

  return (
    <div className="flex h-[80vh] bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-black mb-4">Scene Blocks</h3>
        <div className="space-y-3">
          {['Scene', 'Option Point', 'Game', 'AR Filter'].map((type) => (
            <DraggableBlock key={type} type={type} />
          ))}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-gray-50 border-b border-gray-200 p-3 flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => zoomIn()}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => zoomOut()}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => fitView()}>
            <Maximize className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Canvas */}
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            className="bg-white"
          >
            <Controls />
            <Background color="#f1f5f9" gap={16} />
          </ReactFlow>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 flex items-center justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button variant="outline">
              <Play className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={onNext}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold"
            >
              Continue to Asset Generation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DraggableBlock({ type }: { type: string }) {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Scene': return '🎬';
      case 'Option Point': return '🔀';
      case 'Game': return '🎮';
      case 'AR Filter': return '✨';
      default: return '📦';
    }
  };

  return (
    <Card
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow border-gray-200 hover:border-yellow-400"
      draggable
      onDragStart={(event) => onDragStart(event, type)}
    >
      <CardContent className="p-3 text-center">
        <div className="text-2xl mb-2">{getIcon(type)}</div>
        <div className="text-sm font-medium text-black">{type}</div>
      </CardContent>
    </Card>
  );
}

export function StoryFlowBuilder(props: StoryFlowBuilderProps) {
  return (
    <ReactFlowProvider>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black mb-2">Build Your Story Flow</h1>
          <p className="text-gray-600">Drag elements from the sidebar to create your interactive story</p>
        </div>
        <FlowBuilder {...props} />
      </div>
    </ReactFlowProvider>
  );
}
