
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SceneData {
  id: string;
  title: string;
  description: string;
  nodeType: string;
}

interface StoryFlow {
  scenes: SceneData[];
  theme: string;
  tone: string;
  characters: string[];
  userId: string;
}

async function generateScript(scene: SceneData, storyContext: Partial<StoryFlow>): Promise<string> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiApiKey) {
    throw new Error('Gemini API key not configured');
  }

  const prompt = `Create a compelling video script for this interactive story scene:

Title: ${scene.title}
Description: ${scene.description}
Theme: ${storyContext.theme}
Tone: ${storyContext.tone}
Characters: ${storyContext.characters?.join(', ')}

Requirements:
- Write a 30-60 second video script
- Match the ${storyContext.tone} tone
- Include engaging visuals and dialogue
- Keep it suitable for ${storyContext.theme} theme
- Make it interactive and immersive

Return only the script content, no additional formatting.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Script generation failed';
}

async function generateVoiceover(script: string): Promise<string> {
  const elevenlabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
  if (!elevenlabsApiKey) {
    console.log('ElevenLabs API key not configured, skipping voiceover generation');
    return '';
  }

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${elevenlabsApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: script,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8
        }
      })
    });

    if (response.ok) {
      const audioBlob = await response.blob();
      // In a real implementation, you'd upload this to Supabase Storage
      return 'audio-url-placeholder';
    }
  } catch (error) {
    console.log('Voiceover generation failed:', error);
  }
  
  return '';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { storyFlow }: { storyFlow: StoryFlow } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const results = []

    for (const scene of storyFlow.scenes) {
      // Update status to generating
      await supabaseClient
        .from('scene_assets')
        .upsert({
          scene_id: scene.id,
          user_id: storyFlow.userId,
          status: 'generating',
          scene_title: scene.title,
          updated_at: new Date().toISOString(),
        })

      try {
        // Generate script
        const script = await generateScript(scene, storyFlow)
        
        // Generate voiceover (optional)
        const audioUrl = await generateVoiceover(script)
        
        // Generate placeholder video URL (replace with actual video generation)
        const videoUrl = `https://images.unsplash.com/photo-1611077541120-4e12cffbcec7?w=400&h=300&fit=crop&q=80&auto=format&sig=${Math.random()}`
        
        // Save completed asset
        const { data, error } = await supabaseClient
          .from('scene_assets')
          .upsert({
            scene_id: scene.id,
            user_id: storyFlow.userId,
            status: 'completed',
            scene_title: scene.title,
            script: script,
            video_url: videoUrl,
            audio_url: audioUrl,
            filename: `${scene.title.replace(/\s+/g, '_')}_AI_Generated.mp4`,
            updated_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (error) throw error

        results.push(data)
      } catch (sceneError) {
        // Mark scene as failed
        await supabaseClient
          .from('scene_assets')
          .upsert({
            scene_id: scene.id,
            user_id: storyFlow.userId,
            status: 'failed',
            scene_title: scene.title,
            error_message: sceneError.message,
            updated_at: new Date().toISOString(),
          })

        console.error(`Failed to generate assets for scene ${scene.id}:`, sceneError)
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
