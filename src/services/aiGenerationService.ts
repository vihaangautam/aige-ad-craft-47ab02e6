import { supabase } from '@/integrations/supabase/client';

export interface SceneAsset {
  id: string;
  scene_id: string;
  user_id: string;
  status: 'generating' | 'completed' | 'failed';
  scene_title: string;
  script?: string;
  video_url?: string;
  audio_url?: string;
  filename?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface StoryFlowData {
  scenes: Array<{
    id: string;
    title: string;
    description: string;
    nodeType: string;
  }>;
  theme: string;
  tone: string;
  characters: string[];
  userId: string;
}

export async function generateSceneAssets(storyFlow: StoryFlowData): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-assets', {
      body: { storyFlow }
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Asset generation failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function getSceneAssets(userId: string): Promise<SceneAsset[]> {
  try {
    const { data, error } = await supabase
      .from('scene_assets')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Failed to fetch scene assets:', error);
    return [];
  }
}

export async function regenerateSceneAsset(sceneId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // This would trigger regeneration for a specific scene
    // For now, we'll mark it as generating and let the full flow handle it
    const { error } = await supabase
      .from('scene_assets')
      .update({ 
        status: 'generating',
        updated_at: new Date().toISOString()
      })
      .eq('scene_id', sceneId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Failed to regenerate scene asset:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function subscribeToAssetUpdates(
  userId: string, 
  callback: (assets: SceneAsset[]) => void
) {
  const channel = supabase
    .channel('scene_assets_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'scene_assets',
        filter: `user_id=eq.${userId}`
      },
      () => {
        // Refetch assets when changes occur
        getSceneAssets(userId).then(callback);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
