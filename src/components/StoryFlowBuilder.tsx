import { useCallback, useState, useEffect } from 'react';
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
import { Plus, Save, ArrowLeft, ArrowRight, Sparkles, Archive, AlertCircle } from 'lucide-react';
import { StoryNode } from './StoryNode';
import { WorkspaceDrawer } from './WorkspaceDrawer';
import { GeneratedAsset } from './WorkspaceModal';
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
  const [isFlowSaved, setIsFlowSaved] = useState(false);
  const { toast } = useToast();

  // Center the canvas on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      // This will center the canvas properly on first render
      const fitViewOptions = { 
        padding: 0.2, 
        includeHiddenNodes: false,
        duration: 500 
      };
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const validateConnection = (connection: Connection): boolean => {
    const sourceNode = nodes.find(node => node.id === connection.source);
    if (!sourceNode) return false;

    const existingEdgesFromSource = edges.filter(edge => edge.source === connection.source);

    // Scene nodes: max 1 outgoing connection
    if (sourceNode.data.nodeType === 'Scene' && existingEdgesFromSource.length >= 1) {
      toast({
        title: "Connection Limit Reached",
        description: "Scene nodes can only have one outgoing connection.",
        variant: "destructive"
      });
      return false;
    }

    // Option Point nodes: max 2 outgoing connections
    if (sourceNode.data.nodeType === 'Option Point' && existingEdgesFromSource.length >= 2) {
      toast({
        title: "Connection Limit Reached",
        description: "You can only add two options from a choice point.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const onConnect = useCallback(
    (params: Connection) => {
      if (validateConnection(params)) {
        setEdges((eds) => addEdge(params, eds));
      }
    },
    [setEdges, nodes, edges, toast]
  );

  // Handle node deletion
  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter(node => node.id !== nodeId));
    setEdges((eds) => eds.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
    
    toast({
      title: "Node Deleted",
      description: "Node and all its connections have been removed.",
    });
  }, [setNodes, setEdges, toast]);

  // Handle keyboard events for deletion
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Backspace' || event.key === 'Delete') {
        const selectedNodes = nodes.filter(node => node.selected);
        if (selectedNodes.length > 0) {
          selectedNodes.forEach(node => {
            handleDeleteNode(node.id);
          });
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [nodes, handleDeleteNode]);

  const getSceneCount = () => {
    return nodes.filter(node => node.data.nodeType === 'Scene').length;
  };

  const addNewNode = (nodeType: string) => {
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
      position: { x: 100 + Math.random() * 300, y: 100 + Math.random() * 300 },
      data: {
        title: `New ${nodeType}`,
        description: `Description for ${nodeType.toLowerCase()}`,
        nodeType,
        onImportFromWorkspace: handleImportFromWorkspace,
        onDelete: handleDeleteNode,
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

  // Update existing nodes to include the callbacks
  const nodesWithCallbacks = nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      onImportFromWorkspace: handleImportFromWorkspace,
      onDelete: handleDeleteNode,
    }
  }));

  const sceneCount = getSceneCount();
  const isSceneLimitReached = sceneCount >= 5;

  // New function to save flow to localStorage
  const handleSaveFlow = () => {
    try {
      // Convert nodes to scene format for preview
      const scenes = nodes
        .filter(node => node.data.nodeType === 'Scene')
        .map(node => ({
          id: node.id,
          title: node.data.title,
          description: node.data.description || '',
          optionA: {
            label: node.data.optionA?.label || 'Option A',
            videoURL: node.data.optionA?.videoURL || node.data.optionA?.thumbnail || '',
            nextSceneId: getNextSceneId(node.id, 'A'),
          },
          optionB: {
            label: node.data.optionB?.label || 'Option B', 
            videoURL: node.data.optionB?.videoURL || node.data.optionB?.thumbnail || '',
            nextSceneId: getNextSceneId(node.id, 'B'),
          },
        }));

      const storyFlow = {
        scenes,
        openingSceneId: '1', // Default to first node, or find opening scene
      };

      localStorage.setItem('aige_current_flow', JSON.stringify(storyFlow));
      setIsFlowSaved(true);
      
      toast({
        title: "Flow Saved",
        description: "Your story flow has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save the story flow.",
        variant: "destructive"
      });
    }
  };

  // Helper function to find next scene ID from connections
  const getNextSceneId = (sourceNodeId: string, option: 'A' | 'B'): string | null => {
    // Find edges from this node
    const outgoingEdges = edges.filter(edge => edge.source === sourceNodeId);
    
    // For simplicity, assume first edge is option A, second is option B
    // In a more complex implementation, you'd track which handle was used
    const targetEdge = outgoingEdges[option === 'A' ? 0 : 1];
    
    return targetEdge?.target || null;
  };

  const handleSeePreview = () => {
    window.location.href = '/preview';
  };

  return (
    <div className="h-screen flex flex-col animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-white">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Story Flow Builder</h1>
          <p className="text-gray-600">Design interactive ad experiences with branching narratives</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            Scenes: {sceneCount}/5
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
      </div>

      {/* Top Toolbar - Story Elements */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="mb-2">
          <h3 className="text-sm font-medium text-gray-700">Story Elements</h3>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => addNewNode('Scene')} 
            size="sm"
            className={
              isSceneLimitReached 
                ? 'bg-gray-300 hover:bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }
            disabled={isSceneLimitReached}
          >
            <Plus className="w-4 h-4 mr-2" />
            🎬 Scene {isSceneLimitReached && '(Max 5)'}
          </Button>
          <Button 
            onClick={() => addNewNode('Option Point')} 
            size="sm"
            className="bg-yellow-400 hover:bg-yellow-500 text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            🔀 Choice Point
          </Button>
          <Button 
            onClick={() => addNewNode('Game')} 
            size="sm"
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            🎮 Mini Game
          </Button>
          <Button 
            onClick={() => addNewNode('AR Filter')} 
            size="sm"
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            ✨ AR Filter
          </Button>
        </div>
        
        {isSceneLimitReached && (
          <div className="mt-3 flex items-center gap-2 text-orange-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            Maximum of 5 scenes reached
          </div>
        )}
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative">        
        <ReactFlow
          nodes={nodesWithCallbacks}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50"
          fitViewOptions={{ padding: 0.2 }}
        >
          <Controls />
          <MiniMap />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>

      {/* Bottom Toolbar - Project Actions */}
      <div className="bg-gray-50 border-t border-gray-200 p-4">
        <div className="mb-2">
          <h3 className="text-sm font-medium text-gray-700">Project Actions</h3>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleGenerateAssets}
            disabled={isGeneratingAssets || sceneCount === 0}
            size="sm"
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
            size="sm"
            onClick={() => setIsWorkspaceOpen(true)}
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <Archive className="w-4 h-4 mr-2" />
            Open Workspace
          </Button>
          
          <Button 
            onClick={handleSaveFlow}
            size="sm"
            className="border-yellow-400 text-yellow-700 hover:bg-yellow-50 border"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Flow
          </Button>

          {isFlowSaved && (
            <Button 
              onClick={handleSeePreview}
              size="sm"
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold"
            >
              See Preview
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Workspace Drawer */}
      <WorkspaceDrawer
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
        onGenerateAssets={handleGenerateAssets}
        pendingAssignment={pendingAssignment}
      />
    </div>
  );
}
