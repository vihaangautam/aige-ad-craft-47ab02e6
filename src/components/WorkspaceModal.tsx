
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, RefreshCw, Play, Download } from 'lucide-react';
import { GeneratedAssetCard } from './GeneratedAssetCard';

export interface GeneratedAsset {
  id: string;
  sceneTitle: string;
  sceneId: string;
  filename: string;
  thumbnail: string;
  videoUrl: string;
  generatedAt: Date;
  status: 'completed' | 'generating' | 'failed';
}

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: GeneratedAsset[];
  onAssignAsset: (assetId: string, nodeId: string, option: 'A' | 'B') => void;
  onRegenerateAsset: (assetId: string) => void;
  onRegenerateAll: () => void;
  isGenerating: boolean;
}

export function WorkspaceModal({ 
  isOpen, 
  onClose, 
  assets, 
  onAssignAsset, 
  onRegenerateAsset, 
  onRegenerateAll,
  isGenerating 
}: WorkspaceModalProps) {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [assignmentMode, setAssignmentMode] = useState<{ nodeId: string; option: 'A' | 'B' } | null>(null);

  const completedAssets = assets.filter(asset => asset.status === 'completed');
  const generatingAssets = assets.filter(asset => asset.status === 'generating');

  const handleAssignAsset = (assetId: string) => {
    if (assignmentMode) {
      onAssignAsset(assetId, assignmentMode.nodeId, assignmentMode.option);
      setAssignmentMode(null);
      setSelectedAsset(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              AI Asset Workspace
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRegenerateAll}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="w-3 h-3 mr-1 border border-gray-300 border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Regenerate All
                  </>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 overflow-y-auto">
          {/* Assignment Mode Banner */}
          {assignmentMode && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-sm text-purple-700">
                <strong>Assignment Mode:</strong> Select an asset to assign to Option {assignmentMode.option}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setAssignmentMode(null)}
              >
                Cancel Assignment
              </Button>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{completedAssets.length} assets ready</span>
            {generatingAssets.length > 0 && (
              <span>{generatingAssets.length} generating</span>
            )}
          </div>

          {/* Generating Assets */}
          {generatingAssets.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Currently Generating</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {generatingAssets.map((asset) => (
                  <Card key={asset.id} className="border-yellow-200 bg-yellow-50">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border border-yellow-400 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm font-medium">{asset.sceneTitle}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Generating video...</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Generated Assets */}
          {completedAssets.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Generated Assets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {completedAssets.map((asset) => (
                  <GeneratedAssetCard
                    key={asset.id}
                    asset={asset}
                    isSelected={selectedAsset === asset.id}
                    onSelect={() => setSelectedAsset(asset.id)}
                    onAssign={() => handleAssignAsset(asset.id)}
                    onRegenerate={() => onRegenerateAsset(asset.id)}
                    showAssignButton={!!assignmentMode}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {assets.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Assets Generated Yet</h3>
              <p className="text-gray-600 mb-4">Click "Generate Assets" to create AI videos for your scenes.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
