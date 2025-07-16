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
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Save, ArrowLeft, ArrowRight, Sparkles, Archive, AlertCircle } from 'lucide-react';
import { StoryNode } from './StoryNode';
import { ChoicePointNode } from './ChoicePointNode';
import { WorkspaceDrawer } from './WorkspaceDrawer';
import { GeneratedAsset } from './WorkspaceModal';
import { useToast } from '@/hooks/use-toast';
import { scenesAPI, scriptAPI, getUserIdFromToken, configsAPI } from '@/lib/auth';
import { useFlow } from "./FlowContext";
import { GameNode } from './GameNode';
import { choicePointNodes, choicePointEdges } from './staticFlowTemplate2';

interface StoryNodeData {
  nodeNumber: number;
  title: string;
  description: string;
  nodeType: 'Scene' | 'Option Point' | 'Game' | 'AR Filter' | string;
  optionA?: {
    type: 'upload' | 'workspace-import';
    file?: File;
    thumbnail?: string;
    filename?: string;
    assetId?: string;
    videoURL?: string;
  };
  optionB?: {
    type: 'upload' | 'workspace-import';
    file?: File;
    thumbnail?: string;
    filename?: string;
    assetId?: string;
    videoURL?: string;
  };
  onImportFromWorkspace?: (nodeId: string, option: 'A' | 'B') => void;
  [key: string]: any;
}

interface ChoicePointNodeData {
  nodeNumber: number;
  title: string;
  description: string;
  options: {
    label: string;
    nextSceneId?: string;
  }[];
  onUpdate?: (nodeId: string, optionIndex: number, value: string) => void;
  onDelete?: (nodeId: string) => void;
}

interface StoryFlowBuilderProps {
  onBack: () => void;
  onNext: () => void;
  adConfigId: string | number | null; // Added for saving/loading flow to backend
  initialNodes?: Node[];
  initialEdges?: Edge[];
  isStaticTemplate?: boolean;
  useChoicePointTemplate?: boolean; // NEW: flag to use choice point template
}

const nodeTypes = {
  storyNode: StoryNode,
  choice: ChoicePointNode,
  game: GameNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'storyNode',
    position: { x: 250, y: 50 },
    data: {
      nodeNumber: 1,
      title: 'Opening Scene',
      description: 'User enters the virtual showroom',
      nodeType: 'Scene',
    },
  },
];

const initialEdges: Edge[] = [];

type OptionData = {
  filename?: string;
  file?: File;
  thumbnail?: string;
  videoURL?: string;
  video_url?: string;
  assetId?: string;
};

export function StoryFlowBuilder() {
  // Render the static template as a read-only flow
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
            Scenes: {choicePointNodes.filter(node => node.data.nodeType === 'Scene').length}/5
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold" onClick={() => window.location.href = '/preview'}>
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
            onClick={() => {}} 
            size="sm"
            className={
              choicePointNodes.filter(node => node.data.nodeType === 'Scene').length >= 5
                ? 'bg-gray-300 hover:bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }
            disabled={choicePointNodes.filter(node => node.data.nodeType === 'Scene').length >= 5}
          >
            <Plus className="w-4 h-4 mr-2" />
            🎬 Scene {choicePointNodes.filter(node => node.data.nodeType === 'Scene').length >= 5 && '(Max 5)'}
          </Button>
          <Button 
            onClick={() => {}} 
            size="sm"
            className="bg-yellow-400 hover:bg-yellow-500 text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            🔀 Choice Point
          </Button>
          <Button 
            onClick={() => {}} 
            size="sm"
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            🎮 Mini Game
          </Button>
          <Button 
            onClick={() => {}} 
            size="sm"
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            ✨ AR Filter
          </Button>
        </div>
        
        {choicePointNodes.filter(node => node.data.nodeType === 'Scene').length >= 5 && (
          <div className="mt-3 flex items-center gap-2 text-orange-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            Maximum of 5 scenes reached
          </div>
        )}
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative">
        <ReactFlowProvider>
          <ReactFlow
            nodes={choicePointNodes}
            edges={choicePointEdges}
            nodeTypes={nodeTypes}
            fitView
            panOnDrag={true}
            panOnScroll={true}
            zoomOnScroll={true}
            zoomOnPinch={true}
            minZoom={0.2}
            maxZoom={2}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            className="bg-gray-50 cursor-black"
            fitViewOptions={{ padding: 0.2 }}
          >
            <Controls />
            <MiniMap />
            <Background color="#eee" gap={16} />
          </ReactFlow>
        </ReactFlowProvider>
      </div>

      {/* Bottom Toolbar - Project Actions */}
      <div className="bg-gray-50 border-t border-gray-200 p-4">
        <div className="mb-2">
          <h3 className="text-sm font-medium text-gray-700">Project Actions</h3>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => {}}
            disabled={false}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {false ? (
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
            onClick={() => {}}
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <Archive className="w-4 h-4 mr-2" />
            Open Workspace
          </Button>
          
          <Button
            onClick={() => {}}
            size="sm"
            className="border-yellow-400 text-yellow-700 hover:bg-yellow-50 border"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Flow
          </Button>

          {false && (
            <Button 
              onClick={() => {}}
              disabled={false}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {false ? (
                <>
                  <div className="w-4 h-4 mr-2 border border-white border-t-transparent rounded-full animate-spin" />
                  Generating Script...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Script
                </>
              )}
            </Button>
          )}

          <Button 
            onClick={() => window.location.href = '/preview'}
            size="sm"
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold"
          >
            See Preview
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Workspace Drawer */}
      <WorkspaceDrawer
        isOpen={false}
        onClose={() => {}}
        assets={[]}
        onAssignAsset={() => {}}
        onRegenerateAsset={() => {}}
        onRegenerateAll={() => {}}
        isGenerating={false}
        onGenerateAssets={() => {}}
        pendingAssignment={null}
      />
    </div>
  );
}