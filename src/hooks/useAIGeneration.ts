
import { useState, useEffect, useCallback } from 'react';
import { 
  generateSceneAssets, 
  getSceneAssets, 
  regenerateSceneAsset,
  subscribeToAssetUpdates,
  type SceneAsset,
  type StoryFlowData 
} from '@/services/aiGenerationService';
import { useToast } from '@/hooks/use-toast';

// Mock user ID - in a real app, this would come from auth
const MOCK_USER_ID = 'user-123';

export function useAIGeneration() {
  const [assets, setAssets] = useState<SceneAsset[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Load existing assets on mount
  useEffect(() => {
    loadAssets();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToAssetUpdates(MOCK_USER_ID, (updatedAssets) => {
      setAssets(updatedAssets);
      
      // Check if any generation completed
      const justCompleted = updatedAssets.filter(asset => 
        asset.status === 'completed' && 
        !assets.find(existing => existing.id === asset.id && existing.status === 'completed')
      );
      
      if (justCompleted.length > 0) {
        toast({
          title: "Assets Generated",
          description: `${justCompleted.length} scene(s) completed successfully!`,
        });
      }
    });

    return unsubscribe;
  }, [assets, toast]);

  const loadAssets = useCallback(async () => {
    const fetchedAssets = await getSceneAssets(MOCK_USER_ID);
    setAssets(fetchedAssets);
  }, []);

  const generateAssets = useCallback(async (storyFlow: StoryFlowData) => {
    setIsGenerating(true);
    
    const result = await generateSceneAssets({
      ...storyFlow,
      userId: MOCK_USER_ID
    });

    if (result.success) {
      toast({
        title: "Generation Started",
        description: "AI is generating assets for your scenes. This may take a few minutes.",
      });
    } else {
      toast({
        title: "Generation Failed",
        description: result.error || "Failed to start asset generation",
        variant: "destructive"
      });
    }

    setIsGenerating(false);
    return result;
  }, [toast]);

  const regenerateAsset = useCallback(async (sceneId: string) => {
    const result = await regenerateSceneAsset(sceneId);
    
    if (result.success) {
      toast({
        title: "Regeneration Started",
        description: "Regenerating asset for this scene.",
      });
    } else {
      toast({
        title: "Regeneration Failed",
        description: result.error || "Failed to regenerate asset",
        variant: "destructive"
      });
    }

    return result;
  }, [toast]);

  const regenerateAll = useCallback(async () => {
    const completedAssets = assets.filter(asset => asset.status === 'completed');
    
    if (completedAssets.length === 0) {
      toast({
        title: "No Assets to Regenerate",
        description: "No completed assets found.",
        variant: "destructive"
      });
      return;
    }

    const results = await Promise.all(
      completedAssets.map(asset => regenerateAsset(asset.scene_id))
    );

    const successCount = results.filter(r => r.success).length;
    
    if (successCount > 0) {
      toast({
        title: "Regeneration Started",
        description: `Regenerating ${successCount} asset(s).`,
      });
    }
  }, [assets, regenerateAsset, toast]);

  // Convert SceneAsset to GeneratedAsset format for compatibility
  const generatedAssets = assets.map(asset => ({
    id: asset.id,
    sceneTitle: asset.scene_title,
    sceneId: asset.scene_id,
    filename: asset.filename || `${asset.scene_title}_Generated.mp4`,
    thumbnail: asset.video_url || '',
    videoUrl: asset.video_url || '',
    generatedAt: new Date(asset.created_at),
    status: asset.status as 'completed' | 'generating' | 'failed',
  }));

  return {
    assets: generatedAssets,
    isGenerating,
    generateAssets,
    regenerateAsset,
    regenerateAll,
    loadAssets,
  };
}
