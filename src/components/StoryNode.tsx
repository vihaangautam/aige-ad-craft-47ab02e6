
import { memo, useState } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Upload, Sparkles, Play, FileVideo } from 'lucide-react';
import { VideoPreviewModal } from './VideoPreviewModal';

interface MediaOption {
  type: 'upload' | 'ai-generated';
  file?: File;
  thumbnail?: string;
  filename?: string;
}

interface StoryNodeData {
  title: string;
  description: string;
  nodeType: 'Scene' | 'Option Point' | 'Game' | 'AR Filter' | string;
  optionA?: MediaOption;
  optionB?: MediaOption;
  [key: string]: any;
}

type StoryFlowNode = Node<StoryNodeData, 'storyNode'>;

export const StoryNode = memo(function StoryNodeComponent({
  data,
  id,
}: NodeProps<StoryFlowNode>) {
  const [optionA, setOptionA] = useState<MediaOption | undefined>(data.optionA);
  const [optionB, setOptionB] = useState<MediaOption | undefined>(data.optionB);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

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

  const handleUploadOptionA = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const newOption: MediaOption = {
        type: 'upload',
        file,
        filename: file.name,
        thumbnail: URL.createObjectURL(file)
      };
      setOptionA(newOption);
    }
  };

  const handleGenerateOptionB = async () => {
    setIsGeneratingAI(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockOption: MediaOption = {
      type: 'ai-generated',
      filename: 'AI_Generated_Video.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1611077541120-4e12cffbcec7?w=400&h=300&fit=crop'
    };
    
    setOptionB(mockOption);
    setIsGeneratingAI(false);
  };

  const handlePreviewVideo = (option: MediaOption) => {
    if (option.thumbnail) {
      setPreviewVideo(option.thumbnail);
    }
  };

  return (
    <>
      <Card className={`w-80 ${getNodeColor(data.nodeType)} shadow-md`}>
        <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-yellow-400 !border-2 !border-white" />

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
            <div className="space-y-3">
              {/* Option A - Upload */}
              <div className="border border-gray-200 rounded-lg p-3 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Option A</span>
                  {optionA && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      Attached
                    </Badge>
                  )}
                </div>
                
                {optionA ? (
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center cursor-pointer hover:bg-gray-200"
                      onClick={() => handlePreviewVideo(optionA)}
                    >
                      <Play className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 truncate">{optionA.filename}</p>
                      <p className="text-xs text-blue-600">Click to preview</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleUploadOptionA}
                      className="hidden"
                      id={`upload-a-${id}`}
                    />
                    <label htmlFor={`upload-a-${id}`}>
                      <Button size="sm" variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50" asChild>
                        <span className="cursor-pointer">
                          <Upload className="w-3 h-3 mr-1" />
                          Upload from Files
                        </span>
                      </Button>
                    </label>
                  </div>
                )}
              </div>

              {/* Option B - AI Generate */}
              <div className="border border-gray-200 rounded-lg p-3 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Option B</span>
                  {optionB && (
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                      AI Generated
                    </Badge>
                  )}
                </div>
                
                {optionB ? (
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center cursor-pointer hover:bg-gray-200"
                      onClick={() => handlePreviewVideo(optionB)}
                    >
                      <Play className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 truncate">{optionB.filename}</p>
                      <p className="text-xs text-purple-600">Click to preview</p>
                    </div>
                  </div>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                    onClick={handleGenerateOptionB}
                    disabled={isGeneratingAI}
                  >
                    {isGeneratingAI ? (
                      <>
                        <div className="w-3 h-3 mr-1 border border-purple-300 border-t-transparent rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 mr-1" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                )}
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
