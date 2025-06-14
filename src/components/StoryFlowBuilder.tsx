
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
import { Plus, Save, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { StoryNode } from './StoryNode';
import { WorkspaceModal, GeneratedAsset } from './WorkspaceModal';
import { useToast } from '@/hooks/use-toast';

interface StoryNodeData {
  title: string;
  description: string;
  nodeType: 'Scene' | 'Option Point' | 'Game' | 'AR Filter' | string;
  onImportFromWorkspace?: (nodeId: string, option: 'A' | 'B') => void;
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
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isGeneratingAssets, setIsGeneratingAssets] = useState(false);
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);
  const [pendingAssignment, setPendingAssignment] = useState<{ nodeId: string; option: 'A' | 'B' } | null>(null);
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const getSceneCount = () => {
    return nodes.filter(node => node.data.nodeType === 'Scene').length;
  };

  const addNewNode = (nodeType: string) => {
    // Check scene limit
    if (nodeType === 'Scene' && getSceneCount() >= 5) {
      toast({
        title: "Scene Limit Reached",
        description: "You can only add up to 5 scenes per ad.",
        variant: "destructive"
      });
      return;
    }

    const newNode: Node<StoryNodeData> = {
      id: nodeIdCounter.toString(),
      type: 'storyNode',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        title: `New ${nodeType}`,
        description: `Description for ${nodeType.toLowerCase()}`,
        nodeType,
        onImportFromWorkspace: handleImportFromWorkspace,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter(nodeIdCounter + 1);
  };

  const handleImportFromWorkspace = (nodeId: string, option: 'A' | 'B') => {
    setPendingAssignment({ nodeId, option });
    setIsWorkspaceOpen(true);
  };

  const handleGenerateAssets = async () => {
    const sceneNodes = nodes.filter(node => node.data.nodeType === 'Scene');
    
    if (sceneNodes.length === 0) {
      toast({
        title: "No Scenes Found",
        description: "Add at least one scene before generating assets.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingAssets(true);
    
    // Create generating assets
    const newAssets: GeneratedAsset[] = sceneNodes.map(node => ({
      id: `asset-${node.id}-${Date.now()}`,
      sceneTitle: node.data.title,
      sceneId: node.id,
      filename: `${node.data.title.replace(/\s+/g, '_')}_AI_Generated.mp4`,
      thumbnail: '',
      videoUrl: '',
      generatedAt: new Date(),
      status: 'generating' as const,
    }));

    setGeneratedAssets(prev => [...prev, ...newAssets]);

    // Simulate AI generation
    for (let i = 0; i < newAssets.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000 + i * 1000));
      
      setGeneratedAssets(prev => prev.map(asset => 
        asset.id === newAssets[i].id 
          ? {
              ...asset,
              status: 'completed' as const,
              thumbnail: `https://images.unsplash.com/photo-1611077541120-4e12cffbcec7?w=400&h=300&fit=crop&q=80&auto=format&sig=${Math.random()}`,
              videoUrl: `https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4`,
            }
          : asset
      ));
    }

    setIsGeneratingAssets(false);
    
    toast({
      title: "Assets Generated",
      description: `Successfully generated ${newAssets.length} video assets.`,
    });
  };

  const handleAssignAsset = (assetId: string, nodeId: string, option: 'A' | 'B') => {
    const asset = generatedAssets.find(a => a.id === assetId);
    if (!asset) return;

    // Update the node with the assigned asset
    setNodes(nds => nds.map(node => {
      if (node.id === nodeId) {
        const optionKey = option === 'A' ? 'optionA' : 'optionB';
        return {
          ...node,
          data: {
            ...node.data,
            [optionKey]: {
              type: 'workspace-import',
              filename: asset.filename,
              thumbnail: asset.thumbnail,
              assetId: asset.id,
            }
          }
        };
      }
      return node;
    }));

    toast({
      title: "Asset Assigned",
      description: `${asset.filename} assigned to Option ${option}`,
    });
  };

  const handleRegenerateAsset = async (assetId: string) => {
    setGeneratedAssets(prev => prev.map(asset => 
      asset.id === assetId 
        ? { ...asset, status: 'generating' as const }
        : asset
    ));

    // Simulate regeneration
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setGeneratedAssets(prev => prev.map(asset => 
      asset.id === assetId 
        ? {
            ...asset,
            status: 'completed' as const,
            thumbnail: `https://images.unsplash.com/photo-1611077541120-4e12cffbcec7?w=400&h=300&fit=crop&q=80&auto=format&sig=${Math.random()}`,
            generatedAt: new Date(),
          }
        : asset
    ));
  };

  const handleRegenerateAll = async () => {
    const completedAssets = generatedAssets.filter(asset => asset.status === 'completed');
    
    setGeneratedAssets(prev => prev.map(asset => 
      asset.status === 'completed' 
        ? { ...asset, status: 'generating' as const }
        : asset
    ));

    // Simulate regeneration for all
    for (let i = 0; i < completedAssets.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000 + i * 500));
      
      setGeneratedAssets(prev => prev.map(asset => 
        asset.id === completedAssets[i].id 
          ? {
              ...asset,
              status: 'completed' as const,
              thumbnail: `https://images.unsplash.com/photo-1611077541120-4e12cffbcec7?w=400&h=300&fit=crop&q=80&auto=format&sig=${Math.random()}`,
              generatedAt: new Date(),
            }
          : asset
      ));
    }
  };

  // Update existing nodes to include the onImportFromWorkspace callback
  const nodesWithCallbacks = nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      onImportFromWorkspace: handleImportFromWorkspace,
    }
  }));

  const sceneCount = getSceneCount();
  const isSceneLimitReached = sceneCount >= 5;

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
          <CardTitle className="text-lg flex items-center justify-between">
            Add Story Elements
            <div className="text-sm font-normal text-gray-600">
              Scenes: {sceneCount}/5
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => addNewNode('Scene')} 
              className={`${
                isSceneLimitReached 
                  ? 'bg-gray-300 hover:bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
              disabled={isSceneLimitReached}
            >
              <Plus className="w-4 h-4 mr-2" />
              Scene {isSceneLimitReached && '(Max 5)'}
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
            
            {/* AI Generation Buttons */}
            <div className="ml-auto flex gap-2">
              <Button 
                onClick={handleGenerateAssets}
                disabled={isGeneratingAssets || sceneCount === 0}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isGeneratingAssets ? (
                  <>
                    <div className="w-4 h-4 mr-2 border border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Assets
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setIsWorkspaceOpen(true)}
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                Open Workspace
              </Button>
              
              <Button variant="outline" className="border-yellow-400 text-yellow-700 hover:bg-yellow-50">
                <Save className="w-4 h-4 mr-2" />
                Save Flow
              </Button>
            </div>
          </div>
          
          {isSceneLimitReached && (
            <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-700">
                ⚠️ You've reached the maximum of 5 scenes per ad. Remove a scene to add a new one.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Flow Canvas */}
      <Card className="h-[600px]">
        <CardContent className="p-0 h-full">
          <ReactFlow
            nodes={nodesWithCallbacks}
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

      {/* Workspace Modal */}
      <WorkspaceModal
        isOpen={isWorkspaceOpen}
        onClose={() => {
          setIsWorkspaceOpen(false);
          setPendingAssignment(null);
        }}
        assets={generatedAssets}
        onAssignAsset={handleAssignAsset}
        onRegenerateAsset={handleRegenerateAsset}
        onRegenerateAll={handleRegenerateAll}
        isGenerating={isGeneratingAssets}
      />
    </div>
  );
}
