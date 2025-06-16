
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ChevronRight, AlertTriangle } from 'lucide-react';

// Data structure for scene nodes from localStorage
interface SceneNode {
  id: string;
  title: string;
  description?: string;
  optionA: {
    label: string;
    videoURL: string; // blob URL
    nextSceneId: string | null;
  };
  optionB: {
    label: string;
    videoURL: string; // blob URL
    nextSceneId: string | null;
  };
}

interface StoryFlow {
  scenes: SceneNode[];
  openingSceneId: string;
}

interface PreviewPlayerProps {
  onExit: () => void;
}

export function PreviewPlayer({ onExit }: PreviewPlayerProps) {
  const [storyFlow, setStoryFlow] = useState<StoryFlow | null>(null);
  const [currentSceneId, setCurrentSceneId] = useState<string | null>(null);
  const [currentScene, setCurrentScene] = useState<SceneNode | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [isStoryComplete, setIsStoryComplete] = useState(false);
  const [scenePath, setScenePath] = useState<string[]>([]);
  const [currentVideoURL, setCurrentVideoURL] = useState<string>('');
  const [videoError, setVideoError] = useState<string | null>(null);
  const [previousBlobURL, setPreviousBlobURL] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Load story flow from localStorage on component mount
  useEffect(() => {
    console.log('🎬 Loading story flow from localStorage...');
    const savedFlow = localStorage.getItem('aige_current_flow');
    if (savedFlow) {
      try {
        const parsedFlow: StoryFlow = JSON.parse(savedFlow);
        console.log('✅ Story flow loaded:', parsedFlow);
        setStoryFlow(parsedFlow);
        setCurrentSceneId(parsedFlow.openingSceneId);
        setScenePath([parsedFlow.openingSceneId]);
      } catch (error) {
        console.error('❌ Failed to parse story flow from localStorage:', error);
      }
    } else {
      console.warn('⚠️ No story flow found in localStorage');
    }
  }, []);

  // Update current scene and video when currentSceneId changes
  useEffect(() => {
    if (storyFlow && currentSceneId) {
      const scene = storyFlow.scenes.find(s => s.id === currentSceneId);
      if (scene) {
        console.log(`🎥 Loading scene "${scene.title}" (ID: ${currentSceneId})`);
        setCurrentScene(scene);
        
        // Always start with optionA video for the scene
        const videoURL = scene.optionA.videoURL;
        console.log('🎬 Setting video URL:', videoURL);
        
        // Validate blob URL
        if (videoURL && videoURL.startsWith('blob:')) {
          console.log('✅ Valid blob URL detected');
          setCurrentVideoURL(videoURL);
          setVideoError(null);
        } else {
          console.warn('⚠️ Invalid or missing video URL:', videoURL);
          setVideoError('Invalid video URL');
        }
        
        // Clean up previous blob URL
        if (previousBlobURL && previousBlobURL !== videoURL) {
          console.log('🧹 Revoking previous blob URL:', previousBlobURL);
          URL.revokeObjectURL(previousBlobURL);
        }
        setPreviousBlobURL(videoURL);
        
        setIsVideoPlaying(true);
        setShowChoices(false);
        setVideoError(null);
      } else {
        console.error('❌ Scene not found:', currentSceneId);
      }
    }
  }, [storyFlow, currentSceneId]);

  // Handle video load success
  const handleVideoLoadStart = () => {
    console.log('🎬 Video loading started');
    setVideoError(null);
  };

  // Handle video load error
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('❌ Video failed to load:', e);
    setVideoError('Failed to load video');
    setIsVideoPlaying(false);
  };

  // Handle video end - show choice buttons
  const handleVideoEnd = () => {
    console.log('🏁 Video ended, checking for next options...');
    setIsVideoPlaying(false);
    
    if (!currentScene) return;
    
    // Check if this scene has valid next scenes
    const hasValidNextA = currentScene.optionA.nextSceneId;
    const hasValidNextB = currentScene.optionB.nextSceneId;
    
    console.log('Next scene options:', {
      optionA: hasValidNextA,
      optionB: hasValidNextB
    });
    
    if (!hasValidNextA && !hasValidNextB) {
      // Story is complete
      console.log('🎉 Story complete - no more scenes');
      setIsStoryComplete(true);
    } else {
      // Show choice buttons
      console.log('🔀 Showing choice buttons');
      setShowChoices(true);
    }
  };

  // Handle option selection
  const handleOptionSelect = (option: 'A' | 'B') => {
    if (!currentScene) return;
    
    console.log(`🎯 User selected option ${option}`);
    
    const nextSceneId = option === 'A' 
      ? currentScene.optionA.nextSceneId 
      : currentScene.optionB.nextSceneId;
    
    if (nextSceneId) {
      console.log(`➡️ Moving to next scene: ${nextSceneId}`);
      setCurrentSceneId(nextSceneId);
      setScenePath(prev => [...prev, nextSceneId]);
    } else {
      // No next scene, story complete
      console.log('🎉 Story complete - selected option has no next scene');
      setIsStoryComplete(true);
    }
  };

  // Render breadcrumb path
  const renderBreadcrumb = () => {
    if (scenePath.length <= 1) return null;
    
    return (
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
        {scenePath.map((sceneId, index) => (
          <div key={sceneId} className="flex items-center gap-2">
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              Scene {index + 1}
            </span>
            {index < scenePath.length - 1 && <ChevronRight className="w-4 h-4" />}
          </div>
        ))}
      </div>
    );
  };

  // Loading state
  if (!storyFlow || !currentScene) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Loading Story...</h2>
            <p className="text-gray-600">
              {!storyFlow ? 'No story flow found in storage.' : 'Preparing your experience...'}
            </p>
            <Button onClick={onExit} variant="outline" className="mt-4">
              Back to Builder
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Story complete state
  if (isStoryComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🎉</span>
            </div>
            <h2 className="text-2xl font-bold text-black mb-4">
              Thanks for Watching!
            </h2>
            <p className="text-gray-600 mb-6">
              You've completed this interactive story experience.
            </p>
            {renderBreadcrumb()}
            <div className="flex gap-3 justify-center">
              <Button onClick={onExit} variant="outline">
                Back to Builder
              </Button>
              <Button 
                onClick={() => {
                  console.log('🔄 Restarting story from beginning');
                  setCurrentSceneId(storyFlow.openingSceneId);
                  setScenePath([storyFlow.openingSceneId]);
                  setIsStoryComplete(false);
                }}
                className="bg-yellow-400 hover:bg-yellow-300 text-black"
              >
                Watch Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-black">Story Preview</h1>
            <p className="text-gray-600 text-sm">{currentScene.title}</p>
          </div>
          <Button onClick={onExit} variant="outline">
            Exit Preview
          </Button>
        </div>
        {renderBreadcrumb()}
      </div>

      {/* Video Player */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          {/* Video Error State */}
          {videoError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span>{videoError}</span>
            </div>
          )}

          {/* Video Player */}
          {currentVideoURL && !videoError && (
            <video
              ref={videoRef}
              key={`${currentSceneId}-video`}
              className="w-full aspect-video rounded-lg shadow-lg"
              autoPlay
              controls
              onEnded={handleVideoEnd}
              onLoadStart={handleVideoLoadStart}
              onError={handleVideoError}
              src={currentVideoURL}
            >
              Your browser does not support the video tag.
            </video>
          )}

          {/* Fallback message when no video */}
          {(!currentVideoURL || videoError) && (
            <div className="w-full aspect-video rounded-lg shadow-lg bg-gray-800 flex items-center justify-center text-white">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                <p className="text-lg font-semibold mb-2">Could not load video</p>
                <p className="text-gray-400">The video file may be corrupted or unavailable.</p>
              </div>
            </div>
          )}

          {/* Choice Buttons */}
          {showChoices && !isVideoPlaying && (
            <div className="mt-8 space-y-4">
              <h3 className="text-white text-xl font-semibold text-center mb-6">
                What happens next?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option A */}
                {currentScene.optionA.nextSceneId && (
                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                    onClick={() => handleOptionSelect('A')}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold">A</span>
                      </div>
                      <h4 className="font-semibold text-lg mb-2">
                        {currentScene.optionA.label}
                      </h4>
                      <ArrowRight className="w-5 h-5 mx-auto text-gray-400" />
                    </CardContent>
                  </Card>
                )}

                {/* Option B */}
                {currentScene.optionB.nextSceneId && (
                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                    onClick={() => handleOptionSelect('B')}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold">B</span>
                      </div>
                      <h4 className="font-semibold text-lg mb-2">
                        {currentScene.optionB.label}
                      </h4>
                      <ArrowRight className="w-5 h-5 mx-auto text-gray-400" />
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
