
import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

interface StoryNodeData extends Record<string, unknown> {
  title: string;
  description: string;
  nodeType: string;
}

export const StoryNode = memo(({ data }: NodeProps<StoryNodeData>) => {
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'Scene': return 'bg-blue-50 border-blue-200';
      case 'Option Point': return 'bg-yellow-50 border-yellow-400';
      case 'Game': return 'bg-green-50 border-green-200';
      case 'AR Filter': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'Scene': return '🎬';
      case 'Option Point': return '🔀';
      case 'Game': return '🎮';
      case 'AR Model': return '✨';
      default: return '📦';
    }
  };

  return (
    <Card className={`w-72 ${getNodeColor(data.nodeType)} shadow-md`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-yellow-400 !border-2 !border-white"
      />
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-black flex items-center gap-2">
            <span className="text-lg">{getNodeIcon(data.nodeType)}</span>
            {data.title}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {data.nodeType}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 mb-4">{data.description}</p>
        
        {data.nodeType === 'Scene' && (
          <div className="space-y-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full border-yellow-400 text-yellow-700 hover:bg-yellow-50"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Option A
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full border-yellow-400 text-yellow-700 hover:bg-yellow-50"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Option B
            </Button>
          </div>
        )}
        
        {data.nodeType === 'Option Point' && (
          <div className="text-xs text-gray-500 text-center">
            Connect to next scene
          </div>
        )}
      </CardContent>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-yellow-400 !border-2 !border-white"
      />
    </Card>
  );
});

StoryNode.displayName = 'StoryNode';
