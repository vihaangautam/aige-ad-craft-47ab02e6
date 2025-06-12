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

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthRoute = location.pathname === "/auth";

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const LayoutWrapper = ({ children }: { children: React.ReactNode }) =>
    isAuthRoute ? (
      <>{children}</>
    ) : (
      <DashboardLayout currentPath={location.pathname} onNavigate={handleNavigate}>
        {children}
      </DashboardLayout>
    );

  return (
    <LayoutWrapper>
      <Routes>
        <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
        <Route path="/auth" element={<AuthPage onNavigate={handleNavigate} />} />
        <Route path="/create" element={<CreateAdPage onNavigate={handleNavigate} />} />
        <Route path="/projects" element={<ProjectsPage onNavigate={handleNavigate} />} />
        <Route path="/analytics" element={<AnalyticsPage onNavigate={handleNavigate} />} />
        <Route path="/settings" element={<SettingsPage onNavigate={handleNavigate} />} />
        <Route
          path="/billing"
          element={
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold text-black mb-4">Billing</h1>
              <p className="text-gray-600">Billing page coming soon</p>
            </div>
          }
        />
        <Route
          path="*"
          element={<HomePage onNavigate={handleNavigate} />}
        />
      </Routes>
    </LayoutWrapper>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <AppRoutes />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
