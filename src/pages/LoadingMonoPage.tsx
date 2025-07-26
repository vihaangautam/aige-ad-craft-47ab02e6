import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function LoadingMonoPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const script = localStorage.getItem("mono_script");
    const prompt = localStorage.getItem("mono_prompt");
    if (!script || !prompt) {
      setError("Missing script or prompt");
      return;
    }
    let generationId = "";
    let polling = true;
    // Start video generation
    fetch("/generate-video/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ script }),
    })
      .then(res => res.json())
      .then(data => {
        generationId = data.generation_id;
        pollStatus();
      })
      .catch(() => setError("Failed to start video generation"));

    function pollStatus() {
      let elapsed = 0;
      const interval = setInterval(() => {
        if (!polling) return clearInterval(interval);
        elapsed += 5;
        setProgress(Math.min(100, (elapsed / 120) * 100));
        fetch(`/status/?generation_id=${generationId}`)
          .then(res => res.json())
          .then(data => {
            if (data.status === "ready" && data.video_url) {
              polling = false;
              clearInterval(interval);
              // Save all info
              localStorage.setItem("mono_video_url", data.video_url);
              localStorage.setItem("mono_generation_id", generationId);
              localStorage.setItem("mono_title", data.title || "AIGE MONO Ad");
              navigate("/mono/preview");
            }
          })
          .catch(() => {});
        if (elapsed >= 120) {
          polling = false;
          clearInterval(interval);
          setError("Video generation timed out");
        }
      }, 5000);
    }
    return () => { polling = false; };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-yellow-400">
      <h1 className="text-2xl font-bold mb-6">Generating your ad video...</h1>
      <div className="w-64 h-4 bg-gray-800 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-yellow-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-gray-400">This may take up to 2 minutes. Please wait...</p>
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
}

export default LoadingMonoPage; 