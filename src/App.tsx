import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";

import { HomePage } from "@/pages/HomePage";
import { CreateAdPage } from "@/pages/CreateAdPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import AuthPage from "@/pages/AuthPage"; // ✅ default import
import { SettingsPage } from "@/pages/SettingsPage";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useRevalidator,
} from "react-router-dom";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            {/* Standalone Auth Page */}
            <Route path="/auth" element={<AuthPage onNavigate={(path) => window.location.href = path} />} />

            {/* All other pages inside Dashboard layout */}
            <Route
              path="/"
              element={
                <DashboardLayout
                  currentPath={window.location.pathname}
                  onNavigate={(path) => window.location.href = path}
                >
                  <HomePage onNavigate={(path) => window.location.href = path} />
                </DashboardLayout>
              }
            />
            <Route
              path="/create"
              element={
                <DashboardLayout
                  currentPath="/create"
                  onNavigate={(path) => window.location.href = path}
                >
                  <CreateAdPage onNavigate={(path) => window.location.href = path} />
                </DashboardLayout>
              }
            />
            <Route
              path="/projects"
              element={
                <DashboardLayout
                  currentPath="/projects"
                  onNavigate={(path) => window.location.href = path}
                >
                  <ProjectsPage onNavigate={(path) => window.location.href = path} />
                </DashboardLayout>
              }
            />
            <Route
              path="/analytics"
              element={
                <DashboardLayout
                  currentPath="/analytics"
                  onNavigate={(path) => window.location.href = path}
                >
                  <AnalyticsPage onNavigate={(path) => window.location.href = path} />
                </DashboardLayout>
              }
            />
            <Route
              path="/settings"
              element={
                <DashboardLayout
                  currentPath="/settings"
                  onNavigate={(path) => window.location.href = path}
                >
                  <SettingsPage onNavigate={(path) => window.location.href = path} />
                </DashboardLayout>
              }
            />
            <Route
              path="/billing"
              element={
                <DashboardLayout
                  currentPath="/billing"
                  onNavigate={(path) => window.location.href = path}
                >
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold text-black mb-4">Billing</h1>
                    <p className="text-gray-600">Billing page coming soon</p>
                  </div>
                </DashboardLayout>
              }
            />

            {/* 404 Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
