
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
    url: "/create",
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
    <Sidebar className="border-r border-gray-800">
      <SidebarHeader className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 rounded-lg overflow-hidden">
            <img
              src={logo}
              alt="Company Logo"
  
            />
        </div>
          <h1 className="text-xl font-bold text-white">
            AIGE
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="aige-sidebar">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(item.url)}
                    isActive={currentPath === item.url}
                    className={`w-full justify-start text-white hover:bg-gray-800 hover:text-yellow-400 transition-colors ${
                      currentPath === item.url 
                        ? 'bg-gray-800 text-yellow-400 border-r-2 border-yellow-400' 
                        : ''
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${currentPath === item.url ? 'text-yellow-400' : 'text-white'}`} />
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
