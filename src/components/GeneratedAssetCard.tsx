
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, RefreshCw, Check, GripVertical } from 'lucide-react';
import { GeneratedAsset } from './WorkspaceModal';

interface GeneratedAssetCardProps {
  asset: GeneratedAsset;
  isSelected: boolean;
  onSelect: () => void;
  onAssign: () => void;
  onRegenerate: () => void;
  showAssignButton: boolean;
  isDraggable?: boolean;
}

export function GeneratedAssetCard({ 
  asset, 
  isSelected, 
  onSelect, 
  onAssign, 
  onRegenerate,
  showAssignButton,
  isDraggable = false
}: GeneratedAssetCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    if (isDraggable) {
      e.dataTransfer.setData('application/json', JSON.stringify({
        assetId: asset.id,
        type: 'workspace-asset'
      }));
      e.dataTransfer.effectAllowed = 'copy';
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-purple-400 border-purple-400' : 'border-gray-200'
      } ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
      onClick={onSelect}
      draggable={isDraggable}
      onDragStart={handleDragStart}
    >
      <CardContent className="p-3">
        {/* Drag Handle */}
        {isDraggable && (
          <div className="flex items-center mb-2">
            <GripVertical className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-xs text-gray-500">Drag to assign</span>
          </div>
        )}

        {/* Thumbnail */}
        <div className="aspect-video bg-gray-100 rounded-md mb-3 relative overflow-hidden">
          <img 
            src={asset.thumbnail} 
            alt={`${asset.sceneTitle} thumbnail`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Play className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Asset Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {asset.sceneTitle}
            </h4>
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
              Ready
            </Badge>
          </div>
          
          <p className="text-xs text-gray-600 truncate">{asset.filename}</p>
          
          <div className="text-xs text-gray-500">
            Generated {asset.generatedAt.toLocaleDateString()}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {showAssignButton ? (
              <Button 
                size="sm" 
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onAssign();
                }}
              >
                <Check className="w-3 h-3 mr-1" />
                Assign
              </Button>
            ) : (
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle preview
                }}
              >
                <Play className="w-3 h-3 mr-1" />
                Preview
              </Button>
            )}
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onRegenerate();
              }}
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
