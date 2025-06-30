import { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface ChoicePointNodeData extends Record<string, unknown> {
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

type ChoicePointFlowNode = Node<ChoicePointNodeData, 'choice'>;

export const ChoicePointNode = memo(function ChoicePointNodeComponent({
  data,
  id,
}: NodeProps<ChoicePointFlowNode>) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    data.onDelete?.(id);
  };

  const updateChoiceOption = (optionIndex: number, value: string) => {
    data.onUpdate?.(id, optionIndex, value);
  };

  return (
    <Card className="w-80 bg-yellow-50 border-yellow-400 shadow-md relative">
      {typeof data.nodeNumber === 'number' && (
        <span className="absolute top-2 left-2 w-5 h-5 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-semibold">
          {data.nodeNumber}
        </span>
      )}
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-yellow-400 !border-2 !border-white" />

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
            <span className="text-lg">🔀</span>
            {data.title}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Choice Point
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 mb-4">{data.description}</p>

        <div className="space-y-3">
          {['A', 'B'].map((option, i) => (
            <div
              key={option}
              className="border border-yellow-300 rounded-lg p-3 bg-white"
            >
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Option {option}
              </label>
              <input
                type="text"
                value={data.options?.[i]?.label || ''}
                readOnly
                placeholder={`Option ${option} text (e.g. 'Take the left door')`}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-100 cursor-not-allowed"
              />
            </div>
          ))}
        </div>
      </CardContent>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-yellow-400 !border-2 !border-white"
      />
    </Card>
  );
});
