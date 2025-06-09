
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";

interface ProjectsPageProps {
  onNavigate: (path: string) => void;
}

export function ProjectsPage({ onNavigate }: ProjectsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const projects = [
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
    },
    {
      id: "5",
      title: "Spring Beauty Collection",
      type: "Virtual Try-On",
      status: "active" as const,
      thumbnail: "",
      lastModified: "1 month ago",
      views: 67800
    },
    {
      id: "6",
      title: "Gaming Console Launch",
      type: "Game AR",
      status: "draft" as const,
      thumbnail: "",
      lastModified: "2 months ago",
      views: 0
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesType = typeFilter === "all" || project.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleEditProject = (id: string) => {
    console.log("Edit project:", id);
    onNavigate("/create");
  };

  const handleDeleteProject = (id: string) => {
    console.log("Delete project:", id);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">My Projects</h1>
          <p className="text-gray-600">Manage your AIGE ad campaigns</p>
        </div>
        <Button 
          onClick={() => onNavigate("/create")}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold hover:shadow-lg hover:shadow-yellow-400/25"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Ad
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Ad Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Immersive Story AR">Immersive Story AR</SelectItem>
            <SelectItem value="Virtual Try-On">Virtual Try-On</SelectItem>
            <SelectItem value="Game AR">Game AR</SelectItem>
            <SelectItem value="Poster AR">Poster AR</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredProjects.length} of {projects.length} projects
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-700 border-green-200">
            {projects.filter(p => p.status === "active").length} Active
          </Badge>
          <Badge variant="outline" className="text-gray-700 border-gray-200">
            {projects.filter(p => p.status === "draft").length} Draft
          </Badge>
          <Badge variant="outline" className="text-orange-700 border-orange-200">
            {projects.filter(p => p.status === "paused").length} Paused
          </Badge>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard 
            key={project.id} 
            {...project} 
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No projects found matching your criteria</p>
          <Button 
            onClick={() => onNavigate("/create")}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold"
          >
            Create Your First Ad
          </Button>
        </div>
      )}
    </div>
  );
}
