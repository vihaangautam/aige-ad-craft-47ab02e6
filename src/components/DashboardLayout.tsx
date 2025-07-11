
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
      <div className="min-h-screen flex w-full bg-[#111]">
        <AIGESidebar currentPath={currentPath} onNavigate={onNavigate} />
        <main className="flex-1 p-6 overflow-auto scrollbar-thin scrollbar-thumb-[#444] scrollbar-thumb-rounded-full scrollbar-track-transparent hover:scrollbar-thumb-yellow-400">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
