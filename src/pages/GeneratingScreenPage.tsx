import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Player from 'lottie-react';

import TypingAnimation from '../lottie/Typing.json';
import SearchingAnimation from '../lottie/Searching.json';
import AIDataAnimation from '../lottie/AI_data.json';
import CookingAnimation from '../lottie/Cooking.json';
import CodingAnimation from '../lottie/Coding.json';

const STAGES = [
  {
    animationData: TypingAnimation,
    text: 'Typing with cinematic flair...',
    subtext: 'No typos, only tension.',
  },
  {
    animationData: SearchingAnimation,
    text: 'Searching the storyverse...',
    subtext: 'Looking for drama, tears, and climax.',
  },
  {
    animationData: AIDataAnimation,
    text: 'Feeding your ideas to the AI brain...',
    subtext: 'Let’s cook something epic.',
  },
  {
    animationData: CookingAnimation,
    text: 'Cooking plot twists...',
    subtext: 'With extra spice and suspense.',
  },
  {
    animationData: CodingAnimation,
    text: 'Stitching scenes and sealing vibes...',
    subtext: 'Almost ready for the final cut.',
  },
];

const TOTAL_SECONDS = 240;
const STAGE_SECONDS = TOTAL_SECONDS / STAGES.length;

const GeneratingScreenPage: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const navigate = useNavigate();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const progress = Math.min((seconds / TOTAL_SECONDS) * 100, 100);
  const stageIdx = Math.min(Math.floor(seconds / STAGE_SECONDS), STAGES.length - 1);
  const stage = STAGES[stageIdx];

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (seconds >= TOTAL_SECONDS) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      navigate('/preview');
    }
  }, [seconds, navigate]);

  const handleStop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    navigate('/story-config');
  };

  return (
    <div
      style={{
        height: '100vh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 16px',
      }}
    >
      {/* Animation */}
      <div
        style={{
          width: 320,
          height: 320,
          background: '#111',
          borderRadius: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
          boxShadow: '0 0 24px #facc1560',
        }}
      >
        <Player
          autoplay
          loop
          animationData={stage.animationData}
          style={{ width: 240, height: 240 }}
        />
      </div>

      {/* Captions */}
      <div style={{ textAlign: 'center', color: '#fff', marginBottom: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 600 }}>{stage.text}</div>
        <div style={{ fontSize: 16, opacity: 0.75, marginTop: 6 }}>{stage.subtext}</div>
      </div>

      {/* Progress Bar (now here) */}
      <div style={{ width: '80%', maxWidth: 500, marginBottom: 36 }}>
        <div style={{ height: 10, background: '#222', borderRadius: 5, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: '#facc15',
              transition: 'width 1s linear',
            }}
          />
        </div>
        <div style={{ textAlign: 'right', color: '#fff', fontSize: 14, marginTop: 4 }}>
          {Math.round(progress)}%
        </div>
      </div>

      {/* Stop Button */}
      <button
        onClick={handleStop}
        style={{
          background: '#facc15',
          color: '#000',
          border: 'none',
          borderRadius: 12,
          padding: '14px 28px',
          fontSize: 18,
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}
      >
        ✖ Stop Generation
      </button>
    </div>
  );
};

export default GeneratingScreenPage;
