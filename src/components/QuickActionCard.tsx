
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

const QuickActionCard = ({ title, description, icon: Icon, onClick }: QuickActionCardProps) => {
  return (
    <Card className="hover:shadow-lg hover:shadow-yellow-400/10 transition-all duration-300 border border-gray-200">
      <CardContent className="p-6 text-center">
        <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-black" />
        </div>
        <h3 className="text-lg font-semibold text-black mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <Button 
          onClick={onClick}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all"
        >
          Get Started
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActionCard;
