import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus,
  Trash2, 
  Search,
  FlaskConical,
  Edit,
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
import { useData } from "@/lib/DataContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import AdminResearchForm from "@/components/AdminResearchForm";

export default function ResearchManager() {
  const { data, updateData } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this research topic?")) {
      try {
        await api.research.delete(id);
        const updatedList = data.research.filter(item => item.id !== id);
        updateData('research', updatedList);
        toast.success("Research deleted successfully");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete research");
      }
    }
  };

  const filteredData = data.research.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isAdding || editingItem) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
        <AdminResearchForm 
          onCancel={() => {
            setIsAdding(false);
            setEditingItem(null);
          }} 
          onSuccess={() => {
            setIsAdding(false);
            setEditingItem(null);
          }} 
          initialData={editingItem}
        />
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FlaskConical className="text-primary" size={20} />
              Research Topics
            </h3>
            <p className="text-sm text-gray-500">Manage research papers and projects</p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <Input 
                placeholder="Search research..." 
                className="pl-9 w-64" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsAdding(true)} className="bg-primary text-white gap-2">
              <Plus size={16} /> Add Research
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Journal & DOI</TableHead>
              <TableHead>Authors</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50/50">
                <TableCell className="font-medium text-gray-900 align-top">
                  <div className="flex flex-col gap-1">
                    <span className="line-clamp-2">{item.title}</span>
                    <span className="text-[10px] text-muted-foreground line-clamp-1">{item.description}</span>
                  </div>
                </TableCell>
                <TableCell className="align-top">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {item.category}
                  </span>
                </TableCell>
                <TableCell className="text-gray-600 align-top">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium">{item.journal}</span>
                    <span className="text-[10px] text-muted-foreground">{item.doi}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600 align-top">
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {item.authors.map((a: any, i: number) => (
                      <span key={i} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-full">
                        {a.name}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-gray-500 align-top">
                  {(item as any).year || (item as any).date}
                </TableCell>
                <TableCell className="text-right align-top">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingItem(item)}>
                      <Edit size={14} className="text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(item.id)}>
                      <Trash2 size={14} className="text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <FlaskConical size={32} className="opacity-20" />
                    <p>No research entries found matching your search.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
