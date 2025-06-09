
import { SidebarProvider } from "@/components/ui/sidebar";
import { AIGESidebar } from "./AIGESidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function DashboardLayout({ children, currentPath, onNavigate }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <AIGESidebar currentPath={currentPath} onNavigate={onNavigate} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
