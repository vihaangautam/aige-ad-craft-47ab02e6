
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, RefreshCw, Sparkles, Play } from 'lucide-react';
import { GeneratedAssetCard } from './GeneratedAssetCard';
import { GeneratedAsset } from './WorkspaceModal';

interface WorkspaceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  assets: GeneratedAsset[];
  onAssignAsset: (assetId: string, nodeId: string, option: 'A' | 'B') => void;
  onRegenerateAsset: (assetId: string) => void;
  onRegenerateAll: () => void;
  isGenerating: boolean;
  onGenerateAssets: () => void;
  pendingAssignment: { nodeId: string; option: 'A' | 'B' } | null;
}

export function WorkspaceDrawer({ 
  isOpen, 
  onClose, 
  assets, 
  onAssignAsset, 
  onRegenerateAsset, 
  onRegenerateAll,
  isGenerating,
  onGenerateAssets,
  pendingAssignment
}: WorkspaceDrawerProps) {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const completedAssets = assets.filter(asset => asset.status === 'completed');
  const generatingAssets = assets.filter(asset => asset.status === 'generating');

  const handleAssignAsset = (assetId: string) => {
    if (pendingAssignment) {
      onAssignAsset(assetId, pendingAssignment.nodeId, pendingAssignment.option);
      setSelectedAsset(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div>
          <h2 className="text-lg font-bold text-gray-900">AI Asset Workspace</h2>
          <p className="text-sm text-gray-600">{completedAssets.length} assets ready</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Assignment Mode Banner */}
        {pendingAssignment && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-sm text-purple-700 font-medium">
              Assignment Mode: Option {pendingAssignment.option}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              Select an asset below to assign to this scene
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        )}

        {/* Generate Assets CTA */}
        {assets.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Assets Generated Yet</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Click "Generate Assets" to create AI videos for your scenes.
            </p>
            <Button 
              onClick={onGenerateAssets}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Assets
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        {assets.length > 0 && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRegenerateAll}
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <div className="w-3 h-3 mr-2 border border-gray-300 border-t-transparent rounded-full animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3 mr-2" />
                  Regenerate All
                </>
              )}
            </Button>
          </div>
        )}

        {/* Generating Assets */}
        {generatingAssets.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Currently Generating</h3>
            <div className="space-y-2">
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
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Generated Assets</h3>
            <div className="space-y-3">
              {completedAssets.map((asset) => (
                <GeneratedAssetCard
                  key={asset.id}
                  asset={asset}
                  isSelected={selectedAsset === asset.id}
                  onSelect={() => setSelectedAsset(asset.id)}
                  onAssign={() => handleAssignAsset(asset.id)}
                  onRegenerate={() => onRegenerateAsset(asset.id)}
                  showAssignButton={!!pendingAssignment}
                  isDraggable={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
