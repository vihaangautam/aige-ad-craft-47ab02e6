
import DashboardHeader from "@/components/DashboardHeader";
import StatsCard from "@/components/StatsCard";
import CampaignCard from "@/components/CampaignCard";
import RecentActivity from "@/components/RecentActivity";
import AnalyticsChart from "@/components/AnalyticsChart";
import { Eye, Smartphone, QrCode, TrendingUp } from "lucide-react";

const Index = () => {
  const stats = [
    {
      title: "Total Views",
      value: "284K",
      change: "+12.5%",
      icon: Eye,
      trend: "up" as const
    },
    {
      title: "Active Campaigns",
      value: "42",
      change: "+3.2%",
      icon: Smartphone,
      trend: "up" as const
    },
    {
      title: "QR Scans",
      value: "156K",
      change: "+8.1%",
      icon: QrCode,
      trend: "up" as const
    },
    {
      title: "Interactions",
      value: "98K",
      change: "+15.3%",
      icon: TrendingUp,
      trend: "up" as const
    }
  ];

  const campaigns = [
    {
      id: "1",
      name: "Summer Fashion AR Collection",
      status: "active" as const,
      views: 45230,
      interactions: 12400,
      thumbnail: "",
      createdAt: "2 days ago"
    },
    {
      id: "2", 
      name: "Nike Air Max Interactive Experience",
      status: "active" as const,
      views: 38920,
      interactions: 9650,
      thumbnail: "",
      createdAt: "5 days ago"
    },
    {
      id: "3",
      name: "Holiday Collection Preview",
      status: "draft" as const,
      views: 0,
      interactions: 0,
      thumbnail: "",
      createdAt: "1 week ago"
    },
    {
      id: "4",
      name: "Luxury Watch AR Showcase",
      status: "paused" as const,
      views: 23450,
      interactions: 5670,
      thumbnail: "",
      createdAt: "3 weeks ago"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <DashboardHeader />
      
      <main className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Analytics and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnalyticsChart />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>

        {/* Campaigns Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your AIGE Campaigns</h2>
            <p className="text-sm text-muted-foreground">
              {campaigns.filter(c => c.status === 'active').length} active campaigns
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} {...campaign} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
