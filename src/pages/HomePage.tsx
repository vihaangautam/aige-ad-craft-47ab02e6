
import { Plus, FileImage, Eye, QrCode, TrendingUp, Smartphone } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import QuickActionCard from "@/components/QuickActionCard";
import ProjectCard from "@/components/ProjectCard";

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const metrics = [
    {
      title: "Total Ads Created",
      value: "42",
      change: "+8 this month",
      icon: FileImage,
      trend: "up" as const
    },
    {
      title: "Total Views",
      value: "284K",
      change: "+12.5% from last month",
      icon: Eye,
      trend: "up" as const
    },
    {
      title: "QR Scans",
      value: "156K",
      change: "+8.1% from last month",
      icon: QrCode,
      trend: "up" as const
    },
    {
      title: "Top Ad Performance",
      value: "98K",
      change: "interactions",
      icon: TrendingUp,
      trend: "up" as const
    }
  ];

  const quickActions = [
    {
      title: "Create New Ad",
      description: "Start building your AR-powered ad experience",
      icon: Plus,
      onClick: () => onNavigate("/create")
    },
    {
      title: "Browse Templates",
      description: "Explore pre-built ad templates",
      icon: FileImage,
      onClick: () => onNavigate("/templates")
    }
  ];

  const recentProjects = [
    {
      id: "1",
      title: "Summer Fashion AR Collection",
      type: "Immersive Story AR",
      status: "active" as const,
      thumbnail: "",
      lastModified: "2 days ago",
      views: 45230
    },
    {
      id: "2",
      title: "Nike Air Max Try-On",
      type: "Virtual Try-On",
      status: "active" as const,
      thumbnail: "",
      lastModified: "5 days ago",
      views: 38920
    },
    {
      id: "3",
      title: "Holiday Game Campaign",
      type: "Game AR",
      status: "draft" as const,
      thumbnail: "",
      lastModified: "1 week ago",
      views: 0
    },
    {
      id: "4",
      title: "Luxury Watch Showcase",
      type: "Poster AR",
      status: "paused" as const,
      thumbnail: "",
      lastModified: "3 weeks ago",
      views: 23450
    }
  ];

  const handleEditProject = (id: string) => {
    console.log("Edit project:", id);
    onNavigate("/create");
  };

  const handleDeleteProject = (id: string) => {
    console.log("Delete project:", id);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Welcome back, Alex</h1>
        <p className="text-gray-600">Here's what's happening with your AIGE campaigns today.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-black mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action) => (
            <QuickActionCard key={action.title} {...action} />
          ))}
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-black">Recent Projects</h2>
          <button 
            onClick={() => onNavigate("/projects")}
            className="text-yellow-600 hover:text-yellow-700 font-medium"
          >
            View All Projects
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recentProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              {...project} 
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
