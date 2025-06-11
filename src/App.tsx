
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { HomePage } from "@/pages/HomePage";
import { CreateAdPage } from "@/pages/CreateAdPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { AuthPage } from "@/pages/AuthPage";
import { SettingsPage } from "@/pages/SettingsPage";

const queryClient = new QueryClient();

const App = () => {
  const [currentPath, setCurrentPath] = useState("/");

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  const renderCurrentPage = () => {
    switch (currentPath) {
      case "/":
        return <HomePage onNavigate={handleNavigate} />;
      case "/auth":
        return <AuthPage onNavigate={handleNavigate} />;
      case "/create":
        return <CreateAdPage onNavigate={handleNavigate} />;
      case "/projects":
        return <ProjectsPage onNavigate={handleNavigate} />;
      case "/analytics":
        return <AnalyticsPage onNavigate={handleNavigate} />;
      case "/settings":
        return <SettingsPage onNavigate={handleNavigate} />;
      case "/billing":
        return (
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-black mb-4">Billing</h1>
            <p className="text-gray-600">Billing page coming soon</p>
          </div>
        );
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  // Show auth page without layout for auth routes
  if (currentPath === "/auth") {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthPage onNavigate={handleNavigate} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <DashboardLayout currentPath={currentPath} onNavigate={handleNavigate}>
          {renderCurrentPage()}
        </DashboardLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
