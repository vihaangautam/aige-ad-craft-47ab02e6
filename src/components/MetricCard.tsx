
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
    <Card className="bg-[#1E1E24] rounded-xl shadow-sm p-0">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 font-medium">{title}</p>
            <p className="text-3xl font-bold text-white mt-1">{value}</p>
            {change && (
              <p className={`text-xs mt-1 ${trend === 'up' ? 'text-green-400' : 'text-red-400'} font-semibold`}>{change}</p>
            )}
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-300/80 to-transparent">
            <Icon className="w-7 h-7 text-black" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
