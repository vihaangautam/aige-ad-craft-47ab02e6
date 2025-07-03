import { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface GameNodeData extends Record<string, unknown> {
  nodeNumber: number;
  title: string;
  description: string;
  nodeType: string;
  onDelete?: (nodeId: string) => void;
}

type GameFlowNode = Node<GameNodeData, 'game'>;

export const GameNode = memo(function GameNodeComponent({
  data,
  id,
}: NodeProps<GameFlowNode>) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    data.onDelete?.(id);
  };

  return (
    <Card className="w-80 bg-green-50 border-green-400 shadow-md relative">
      {typeof data.nodeNumber === 'number' && (
        <span className="absolute top-2 left-2 w-5 h-5 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-semibold">
          {data.nodeNumber}
        </span>
      )}
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-green-400 !border-2 !border-white" />

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs z-10 opacity-70 hover:opacity-100 transition-opacity"
        title="Delete node"
      >
        <X className="w-3 h-3" />
      </button>

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between pr-8">
          <CardTitle className="text-base font-semibold text-black flex items-center gap-2">
            <span className="text-lg">🎮</span>
            {data.title}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Game
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 mb-4">{data.description}</p>
      </CardContent>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-green-400 !border-2 !border-white" />
    </Card>
  );
}); 