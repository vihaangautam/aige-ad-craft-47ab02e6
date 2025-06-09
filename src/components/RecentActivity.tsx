
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, QrCode, Smartphone, TrendingUp } from "lucide-react";

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: "view",
      message: "Summer Fashion AR campaign received 1,247 new views",
      time: "2 minutes ago",
      icon: Eye
    },
    {
      id: 2,
      type: "qr",
      message: "QR code generated for Nike Air Max experience",
      time: "15 minutes ago",
      icon: QrCode
    },
    {
      id: 3,
      type: "interaction",
      message: "Holiday Collection campaign hit 10K interactions",
      time: "1 hour ago",
      icon: TrendingUp
    },
    {
      id: 4,
      type: "mobile",
      message: "New AR model uploaded for Luxury Watch series",
      time: "3 hours ago",
      icon: Smartphone
    }
  ];

  return (
    <Card className="bg-card/40 backdrop-blur-xl border-border/40">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full flex items-center justify-center">
              <activity.icon className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{activity.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
