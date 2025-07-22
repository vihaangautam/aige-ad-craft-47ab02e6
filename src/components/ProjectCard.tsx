
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

interface ProjectCardProps {
  id: string;
  title: string;
  type: string;
  status: "active" | "draft" | "paused";
  thumbnail: string;
  lastModified: string;
  views: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const typeEmoji: Record<string, string> = {
  "Immersive Story AR": "🎬",
  "Virtual Try-On": "🛍️",
  "Game AR": "🎮",
  "Poster AR": "🖼️",
};

const ProjectCard = ({ id, title, type, status, thumbnail, lastModified, views, onEdit, onDelete }: ProjectCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700 border-green-200";
      case "draft": return "bg-gray-200 text-gray-700 border-gray-300";
      case "paused": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-gray-200 text-gray-700 border-gray-300";
    }
  };

  return (
    <Card className="h-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
      <CardContent className="p-4 flex flex-col h-full">
        {/* Thumbnail + Emoji */}
        <div className="relative aspect-video bg-gray-100 rounded-xl mb-4 flex items-center justify-center border border-gray-200 overflow-hidden">
          {thumbnail ? (
            <img src={thumbnail} alt={title} className="w-full h-full object-cover rounded-xl" />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <span className="text-3xl mb-1">{typeEmoji[type] || "📁"}</span>
              <span className="text-gray-400 text-xs">No preview</span>
            </div>
          )}
          {/* Project type emoji overlay */}
          <span className="absolute top-2 left-2 text-2xl bg-white/80 rounded-full p-1 shadow">{typeEmoji[type] || "📁"}</span>
        </div>
        <div className="space-y-2 flex-1">
          <div>
            <h3 className="font-semibold text-lg text-black truncate">{title}</h3>
            <p className="text-xs text-gray-500">{type}</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <Badge className={getStatusColor(status) + " border px-2 py-0.5 rounded-full text-xs font-semibold capitalize"}>
              {status}
            </Badge>
            <span className="text-xs text-gray-400">{views.toLocaleString()} views</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Modified {lastModified}</p>
        </div>
        <div className="flex justify-end gap-1 mt-4">
          <Button variant="outline" size="icon" onClick={() => onEdit(id)} className="hover:bg-yellow-100">
            <Edit className="w-4 h-4 text-yellow-500" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onDelete(id)} className="hover:bg-red-100">
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
