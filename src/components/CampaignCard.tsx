
import { Eye, QrCode, Smartphone, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CampaignCardProps {
  id: string;
  name: string;
  status: "active" | "draft" | "paused";
  views: number;
  interactions: number;
  thumbnail: string;
  createdAt: string;
}

const CampaignCard = ({ name, status, views, interactions, thumbnail, createdAt }: CampaignCardProps) => {
  const statusColors = {
    active: "bg-green-500",
    draft: "bg-yellow-500",
    paused: "bg-gray-500"
  };

  return (
    <Card className="bg-card/40 backdrop-blur-xl border-border/40 hover:bg-card/60 transition-all duration-300 group">
      <CardContent className="p-4">
        <div className="relative mb-4">
          <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Smartphone className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">AR Experience</p>
            </div>
          </div>
          <Badge className={`absolute top-2 right-2 ${statusColors[status]} text-white`}>
            {status}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold truncate">{name}</h3>
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{views.toLocaleString()}</span>
            </div>
            <div className="text-xs">{createdAt}</div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-muted-foreground">Interactions: </span>
              <span className="font-medium">{interactions.toLocaleString()}</span>
            </div>
            <Button size="sm" variant="outline" className="bg-background/50">
              <QrCode className="w-3 h-3 mr-1" />
              QR Code
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignCard;
