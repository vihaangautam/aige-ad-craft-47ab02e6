
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
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "draft": return "bg-gray-100 text-gray-800 border-gray-200";
      case "paused": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="hover:shadow-lg hover:shadow-yellow-400/10 transition-all duration-300 border border-gray-200">
      <CardContent className="p-4">
        <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
          {thumbnail ? (
            <img src={thumbnail} alt={title} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <div className="text-gray-400 text-sm">No preview</div>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-black truncate">{title}</h3>
              <p className="text-sm text-gray-600">{type}</p>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => onEdit(id)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
            <span className="text-xs text-gray-500">{views} views</span>
          </div>
          
          <p className="text-xs text-gray-500">Modified {lastModified}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
