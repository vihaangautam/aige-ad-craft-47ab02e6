
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  trend?: "up" | "down";
}

const MetricCard = ({ title, value, change, icon: Icon, trend }: MetricCardProps) => {
  return (
    <Card className="hover:shadow-lg hover:shadow-yellow-400/10 transition-all duration-300 border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold mt-1 text-black">{value}</p>
            {change && (
              <p className={`text-xs mt-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {change} from last month
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-black" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
