
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';

// Types for the story flow structure
interface StoryOption {
  label: string;
  videoURL: string;
  nextSceneId: string | null;
}

interface StoryScene {
  id: string;
  title: string;
  videoURL?: string;
  optionA?: StoryOption;
  optionB?: StoryOption;
}

interface StoryFlow {
  scenes: StoryScene[];
  startingSceneId: string;
  title?: string;
}

interface PreviewPlayerProps {
  onBack?: () => void;
}

export function PreviewPlayer({ onBack }: PreviewPlayerProps) {
  const [storyFlow, setStoryFlow] = useState<StoryFlow | null>(null);
  const [currentSceneId, setCurrentSceneId] = useState<string>('');
  const [currentScene, setCurrentScene] = useState<StoryScene | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [isStoryComplete, setIsStoryComplete] = useState(false);
  const [visitedScenes, setVisitedScenes] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Load story flow from localStorage on component mount
  useEffect(() => {
    try {
      const savedFlow = localStorage.getItem('aige_current_flow');
      if (!savedFlow) {
        setError('No story flow found. Please create a story first.');
        return;
      }

      const parsedFlow: StoryFlow = JSON.parse(savedFlow);
      if (!parsedFlow.scenes || parsedFlow.scenes.length === 0) {
        setError('Invalid story flow - no scenes found.');
        return;
      }

      setStoryFlow(parsedFlow);
      setCurrentSceneId(parsedFlow.startingSceneId || parsedFlow.scenes[0].id);
    } catch (err) {
      setError('Failed to load story flow. Invalid data format.');
      console.error('Error loading story flow:', err);
    }
  }, []);

  // Update current scene when scene ID changes
  useEffect(() => {
    if (!storyFlow || !currentSceneId) return;

    const scene = storyFlow.scenes.find(s => s.id === currentSceneId);
    if (!scene) {
      setError(`Scene "${currentSceneId}" not found.`);
      return;
    }

    setCurrentScene(scene);
    setShowChoices(false);
    setIsVideoPlaying(false);
    
    // Add to visited scenes if not already there
    setVisitedScenes(prev => 
      prev.includes(currentSceneId) ? prev : [...prev, currentSceneId]
    );
  }, [currentSceneId, storyFlow]);

  // Auto-play video when scene changes
  useEffect(() => {
    if (currentScene?.videoURL && videoRef.current) {
      const video = videoRef.current;
      
      const handleCanPlay = () => {
        video.play().then(() => {
          setIsVideoPlaying(true);
        }).catch(err => {
          console.error('Error playing video:', err);
          // If autoplay fails, show play button
          setShowChoices(true);
        });
      };

      const handleVideoEnd = () => {
        setIsVideoPlaying(false);
        
        // Check if this scene has choices
        if (currentScene.optionA || currentScene.optionB) {
          setShowChoices(true);
        } else {
          // No choices available - story is complete
          setIsStoryComplete(true);
        }
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('ended', handleVideoEnd);

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, [currentScene]);

  // Handle choice selection
  const handleChoiceSelect = (option: StoryOption) => {
    if (!option.nextSceneId) {
      setIsStoryComplete(true);
      return;
    }

    setCurrentSceneId(option.nextSceneId);
  };

  // Restart the story
  const handleRestart = () => {
    if (!storyFlow) return;
    
    setCurrentSceneId(storyFlow.startingSceneId || storyFlow.scenes[0].id);
    setIsStoryComplete(false);
    setVisitedScenes([]);
    setError('');
  };

  // Calculate progress based on visited scenes
  const progressPercentage = storyFlow 
    ? (visitedScenes.length / storyFlow.scenes.length) * 100 
    : 0;

  // Loading state
  if (!storyFlow && !error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading story...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Story Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={onBack} className="bg-yellow-400 hover:bg-yellow-300 text-black">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Story complete state
  if (isStoryComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Story Complete!</h2>
          <p className="text-gray-600 mb-8">
            You've experienced the full interactive story. Thank you for participating!
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={handleRestart}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
            
            {onBack && (
              <Button 
                onClick={onBack}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Editor
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header with progress */}
      <div className="bg-gray-900 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button 
              onClick={onBack}
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit Preview
            </Button>
          )}
          
          <div className="text-white">
            <h1 className="font-bold">{storyFlow?.title || 'Interactive Story'}</h1>
            <p className="text-sm text-gray-400">
              Scene: {currentScene?.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-white">
          <span className="text-sm">Progress: {Math.round(progressPercentage)}%</span>
          <div className="w-32">
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main video area */}
      <div className="flex-1 flex items-center justify-center relative">
        {currentScene?.videoURL ? (
          <div className="relative w-full max-w-4xl mx-auto">
            <video
              ref={videoRef}
              key={currentScene.id} // Force re-render when scene changes
              src={currentScene.videoURL}
              className="w-full aspect-video rounded-lg shadow-2xl"
              controls={false}
              playsInline
              muted={false}
            >
              Your browser does not support the video tag.
            </video>

            {/* Video overlay for manual play if needed */}
            {!isVideoPlaying && !showChoices && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <Button
                  onClick={() => videoRef.current?.play()}
                  size="lg"
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Play Video
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-white">
            <p className="text-xl mb-4">No video available for this scene</p>
            <p className="text-gray-400">{currentScene?.title}</p>
          </div>
        )}
      </div>

      {/* Choice buttons */}
      {showChoices && (currentScene?.optionA || currentScene?.optionB) && (
        <div className="p-8 bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-white text-xl font-semibold mb-6 text-center">
              What happens next?
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {currentScene.optionA && (
                <Button
                  onClick={() => handleChoiceSelect(currentScene.optionA!)}
                  className="h-auto p-6 bg-blue-600 hover:bg-blue-700 text-white text-left flex-col items-start space-y-2"
                >
                  <span className="text-sm text-blue-200">Option A</span>
                  <span className="text-lg font-semibold">{currentScene.optionA.label}</span>
                </Button>
              )}
              
              {currentScene.optionB && (
                <Button
                  onClick={() => handleChoiceSelect(currentScene.optionB!)}
                  className="h-auto p-6 bg-purple-600 hover:bg-purple-700 text-white text-left flex-col items-start space-y-2"
                >
                  <span className="text-sm text-purple-200">Option B</span>
                  <span className="text-lg font-semibold">{currentScene.optionB.label}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Scene breadcrumb */}
      <div className="bg-gray-800 px-4 py-2">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm text-gray-400">
          <span>Path:</span>
          {visitedScenes.map((sceneId, index) => {
            const scene = storyFlow?.scenes.find(s => s.id === sceneId);
            return (
              <React.Fragment key={sceneId}>
                {index > 0 && <span>→</span>}
                <span className={sceneId === currentSceneId ? 'text-yellow-400 font-medium' : ''}>
                  {scene?.title || sceneId}
                </span>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
