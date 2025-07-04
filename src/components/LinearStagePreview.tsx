import React, { useState } from 'react';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const stages = [
  {
    label: 'Stage 1: Opening Scene',
    type: 'video',
    src: `${backendUrl}/media/videos/Untitled design.mp4`,
  },
  {
    label: 'Stage 2: Choose Your Path',
    type: 'choice',
    options: ['Give Her a Gift', 'Host a Date Night'],
  },
  {
    label: 'Stage 3: Option-Based Video',
    type: 'video',
    src: `${backendUrl}/media/videos/Untitled design (1).mp4`, // Example, update as needed
  },
  {
    label: 'Stage 4: Game Simulation',
    type: 'video',
    src: `${backendUrl}/media/videos/20250704_0057_Chocolate Memory Game_simple_compose_01jz8w3f2cf2j9bxdsbq20n14n.mp4`,
  },
  {
    label: 'Stage 5: Final Scene',
    type: 'video',
    src: `${backendUrl}/media/videos/Untitled design (3).mp4`,
  },
];

type Stage = typeof stages[number];

const aspectRatio = 9 / 16;

const LinearStagePreview: React.FC = () => {
  const [stageIndex, setStageIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [debug, setDebug] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  const stage = stages[stageIndex];

  const handleNext = () => {
    if (stageIndex < stages.length - 1) {
      setStageIndex(stageIndex + 1);
      setVideoError(false);
      setVideoEnded(false);
    }
  };

  const handleBack = () => {
    if (stageIndex > 0) {
      setStageIndex(stageIndex - 1);
      setVideoError(false);
      setVideoEnded(false);
    }
  };

  const handleOption = (option: 'A' | 'B') => {
    setSelectedOption(option);
  };

  const handleReplay = () => {
    setStageIndex(0);
    setSelectedOption(null);
    setVideoError(false);
    setVideoEnded(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header Bar */}
      <header className="bg-white text-black text-center py-2 px-4 shadow sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-xs mx-auto">
          {/* Back Button */}
          <button
            className="text-2xl px-2 disabled:opacity-30"
            onClick={handleBack}
            disabled={stageIndex === 0}
            aria-label="Back"
          >
            ←
          </button>
          <span className="flex-1 font-semibold text-base truncate">
            {stage.label}
          </span>
          {/* Debug Toggle */}
          <button
            className="text-xs px-2 text-gray-400 hover:text-gray-700"
            onClick={() => setDebug((d) => !d)}
            aria-label="Toggle Debug"
          >
            {debug ? '🐞' : '⋯'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <div
          className="relative w-full flex flex-col items-center justify-center"
          style={{ minHeight: 'calc(100vh - 56px)' }}
        >
          {/* Video Stage */}
          {stage.type === 'video' && (
            <div className="w-full max-w-xs mx-auto aspect-[9/16] bg-black flex items-center justify-center rounded-lg overflow-hidden shadow-lg">
              {!videoError ? (
                <video
                  key={stage.src}
                  src={stage.src}
                  className="w-full h-full object-contain"
                  autoPlay
                  controls
                  onError={() => setVideoError(true)}
                  onEnded={() => setVideoEnded(true)}
                >
                  Sorry, your browser does not support embedded videos.
                </video>
              ) : (
                <div className="text-white text-center p-4">
                  <p>Video failed to load.</p>
                  <button
                    className="mt-2 px-3 py-1 bg-white text-black rounded shadow"
                    onClick={() => setVideoError(false)}
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Choice Stage */}
          {stage.type === 'choice' && (
            <div className="flex flex-col items-center gap-6 w-full max-w-xs mx-auto">
              <div className="flex flex-row gap-4 w-full justify-center mt-8">
                {stage.options.map((opt, idx) => (
                  <button
                    key={opt}
                    className={`flex-1 px-4 py-3 rounded-lg text-lg font-medium border-2 transition-colors duration-150 ${selectedOption === (idx === 0 ? 'A' : 'B')
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-black border-gray-300 hover:border-blue-400'}`}
                    onClick={() => handleOption(idx === 0 ? 'A' : 'B')}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {selectedOption && (
                <div className="text-sm text-gray-500">Selected: Option {selectedOption}</div>
              )}
            </div>
          )}

          {/* Final Stage Message */}
          {stageIndex === stages.length - 1 && videoEnded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 rounded-lg">
              <div className="text-white text-xl font-bold mb-4">Ad Complete!</div>
              <button
                className="px-4 py-2 bg-white text-black rounded shadow"
                onClick={handleReplay}
              >
                Replay?
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Navigation Buttons */}
      <div className="fixed bottom-4 right-4 z-20">
        <button
          className="bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg disabled:opacity-40"
          onClick={handleNext}
          disabled={stageIndex === stages.length - 1}
          aria-label="Next"
        >
          →
        </button>
      </div>

      {/* Optional Debug Info */}
      {debug && (
        <div className="fixed bottom-4 left-4 bg-white/90 text-xs p-2 rounded shadow z-30 max-w-xs">
          <div>stageIndex: {stageIndex}</div>
          <div>selectedOption: {selectedOption ?? 'null'}</div>
          <div>videoError: {videoError ? 'true' : 'false'}</div>
        </div>
      )}
    </div>
  );
};

export default LinearStagePreview; 