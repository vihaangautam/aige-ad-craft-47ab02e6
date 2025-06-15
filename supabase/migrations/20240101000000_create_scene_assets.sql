
-- Create scene_assets table for storing AI generated content
CREATE TABLE IF NOT EXISTS scene_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scene_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('generating', 'completed', 'failed')),
  scene_title TEXT NOT NULL,
  script TEXT,
  video_url TEXT,
  audio_url TEXT,
  filename TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(scene_id, user_id)
);

-- Enable RLS
ALTER TABLE scene_assets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own assets" ON scene_assets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assets" ON scene_assets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assets" ON scene_assets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assets" ON scene_assets
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_scene_assets_user_scene ON scene_assets(user_id, scene_id);
CREATE INDEX idx_scene_assets_status ON scene_assets(status);
