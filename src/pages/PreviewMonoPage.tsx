import { useNavigate } from "react-router-dom";

export function PreviewMonoPage() {
  const navigate = useNavigate();
  const videoUrl = localStorage.getItem("mono_video_url");
  const title = localStorage.getItem("mono_title") || "AIGE MONO Ad";

  if (!videoUrl) {
    return <div className="text-center text-red-500 mt-16">No video found. Please generate an ad first.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">{title}</h1>
      <video
        src={videoUrl}
        controls
        className="w-full max-w-2xl rounded-lg shadow-lg mb-8"
        poster="/placeholder.svg"
      />
      <button
        className="bg-yellow-400 text-black font-bold px-8 py-3 rounded-lg text-lg shadow hover:bg-yellow-300 transition"
        onClick={() => navigate("/mono/poster")}
      >
        → See Poster
      </button>
    </div>
  );
}

export default PreviewMonoPage; 