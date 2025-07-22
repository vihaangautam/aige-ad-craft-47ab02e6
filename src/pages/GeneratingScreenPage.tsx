import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Player from 'lottie-react';

import TypingAnimation from '../lottie/Typing.json';
import SearchingAnimation from '../lottie/Searching.json';
import AIDataAnimation from '../lottie/AI_data.json';
import CookingAnimation from '../lottie/Cooking.json';
import CodingAnimation from '../lottie/Coding.json';
import { scriptAPI, videoAPI } from '@/lib/auth';

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

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000;

const GeneratingScreenPage: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [script, setScript] = useState<any[]>([]);
  const [operationIds, setOperationIds] = useState({
    opening: null,
    sceneA: null,
    sceneB: null
  });
  const [retryCount, setRetryCount] = useState(0);
  const [videoStatus, setVideoStatus] = useState({
    opening: { status: 'PENDING', url: null },
    sceneA: { status: 'PENDING', url: null },
    sceneB: { status: 'PENDING', url: null }
  });
  const navigate = useNavigate();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Delay the first fetch of /get-latest-script/ by 10 seconds after the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setRetryCount(1); // Start the retry logic after 10 seconds
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  // Retry logic for fetching script
  useEffect(() => {
    let retryTimer: NodeJS.Timeout;
    const tryFetchScript = async () => {
      try {
        const res = await scriptAPI.fetchLatest();
        const fetchedScript = res?.data?.script;
        console.log('[RETRY]', retryCount, 'Fetched script:', fetchedScript);
        if (Array.isArray(fetchedScript) && fetchedScript.length > 0) {
          setScript(fetchedScript);
          // Extract operation IDs if applicable (mock for now)
          const ops = {
            opening: fetchedScript.find((s) => s.scene_id === 'opening_scene') ? 'mock-op-opening' : null,
            sceneA: fetchedScript.find((s) => s.scene_id === 'scene_a') ? 'mock-op-a' : null,
            sceneB: fetchedScript.find((s) => s.scene_id === 'scene_b') ? 'mock-op-b' : null,
          };
          setOperationIds(ops);
          console.log('[✅ SCRIPT READY]', ops);
        } else if (retryCount < MAX_RETRIES) {
          retryTimer = setTimeout(() => setRetryCount((c) => c + 1), RETRY_DELAY_MS);
        } else {
          console.error('❌ Failed to fetch script after retries');
        }
      } catch (err) {
        console.error('[ERROR fetching script]', err);
      }
    };
    if (retryCount > 0) {
      tryFetchScript();
    }
    return () => clearTimeout(retryTimer);
  }, [retryCount]);

  // Start polling when operationIds are set
  useEffect(() => {
    if (operationIds.opening && operationIds.sceneA && operationIds.sceneB) {
      console.log('[🚀 Start polling status]');
      // polling logic will run as before
    }
  }, [operationIds]);

  // STEP 2: Assign operation IDs from script
  const triggerAllVideoGenerations = async (script: any[]) => {
    if (!Array.isArray(script) || script.length === 0) {
      console.warn("❌ Empty or invalid script array");
      return;
    }
    const openingScene = script.find((s) => s.scene_id === 'opening_scene');
    const sceneA = script.find((s) => s.scene_id === 'scene_a');
    const sceneB = script.find((s) => s.scene_id === 'scene_b');
    const [openingRes, sceneARes, sceneBRes] = await Promise.all([
      openingScene ? videoAPI.generate(openingScene.visual) : Promise.resolve({ data: { operation_id: null } }),
      sceneA ? videoAPI.generate(sceneA.visual) : Promise.resolve({ data: { operation_id: null } }),
      sceneB ? videoAPI.generate(sceneB.visual) : Promise.resolve({ data: { operation_id: null } }),
    ]);
    const ops = {
      opening: openingRes.data.operation_id,
      sceneA: sceneARes.data.operation_id,
      sceneB: sceneBRes.data.operation_id,
    };
    setOperationIds(ops);
    console.log('🎥 Assigned operation IDs:', ops);
  };

  useEffect(() => {
    if (script && Array.isArray(script) && script.length > 0) {
      triggerAllVideoGenerations(script);
    }
  }, [script]);

  // STEP 3: Poll for video status
  useEffect(() => {
    const allOpsExist = operationIds.opening && operationIds.sceneA && operationIds.sceneB;
    if (!allOpsExist) return;

    const interval = setInterval(async () => {
      for (const key of ['opening', 'sceneA', 'sceneB'] as const) {
        const opId = operationIds[key];
        if (opId && videoStatus[key].status !== 'SUCCEEDED') {
          try {
            const res = await checkStatus(opId);
            if (res.status === 'SUCCEEDED') {
              setVideoStatus(prev => ({
                ...prev,
                [key]: { status: 'SUCCEEDED', url: res.video_url }
              }));
            }
          } catch (err) {
            console.error(`❌ Error polling status for ${key}`, err);
          }
        }
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [operationIds, videoStatus]);

  // STEP 4: Redirect to preview when all videos are ready
  useEffect(() => {
    const allReady = ['opening', 'sceneA', 'sceneB'].every(
      key => videoStatus[key].status === 'SUCCEEDED'
    );
    if (allReady) {
      const videos = {
        opening_scene: videoStatus.opening.url,
        scene_a: videoStatus.sceneA.url,
        scene_b: videoStatus.sceneB.url,
      };
      localStorage.setItem('generatedVideos', JSON.stringify(videos));
      navigate('/preview');
    }
  }, [videoStatus, navigate]);

  // Debug logging
  useEffect(() => {
    console.log("🆔 operationIds", operationIds);
    console.log("📽️ videoStatus", videoStatus);
  }, [operationIds, videoStatus]);

  // Timer for animation + fallback
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (seconds >= TOTAL_SECONDS) {
      intervalRef.current && clearInterval(intervalRef.current);
      navigate('/preview'); // Always go to preview for testing
    }
  }, [seconds, navigate]);

  const handleStop = () => {
    intervalRef.current && clearInterval(intervalRef.current);
    navigate('/story-config');
  };

  // ⏳ FAKE status checker (replace with real API when ready)
  const checkStatus = async (operationId: string) => {
    try {
      const res = await fetch('/api/status/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation_id: operationId }),
      });
      if (!res.ok) {
        // If 404 or other error, log and return a default object
        console.error(`[STATUS ERROR] ${res.status} for opId ${operationId}`);
        return { status: 'FAILED', video_url: null };
      }
      // Try to parse JSON, handle empty response
      try {
        return await res.json();
      } catch (e) {
        console.error(`[STATUS ERROR] Failed to parse JSON for opId ${operationId}:`, e);
        return { status: 'FAILED', video_url: null };
      }
    } catch (err) {
      console.error(`[STATUS ERROR] Network error for opId ${operationId}:`, err);
      return { status: 'FAILED', video_url: null };
    }
  };

  const progress = Math.min((seconds / TOTAL_SECONDS) * 100, 100);
  const stageIdx = Math.min(Math.floor(seconds / STAGE_SECONDS), STAGES.length - 1);
  const stage = STAGES[stageIdx];

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

      <div style={{ textAlign: 'center', color: '#fff', marginBottom: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 600 }}>{stage.text}</div>
        <div style={{ fontSize: 16, opacity: 0.75, marginTop: 6 }}>{stage.subtext}</div>
      </div>

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
