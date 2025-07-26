import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CreateMonoPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/generate-script/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error("Script generation failed");
      const data = await res.json();
      localStorage.setItem("mono_script", data.script);
      localStorage.setItem("mono_prompt", prompt);
      navigate("/mono/loading");
    } catch (e) {
      alert("Failed to generate script");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-4 text-yellow-400">AIGE MONO: Create Your Ad</h1>
      <textarea
        className="w-full h-32 p-3 rounded-lg border border-gray-700 bg-gray-900 text-white mb-4 resize-none focus:outline-yellow-400"
        placeholder="Describe your creative idea..."
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        disabled={loading}
      />
      <Button
        className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg"
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
      >
        {loading ? "Generating..." : "Generate Ad"}
      </Button>
    </div>
  );
}

export default CreateMonoPage; 