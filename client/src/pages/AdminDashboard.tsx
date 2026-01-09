import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Sidebar from "@/components/admin/Sidebar";
import { motion } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Edit, 
  MoreHorizontal,
  Search,
  Image as ImageIcon,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock Data
const mockUsers = [
  { id: 1, name: "Admin User", email: "admin@singhlab.org", role: "Administrator" },
  { id: 2, name: "Dr. Singh", email: "singh@singhlab.org", role: "Researcher" },
  { id: 3, name: "John Doe", email: "john@student.edu", role: "Student" },
];

const mockMessages = [
  { id: 1, sender: "Alice Smith", email: "alice@example.com", subject: "Collaboration Inquiry", date: "2024-03-20" },
  { id: 2, sender: "Bob Jones", email: "bob@university.edu", subject: "Research Question", date: "2024-03-18" },
];

const mockResources = [
  { id: 1, title: "Plastic Guide", type: "PDF", downloads: 120 },
  { id: 2, title: "Field Manual", type: "PDF", downloads: 85 },
];

const mockGallery = [
  { id: 1, title: "Lab Work", category: "Lab", date: "2024-03-10" },
  { id: 2, title: "Wetlands", category: "Fieldwork", date: "2024-02-28" },
];

import MessageManager from "@/components/admin/MessageManager";
import TeamManager from "@/components/admin/TeamManager";
import PublicationManager from "@/components/admin/PublicationManager";
import GalleryManager from "@/components/admin/GalleryManager";
import PrivateGalleryManager from "@/components/admin/PrivateGalleryManager";
import ResearchManager from "@/components/admin/ResearchManager";
import ProjectManager from "@/components/admin/ProjectManager";

const DataTable = ({ data, columns, title, onAdd }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
  >
    <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <Input placeholder="Search..." className="pl-9 w-full sm:w-64" />
        </div>
        <Button onClick={onAdd} className="bg-primary text-white gap-2 w-full sm:w-auto">
          <Plus size={16} /> Add New
        </Button>
      </div>
    </div>
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col: string) => (
              <TableHead key={col} className="whitespace-nowrap">{col}</TableHead>
            ))}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row: any) => (
            <TableRow key={row.id} className="hover:bg-gray-50/50">
              {Object.keys(row).map((key) => (
                key !== 'id' && (
                  <TableCell key={key} className="font-medium text-gray-700 max-w-[200px] truncate sm:max-w-none sm:whitespace-normal">
                    {row[key]}
                  </TableCell>
                )
              ))}
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2">
                      <Edit size={14} /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 gap-2">
                      <Trash2 size={14} /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </motion.div>
);

const DashboardStats = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
    {[
      { label: "Total Users", value: "12", color: "bg-blue-50 text-blue-600" },
      { label: "Messages", value: "48", color: "bg-green-50 text-green-600" },
      { label: "Publications", value: "24", color: "bg-orange-50 text-orange-600" },
    ].map((stat, idx) => (
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.1 }}
        className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
      >
        <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
        <h4 className={`text-3xl font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</h4>
      </motion.div>
    ))}
  </div>
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setLocation("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            <DashboardStats />
            <DataTable 
              title="Recent Messages" 
              data={mockMessages} 
              columns={["Sender", "Email", "Subject", "Date"]} 
              onAdd={() => {}} 
            />
          </>
        );
      case "users":
        return (
          <DataTable 
            title="Manage Users" 
            data={mockUsers} 
            columns={["Name", "Email", "Role"]} 
            onAdd={() => {}} 
          />
        );
      case "messages":
        return <MessageManager />;
      case "research":
        return <ResearchManager />;
      case "team":
        return <TeamManager />;
      case "publications":
        return <PublicationManager />;
      case "resources":
        return (
          <DataTable 
            title="Manage Resources" 
            data={mockResources} 
            columns={["Title", "Type", "Downloads"]} 
            onAdd={() => {}} 
          />
        );
      case "gallery":
        return <GalleryManager />;
      case "private-gallery":
        return <PrivateGalleryManager />;
      case "projects":
        return <ProjectManager />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400">
            <p className="text-xl">Content for {activeTab} would go here</p>
            <p className="text-sm">Mockup Mode</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <main className="flex-1 lg:ml-64 p-4 md:p-8 pt-16 lg:pt-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
           <h1 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h1>
           <div className="flex items-center gap-4">
             <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20">
               A
             </div>
             <div className="hidden sm:block">
               <p className="font-bold text-sm">Admin User</p>
               <p className="text-xs text-gray-500">Administrator</p>
             </div>
           </div>
        </header>
        {renderContent()}
      </main>
    </div>
  );
}