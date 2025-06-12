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
import { NotFoundPage } from "@/pages/NotFound"; // Import NotFoundPage

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet, // Import Outlet
  Navigate, // Import Navigate
} from "react-router-dom";

const queryClient = new QueryClient();

// New component for dashboard layout routes
const DashboardRoutes = () => {
  return (
    <DashboardLayout>
      <Outlet /> {/* react-router-dom Outlet */}
    </DashboardLayout>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />

            {/* Routes with DashboardLayout */}
            <Route element={<DashboardRoutes />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreateAdPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/billing" element={
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold text-black mb-4">Billing</h1>
                  <p className="text-gray-600">Billing page coming soon</p>
                </div>
              } />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App; // Ensure App is exported
