import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/auth';

export function PreviewPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [script, setScript] = useState<any[]>([]);
  const [currentStage, setCurrentStage] = useState<'opening' | 'choice' | 'scene'>('opening');
  const [selectedScene, setSelectedScene] = useState<'scene_a' | 'scene_b' | null>(null);
  const [selectedOption, setSelectedOption] = useState<'scene_a' | 'scene_b' | null>(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoUrls, setVideoUrls] = useState<{ [key: string]: string | null }>({});

  // Fetch the latest script from backend and merge with video URLs from localStorage
  useEffect(() => {
    setLoading(true);
    const videos = JSON.parse(localStorage.getItem('generatedVideos') || '{}');
    setVideoUrls(videos);
    apiClient.get('/get-latest-script/')
      .then(res => {
        let scriptArr = res.data.script || [];
        // Merge video URLs from localStorage into script
        scriptArr = scriptArr.map((scene: any) => {
          if (scene.scene_id && videos[scene.scene_id]) {
            return { ...scene, videoUrl: videos[scene.scene_id] };
          }
          return scene;
        });
        setScript(scriptArr);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Parse scenes and choice point from script
  const openingScene = script.find((s) => s.scene_id === 'opening_scene');
  const choicePoint = script.find((s) => s.scene_id === 'choice_point');
  const sceneA = script.find((s) => s.scene_id === 'scene_a');
  const sceneB = script.find((s) => s.scene_id === 'scene_b');

  // Handle user choice
  const handleChoice = (choice: 'scene_a' | 'scene_b') => {
    setSelectedScene(choice);
    setSelectedOption(choice);
    setCurrentStage('scene');
    setVideoLoading(true);
  };

  // Navigation logic
  const handleBack = () => {
    if (currentStage === 'scene') {
      setCurrentStage('choice');
    } else if (currentStage === 'choice') {
      setCurrentStage('opening');
    }
  };

  // Video loading feedback
  const handleVideoLoadStart = () => setVideoLoading(true);
  const handleVideoLoaded = () => setVideoLoading(false);

  const videoContainerClass = "flex items-center justify-center w-full h-[calc(100vh-120px)] min-h-[400px] max-h-[90vh]";
  const videoClass = "w-auto h-full max-h-full aspect-[9/16] object-cover rounded-xl mx-auto shadow-lg bg-black";

  // Render content for each stage
  const renderContent = () => {
    if (loading) {
      return <div className="text-lg text-gray-500">Loading preview...</div>;
    }
    if (currentStage === 'opening') {
      return (
        <div className="w-full flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold mb-2">Opening Scene</h2>
          {openingScene?.videoUrl ? (
            <div className={videoContainerClass}>
              {videoLoading && <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 text-white">Loading video...</div>}
              <video
                src={openingScene.videoUrl}
                controls={false}
                autoPlay
                onEnded={() => setCurrentStage('choice')}
                onLoadStart={handleVideoLoadStart}
                onLoadedData={handleVideoLoaded}
                className={videoClass}
                style={{ aspectRatio: '9/16' }}
              />
            </div>
          ) : (
            <div className="text-red-500">No video found for Opening Scene.</div>
          )}
        </div>
      );
    }
    if (currentStage === 'choice') {
      return (
        <div className="flex flex-col items-center space-y-6 w-full max-w-[400px] px-2 mx-auto">
          <h2 className="text-xl font-semibold mb-2">Choose Your Path</h2>
          <div className="flex flex-col gap-4 w-full">
            <button
              className={`w-full px-6 py-4 rounded-lg font-bold border-2 text-lg transition-all duration-200 ${selectedOption === 'scene_a' ? 'bg-blue-500 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-400 hover:bg-blue-50'}`}
              onClick={() => handleChoice('scene_a')}
            >
              {choicePoint?.option_a_text || 'Option 1'}
            </button>
            <button
              className={`w-full px-6 py-4 rounded-lg font-bold border-2 text-lg transition-all duration-200 ${selectedOption === 'scene_b' ? 'bg-green-500 text-white border-green-600' : 'bg-white text-green-700 border-green-400 hover:bg-green-50'}`}
              onClick={() => handleChoice('scene_b')}
            >
              {choicePoint?.option_b_text || 'Option 2'}
            </button>
          </div>
        </div>
      );
    }
    if (currentStage === 'scene' && selectedScene) {
      const videoSrc = selectedScene === 'scene_a' ? sceneA?.videoUrl : sceneB?.videoUrl;
      return (
        <div className="w-full flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold mb-2">
            {selectedScene === 'scene_a' ? 'Scene A' : 'Scene B'}
          </h2>
          {videoSrc ? (
            <div className={videoContainerClass}>
              {videoLoading && <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 text-white">Loading video...</div>}
              <video
                src={videoSrc}
                controls
                autoPlay
                onLoadStart={handleVideoLoadStart}
                onLoadedData={handleVideoLoaded}
                className={videoClass}
                style={{ aspectRatio: '9/16' }}
              />
            </div>
          ) : (
            <div className="text-red-500">No video found for selected scene.</div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-0">
      <h1 className="text-3xl font-bold mb-6 text-yellow-500 text-center">Preview Your Interactive Ad</h1>
      {renderContent()}
      <div className="mt-10 flex space-x-4 justify-center w-full max-w-[400px] mx-auto">
        {currentStage !== 'opening' && (
          <button
            className="px-6 py-3 bg-gray-300 text-black font-bold rounded-xl shadow hover:bg-gray-200 w-full"
            onClick={handleBack}
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
