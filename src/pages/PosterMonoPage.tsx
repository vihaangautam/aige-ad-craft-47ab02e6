import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

export function PosterMonoPage() {
  const videoUrl = localStorage.getItem("mono_video_url");
  const title = localStorage.getItem("mono_title") || "AIGE MONO Ad";
  const posterRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!posterRef.current) return;
    const node = posterRef.current;
    import("html2canvas").then(html2canvas => {
      html2canvas.default(node).then(canvas => {
        const link = document.createElement("a");
        link.download = "aige-mono-poster.png";
        link.href = canvas.toDataURL();
        link.click();
      });
    });
  };

  const handleShare = async () => {
    if (!posterRef.current) return;
    const node = posterRef.current;
    import("html2canvas").then(html2canvas => {
      html2canvas.default(node).then(async canvas => {
        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve));
        if (blob && navigator.share) {
          const file = new File([blob], "aige-mono-poster.png", { type: blob.type });
          navigator.share({ files: [file], title: title, text: "Check out my AIGE MONO ad!" });
        } else {
          alert("Sharing not supported. Please download instead.");
        }
      });
    });
  };

  if (!videoUrl) {
    return <div className="text-center text-red-500 mt-16">No video found. Please generate an ad first.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-500">
      <div ref={posterRef} className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center relative w-[350px] h-[500px] mb-8">
        <h2 className="text-2xl font-bold text-yellow-500 mb-4 text-center">{title}</h2>
        <div className="flex-1 flex items-center justify-center">
          <QRCodeSVG value={videoUrl} size={180} fgColor="#111" bgColor="#fff" />
        </div>
        <div className="mt-6 text-center text-gray-700 text-sm">Scan to watch the ad!</div>
      </div>
      <div className="flex gap-4">
        <button
          className="bg-yellow-400 text-black font-bold px-6 py-2 rounded-lg shadow hover:bg-yellow-300 transition"
          onClick={handleDownload}
        >
          Download Poster
        </button>
        <button
          className="bg-black text-yellow-400 font-bold px-6 py-2 rounded-lg shadow hover:bg-yellow-700 transition"
          onClick={handleShare}
        >
          Share
        </button>
      </div>
    </div>
  );
}

export default PosterMonoPage;