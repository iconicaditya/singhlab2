import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Handshake, 
  FlaskConical, 
  FolderKanban, 
  FileText, 
  UserCircle, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "collaborators", label: "Collaborators", icon: Handshake },
  { id: "research", label: "Research", icon: FlaskConical },
  { id: "publications", label: "Publications", icon: FileText },
  { id: "resources", label: "Resources", icon: FileText },
  { id: "gallery", label: "Gallery", icon: FolderKanban },
  { id: "private-gallery", label: "Private Gallery", icon: FolderKanban },
  { id: "team", label: "Team Members", icon: UserCircle },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  const [open, setOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-xl font-bold font-heading">Singh Lab Admin</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden text-gray-400 hover:text-white"
          onClick={() => setOpen(false)}
        >
          <X size={20} />
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium",
              activeTab === item.id 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            )}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed left-0 top-0 h-screen z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Trigger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-30 flex items-center px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 border-none">
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <h2 className="text-lg font-bold font-heading truncate">Singh Lab Admin</h2>
      </div>
    </>
  );
}
