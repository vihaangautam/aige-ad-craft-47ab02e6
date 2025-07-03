import { memo, useState } from 'react';
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
  onUpdate?: (nodeId: string, optionIndex: number, updatedOptionData: { label?: string; nextSceneId?: string }) => void;
  onDelete?: (nodeId: string) => void;
  allNodes?: Node[]; // Added to populate nextSceneId dropdown
}

type ChoicePointFlowNode = Node<ChoicePointNodeData, 'choice'>;

export const ChoicePointNode = memo(function ChoicePointNodeComponent({
  data,
  id,
}: NodeProps<ChoicePointFlowNode>) {
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    data.onDelete?.(id);
  };

  // Handler for when an option's label changes
  const handleLabelChange = (optionIndex: number, newLabel: string) => {
    const currentNextSceneId = data.options?.[optionIndex]?.nextSceneId;
    data.onUpdate?.(id, optionIndex, {
      label: newLabel,
      nextSceneId: currentNextSceneId
    });
    setLastUpdated(optionIndex);
    setTimeout(() => setLastUpdated(null), 800);
  };

  // Handler for when an option's nextSceneId changes
  const handleNextSceneChange = (optionIndex: number, newNextSceneId: string) => {
    const currentLabel = data.options?.[optionIndex]?.label;
    data.onUpdate?.(id, optionIndex, {
      label: currentLabel,
      nextSceneId: newNextSceneId === '' ? undefined : newNextSceneId
    });
    setLastUpdated(optionIndex);
    setTimeout(() => setLastUpdated(null), 800);
  };

  // Group nodes for dropdown
  const groupedNodes: Record<string, Node[]> = (data.allNodes || []).reduce((acc: Record<string, Node[]>, node: Node) => {
    if (node.id === id) return acc;
    const type = node.type || 'Other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(node);
    return acc;
  }, {});

  const bothOptionsEmpty = !data.options?.[0]?.label && !data.options?.[1]?.label;

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
        aria-label="Delete choice point node"
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

        {bothOptionsEmpty && (
          <div className="mb-2 p-2 bg-yellow-100 text-yellow-800 text-xs rounded">
            ⚠️ Please provide at least one option for this choice point.
          </div>
        )}

        <div className="space-y-3">
          {['A', 'B'].map((option, i) => (
            <div
              key={option}
              className={`border border-yellow-300 rounded-lg p-3 bg-white transition-shadow ${lastUpdated === i ? 'ring-2 ring-yellow-400' : ''}`}
            >
              <label className="text-sm font-medium text-gray-700 mb-2 block" htmlFor={`option-label-${id}-${i}`}>Option {option}</label>
              <input
                id={`option-label-${id}-${i}`}
                type="text"
                value={data.options?.[i]?.label || ''}
                onChange={(e) => handleLabelChange(i, e.target.value)}
                placeholder={`Option ${option} text (e.g. 'Take the left door')`}
                className={`w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent mb-2 ${!data.options?.[i]?.label ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                aria-label={`Label for option ${option}`}
              />
              <select
                value={data.options?.[i]?.nextSceneId || ''}
                onChange={(e) => handleNextSceneChange(i, e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                aria-label={`Next scene for option ${option}`}
              >
                <option value="">-- End of Path --</option>
                {(Object.entries(groupedNodes) as [string, any[]][]).map(([type, nodes]) => (
                  <optgroup key={type} label={type.charAt(0).toUpperCase() + type.slice(1)}>
                    {nodes.map(sceneNode => (
                      <option key={sceneNode.id} value={sceneNode.id}>
                        {sceneNode.data.title || `Node ${sceneNode.id}`} (ID: {sceneNode.id.substring(0,4)})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
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
