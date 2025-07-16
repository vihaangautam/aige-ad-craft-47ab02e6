import { Plus, FileImage, Eye, QrCode, TrendingUp } from "lucide-react";
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
    <div className="space-y-10 font-sans bg-[#111] min-h-screen px-4 md:px-6 py-10 overflow-x-hidden">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <span role="img" aria-label="wave">👋</span> Welcome back, User!
        </h1>
        <p className="text-sm text-neutral-400 mt-1">Here’s a snapshot of your ad performance this week.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.title} className="bg-[#1E1E24] rounded-2xl p-5 shadow-lg hover:scale-[1.02] transition-transform border border-neutral-800">
            <MetricCard {...metric} />
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-gradient-to-tr from-yellow-300 to-amber-400 text-black p-7 rounded-2xl shadow-xl border border-yellow-100 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-black/10">
                <Plus className="w-10 h-10 text-black/80" />
              </div>
              <h3 className="text-xl font-bold mb-2">Create New Ad</h3>
              <p className="text-black/70 text-center mb-6">Start building your AR-powered ad experience</p>
              <button
                onClick={() => onNavigate('/create/aige')}
                className="w-full py-3 rounded-xl font-semibold bg-black text-yellow-300 hover:bg-neutral-900 transition-all duration-200 text-lg shadow hover:shadow-yellow-500/30"
              >
                Create New
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-white">Recent Projects</h2>
          <button 
            onClick={() => onNavigate("/projects")}
            className="text-yellow-400 hover:text-yellow-300 font-medium"
          >
            View All Projects
          </button>
        </div>
        <div className="flex gap-6 pb-2 overflow-x-auto scrollbar-thin scrollbar-thumb-[#444] scrollbar-thumb-rounded-full scrollbar-track-transparent hover:scrollbar-thumb-yellow-400 px-4">
          {recentProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl bg-gradient-to-br from-[#1E1E24] to-[#17171b] border border-neutral-800 shadow-md min-w-[260px] max-w-xs min-h-[260px] flex-shrink-0 p-5 flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200"
            >
              <ProjectCard 
                {...project} 
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
