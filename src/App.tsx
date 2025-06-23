import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import { HomePage } from "@/pages/HomePage";
import { CreateAdPage } from "@/pages/CreateAdPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import AuthPage from "@/pages/AuthPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { PreviewPage } from "@/pages/PreviewPage";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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
            <Route path="/auth" element={<AuthPage />} />

            {/* Standalone Preview Page */}
            <Route path="/preview" element={<PreviewPage />} />

            {/* Protected routes with Dashboard layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout
                    currentPath="/"
                    onNavigate={(path) => window.location.href = path}
                  >
                    <HomePage onNavigate={(path) => window.location.href = path} />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <DashboardLayout
                    currentPath="/create"
                    onNavigate={(path) => window.location.href = path}
                  >
                    <CreateAdPage onNavigate={(path) => window.location.href = path} />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <DashboardLayout
                    currentPath="/projects"
                    onNavigate={(path) => window.location.href = path}
                  >
                    <ProjectsPage onNavigate={(path) => window.location.href = path} />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <DashboardLayout
                    currentPath="/analytics"
                    onNavigate={(path) => window.location.href = path}
                  >
                    <AnalyticsPage onNavigate={(path) => window.location.href = path} />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <DashboardLayout
                    currentPath="/settings"
                    onNavigate={(path) => window.location.href = path}
                  >
                    <SettingsPage onNavigate={(path) => window.location.href = path} />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/billing"
              element={
                <ProtectedRoute>
                  <DashboardLayout
                    currentPath="/billing"
                    onNavigate={(path) => window.location.href = path}
                  >
                    <div className="p-8 text-center">
                      <h1 className="text-2xl font-bold text-black mb-4">Billing</h1>
                      <p className="text-gray-600">Billing page coming soon</p>
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
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