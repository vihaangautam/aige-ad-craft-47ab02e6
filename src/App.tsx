import { useState, useEffect } from "react"; // Added useEffect
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";

import { HomePage } from "@/pages/HomePage";
import { CreateAdPage } from "@/pages/CreateAdPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import AuthPage from "@/pages/AuthPage";
import { SettingsPage } from "@/pages/SettingsPage";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

const queryClient = new QueryClient();

const App = () => {
  // Initialize currentPath from window.location.pathname
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Effect to handle browser navigation (back/forward)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Effect to update browser history when currentPath changes internally
  useEffect(() => {
    if (window.location.pathname !== currentPath) {
      window.history.pushState({}, "", currentPath);
    }
  }, [currentPath]);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  const renderCurrentPage = () => {
    switch (currentPath) {
      case "/":
        return <HomePage onNavigate={handleNavigate} />;
      case "/auth":
        return <AuthPage onNavigate={handleNavigate} />; // This should now work
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
        // Handle 404 or redirect to a known page, e.g., home
        // For now, let's render HomePage for unknown paths to avoid breaking
        // if a path like /favicon.ico is mistakenly processed.
        // A more robust solution would be a dedicated 404 component.
        console.warn(`Unknown path: ${currentPath}, rendering HomePage.`);
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
        <Router>
          <Routes />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
