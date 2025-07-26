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
import CreateAdEntry from "@/pages/CreateAdEntry";
import { StoryAdConfigForm } from "@/components/StoryAdConfigForm";
import StoryAdConfigForm2 from "@/components/StoryAdConfigForm2";
import { StoryFlowBuilder as StoryFlowBuilder2 } from "@/components/StoryFlowBuilder2";
import GeneratingScreenPage from './pages/GeneratingScreenPage';
import { CreateMonoPage } from "@/pages/CreateMonoPage";
import { LoadingMonoPage } from "@/pages/LoadingMonoPage";
import { PreviewMonoPage } from "@/pages/PreviewMonoPage";
import { PosterMonoPage } from "@/pages/PosterMonoPage";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const queryClient = new QueryClient();

const App = () => {
  return (
    <div className="bg-[#111] w-full min-h-screen overflow-hidden">
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

              {/* Generating Screen Page */}
              <Route path="/generating" element={<GeneratingScreenPage />} />

              {/* MONO Feature Routes */}
              <Route path="/mono/create" element={<CreateMonoPage />} />
              <Route path="/mono/loading" element={<LoadingMonoPage />} />
              <Route path="/mono/preview" element={<PreviewMonoPage />} />
              <Route path="/mono/poster" element={<PosterMonoPage />} />

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
              {/* Remove the /create route for CreateAdEntry. Only /create/aige remains. */}
              <Route
                path="/create/aige"
                element={
                  <ProtectedRoute>
                    <DashboardLayout
                      currentPath="/create/aige"
                      onNavigate={(path) => window.location.href = path}
                    >
                      <CreateAdPage onNavigate={(path) => window.location.href = path} />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create/choice-point"
                element={
                  <ProtectedRoute>
                    <DashboardLayout
                      currentPath="/create/choice-point"
                      onNavigate={(path) => window.location.href = path}
                    >
                      <StoryAdConfigForm2 
                        onBack={() => window.location.href = "/"}
                        onNext={async (adConfigId) => { window.location.href = "/create/choice-point/builder"; }}
                      />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create/choice-point/builder"
                element={
                  <ProtectedRoute>
                    <DashboardLayout
                      currentPath="/create/choice-point/builder"
                      onNavigate={(path) => window.location.href = path}
                    >
                      <StoryFlowBuilder2 />
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
    </div>
  );
};

export default App;