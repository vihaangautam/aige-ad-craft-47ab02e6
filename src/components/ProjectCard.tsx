
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Edit, Trash2 } from "lucide-react";

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

const ProjectCard = ({ id, title, type, status, thumbnail, lastModified, views, onEdit, onDelete }: ProjectCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-aige-green/20 text-aige-green border-aige-green/40";
      case "draft": return "bg-gray-500/20 text-gray-200 border-gray-400/40";
      case "paused": return "bg-aige-orange/20 text-aige-orange border-aige-orange/40";
      default: return "bg-gray-500/20 text-gray-200 border-gray-400/40";
    }
  };

  return (
    <Card className="h-full">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="aspect-video bg-aige-dark/60 rounded-lg mb-4 flex items-center justify-center border border-aige-yellow/10">
          {thumbnail ? (
            <img src={thumbnail} alt={title} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <div className="text-gray-500 text-sm">No preview</div>
          )}
        </div>
        <div className="space-y-3 flex-1">
          <div>
            <h3 className="font-semibold text-white truncate">{title}</h3>
            <p className="text-sm text-gray-400">{type}</p>
          </div>
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(status) + " border px-2 py-0.5 rounded-full text-xs font-semibold"}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
            <span className="text-xs text-gray-400">{views} views</span>
          </div>
          <p className="text-xs text-gray-500">Modified {lastModified}</p>
        </div>
        <div className="flex justify-end gap-1 mt-auto">
          <Button variant="ghost" size="sm" onClick={() => onEdit(id)}>
            <Edit className="w-4 h-4 text-aige-yellow" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(id)}>
            <Trash2 className="w-4 h-4 text-red-400" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
