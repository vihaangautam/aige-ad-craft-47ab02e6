import { memo, useState, useRef } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Archive, Play, X } from 'lucide-react';
import { Trash } from 'lucide-react';
import { VideoPreviewModal } from './VideoPreviewModal';

interface MediaOption {
  type: 'upload' | 'workspace-import';
  file?: File;
  thumbnail?: string;
  filename?: string;
  assetId?: string;
}

interface StoryNodeData {
  nodeNumber: number;
  title: string;
  description: string;
  nodeType: 'Scene' | 'Option Point' | 'Game' | 'AR Filter' | string;
  optionA?: MediaOption;
  optionB?: MediaOption;
  onImportFromWorkspace?: (nodeId: string, option: 'A' | 'B') => void;
  onDelete?: (nodeId: string) => void;
  onUpdate?: (nodeId: string, option: 'optionA' | 'optionB', value: MediaOption | undefined) => void;
  [key: string]: any;
}

type StoryFlowNode = Node<StoryNodeData, 'storyNode'>;

export const StoryNode = memo(function StoryNodeComponent({
  data,
  id,
}: NodeProps<StoryFlowNode>) {
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputARef = useRef<HTMLInputElement>(null);

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
      case 'AR Filter': return '✨';
      default: return '📦';
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  const handleUploadOptionA = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type.startsWith('video/') || file.type.startsWith('audio/'))) {
      const newOption: MediaOption = {
        type: 'upload',
        file,
        filename: file.name,
        thumbnail: URL.createObjectURL(file)
      };
      if (data.onUpdate) {
        data.onUpdate(id, 'optionA', newOption);
      }
      // Reset input so same file can be uploaded again
      event.target.value = '';
    }
  };

  const handleImportFromWorkspace = (option: 'A' | 'B') => {
    if (data.onImportFromWorkspace) {
      data.onImportFromWorkspace(id, option);
    }
  };

  const handlePreviewVideo = (option: any) => {
    if (option.thumbnail) {
      setPreviewVideo(option.thumbnail);
    }
  };

  const handleRemoveOptionB = () => {
    if (data.onUpdate) {
      data.onUpdate(id, 'optionB', undefined);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const dropped = JSON.parse(e.dataTransfer.getData('application/json'));
      if (dropped.type === 'workspace-asset') {
        const newOption: MediaOption = {
          type: 'workspace-import',
          filename: `Asset_${dropped.assetId}.mp4`,
          thumbnail: `https://images.unsplash.com/photo-1751076547771-ff3a1e5267a4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
          assetId: dropped.assetId,
        };
        if (data.onUpdate) {
          data.onUpdate(id, 'optionB', newOption);
        }
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  return (
    <>
      <Card className={`w-80 ${getNodeColor(data.nodeType)} shadow-md relative`}>
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
            <div className="space-y-3">
              {/* Option A - Upload */}
              <div className="border border-gray-200 rounded-lg p-3 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Option A</span>
                  {data.optionA && data.optionA.filename && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      Attached
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputARef.current?.click()}
                    className="hover:bg-gray-100 cursor-pointer transition-all px-4 py-2"
                  >
                    📁 Upload from Files
                  </Button>
                  <input
                    ref={fileInputARef}
                    id={`file-input-a-${id}`}
                    type="file"
                    accept="video/*"
                    style={{ display: 'none' }}
                    onChange={handleUploadOptionA}
                  />
                  {data.optionA && data.optionA.filename && (
                    <>
                      <p className="text-xs text-gray-600 truncate">{data.optionA.filename}</p>
                      {data.optionA.thumbnail && (
                        <video controls src={data.optionA.thumbnail} className="w-full mt-2 rounded" style={{ maxHeight: 120 }} />
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Option B - Import from Workspace */}
              <div
                className={`border border-gray-200 rounded-lg p-3 bg-white mt-4 ${isDragOver ? 'ring-2 ring-purple-400 bg-purple-50' : ''}`}
                onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={e => { e.preventDefault(); setIsDragOver(false); }}
                onDrop={handleDrop}
                style={{ pointerEvents: 'auto' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Option B</span>
                  {data.optionB && data.optionB.filename && (
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                      From Workspace
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => handleImportFromWorkspace('B')}
                    className="hover:bg-gray-100 cursor-pointer transition-all px-4 py-2"
                  >
                    🗂 Import from Workspace
                  </Button>
                  {data.optionB && data.optionB.filename && (
                    <>
                      <p className="text-xs text-gray-600 truncate">{data.optionB.filename}</p>
                      {data.optionB.thumbnail && (
                        <img src={data.optionB.thumbnail} alt="thumbnail" className="w-full mt-2 rounded" style={{ maxHeight: 80 }} />
                      )}
                      {data.optionB.assetId && (
                        <p className="text-xs text-gray-400">Asset ID: {data.optionB.assetId}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {data.nodeType === 'Option Point' && (
            <div className="text-xs text-gray-500 text-center">Connect to next scene</div>
          )}
        </CardContent>

        <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-yellow-400 !border-2 !border-white" />
      </Card>

      <VideoPreviewModal
        isOpen={!!previewVideo}
        onClose={() => setPreviewVideo(null)}
        videoUrl={previewVideo || ''}
      />
    </>
  );
});
