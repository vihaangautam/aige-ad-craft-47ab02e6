
import { Home, Plus, FolderOpen, BarChart3, Settings, CreditCard } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import logo from "@/assets/download.jpg";

const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Create New Ad",
    url: "/create/aige",
    icon: Plus,
  },
  {
    title: "My Projects",
    url: "/projects",
    icon: FolderOpen,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
];

interface AIGESidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function AIGESidebar({ currentPath, onNavigate }: AIGESidebarProps) {
  return (
    <Sidebar className="border-r border-neutral-800 bg-aige-dark min-h-screen font-sans">
      <SidebarHeader className="p-6 border-b border-neutral-800 bg-aige-dark">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-aige-yellow flex items-center justify-center">
            <img
              src={logo}
              alt="AIGE Logo"
              className="w-10 h-10 object-contain"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-aige-yellow tracking-wide">
            AIGE
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="aige-sidebar bg-aige-dark">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.filter(item => item.title !== 'Billing').map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(item.url)}
                    isActive={currentPath === item.url}
                    className={`w-full justify-start rounded-xl my-1 px-3 py-2 text-lg font-medium transition-all duration-200
                      ${currentPath === item.url 
                        ? 'border-l-4 border-yellow-400 bg-neutral-900 text-yellow-300' 
                        : 'text-white/70 hover:text-white'}
                    `}
                  >
                    <item.icon className={`w-6 h-6 mr-3 ${currentPath === item.url ? 'text-yellow-300' : 'text-white/70 group-hover:text-white'} transition-all`} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
