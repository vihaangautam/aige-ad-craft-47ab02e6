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
        console.log('🔍 Detailed scene analysis:');
        parsedFlow.scenes.forEach((scene, index) => {
          console.log(`Scene ${index + 1} (ID: ${scene.id}):`, {
            title: scene.title,
            optionA_videoURL: scene.optionA.videoURL,
            optionA_hasVideo: !!scene.optionA.videoURL,
            optionA_isBlobURL: scene.optionA.videoURL.startsWith('blob:'),
            optionB_videoURL: scene.optionB.videoURL,
            optionB_hasVideo: !!scene.optionB.videoURL,
            optionB_isBlobURL: scene.optionB.videoURL.startsWith('blob:')
          });
        });
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
        
        // Try to find a valid video URL from either option
        let videoURL = '';
        let selectedOption = 'A';
        
        if (scene.optionA.videoURL && scene.optionA.videoURL.trim() !== '') {
          videoURL = scene.optionA.videoURL;
          selectedOption = 'A';
        } else if (scene.optionB.videoURL && scene.optionB.videoURL.trim() !== '') {
          videoURL = scene.optionB.videoURL;
          selectedOption = 'B';
        }
        
        console.log(`🎬 Selected option ${selectedOption} with video URL:`, videoURL);
        console.log('🔍 Video URL details:', {
          isEmpty: videoURL === '',
          length: videoURL.length,
          startsWithBlob: videoURL.startsWith('blob:'),
          fullURL: videoURL
        });
        
        // Validate video URL
        if (videoURL && videoURL.trim() !== '') {
          if (videoURL.startsWith('blob:') || videoURL.startsWith('http')) {
            console.log('✅ Valid video URL detected');
            setCurrentVideoURL(videoURL);
            setVideoError(null);
          } else {
            console.warn('⚠️ Invalid video URL format:', videoURL);
            setVideoError('Invalid video URL format');
          }
        } else {
          console.warn('⚠️ No valid video URL found in scene');
          setVideoError('No video available for this scene');
        }
        
        // Clean up previous blob URL
        if (previousBlobURL && previousBlobURL !== videoURL) {
          console.log('🧹 Revoking previous blob URL:', previousBlobURL);
          URL.revokeObjectURL(previousBlobURL);
        }
        setPreviousBlobURL(videoURL);
        
        if (videoURL && videoURL.trim() !== '') {
          setIsVideoPlaying(true);
          setShowChoices(false);
        } else {
          // If no video, show choices immediately or exit if no more scenes
          setIsVideoPlaying(false);
          // If no video, always attempt to show choices.
          // handleOptionSelect will determine if onExit should be called based on the chosen option.
          console.log("No video for current scene. Attempting to show choices.");
          setShowChoices(true);
        }
      } else {
        console.error('❌ Scene not found:', currentSceneId);
      }
    }
  }, [storyFlow, currentSceneId, onExit]);

  // Handle video load success
  const handleVideoLoadStart = () => {
    console.log('🎬 Video loading started');
    setVideoError(null);
  };

  // Handle video load error
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('❌ Video failed to load:', e);
    console.error('❌ Video element src:', videoRef.current?.src);
    setVideoError('Failed to load video');
    setIsVideoPlaying(false);
  };

  // Handle video end - show choice buttons or exit
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
      // This means neither option A nor B directly links to a *new* scene ID.
      // However, the current scene itself might have defined option labels,
      // implying choices should be presented to the user.
      // By removing onExit(), we allow the UI to persist.
      // setShowChoices(true) ensures that if choices are available, they are shown.
      // handleOptionSelect will then handle onExit() if a chosen option has no nextSceneId.
      console.log("Video ended. No direct nextSceneId for A or B. Attempting to show choices.");
      setShowChoices(true);
    } else {
      // At least one option has a nextSceneId, so show choices.
      console.log('🔀 Video ended. Showing choice buttons for scenes with nextSceneId.');
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
      // No next scene, story complete - exit directly
      console.log('🎉 Story complete - selected option has no next scene, exiting...');
      onExit();
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
        <div className="w-full flex justify-center">
          <div
            className="aspect-[9/16] w-full max-w-[360px] bg-black flex items-center justify-center rounded-lg shadow-lg overflow-hidden"
          >
            {/* Video Error State */}
            {videoError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2 absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <AlertTriangle className="w-5 h-5" />
                <span>{videoError}</span>
                <Button 
                  onClick={() => {
                    console.log('🔄 User clicked retry, showing available options...');
                    setVideoError(null);
                    setShowChoices(true);
                  }}
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                >
                  Skip to Choices
                </Button>
              </div>
            )}

            {/* Video Player */}
            {currentVideoURL && !videoError && (
              <video
                ref={videoRef}
                key={`${currentSceneId}-video`}
                className="w-full h-full object-cover"
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
            {(!currentVideoURL || videoError) && !showChoices && (
              <div className="w-full h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                  <p className="text-lg font-semibold mb-2">Could not load video</p>
                  <p className="text-gray-400 mb-4">The video file may be corrupted or unavailable.</p>
                  <Button 
                    onClick={() => {
                      console.log('🔄 User clicked proceed without video');
                      setShowChoices(true);
                      setVideoError(null);
                    }}
                    className="bg-yellow-400 hover:bg-yellow-300 text-black"
                  >
                    Proceed to Choices
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
