import { useState } from "react";
import { useData } from "@/lib/DataContext";
import { Message } from "@/lib/DataContext";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2, Mail, Calendar, User, Eye, X, RefreshCcw } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function MessageManager() {
  const { data, updateData } = useData();
  const messages = data.messages;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const filteredMessages = messages.filter(msg => 
    msg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this message?")) {
      try {
        await api.messages.delete(id);
        const newMessages = messages.filter(m => m.id !== id);
        updateData('messages', newMessages);
        if (selectedMessage?.id === id) setSelectedMessage(null);
        toast.success("Message deleted");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete message");
      }
    }
  };

  const handleClearAll = async () => {
    if (confirm("Are you sure you want to delete ALL messages?")) {
      try {
        for (const msg of messages) {
          await api.messages.delete(msg.id);
        }
        updateData('messages', []);
        toast.success("All messages deleted");
      } catch (error: any) {
        toast.error(error.message || "Failed to clear all messages");
      }
    }
  };

  const handleView = async (msg: Message) => {
    // Mark as read when viewed if unread
    if (msg.status === "Unread") {
      try {
        const updatedMsg = { ...msg, status: "Read" as const };
        await api.messages.update(msg.id, updatedMsg);
        const newMessages = messages.map(m => m.id === msg.id ? updatedMsg : m);
        updateData('messages', newMessages);
        setSelectedMessage(updatedMsg);
      } catch (error: any) {
        toast.error(error.message || "Failed to mark message as read");
        setSelectedMessage(msg);
      }
    } else {
      setSelectedMessage(msg);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Unread": return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "Read": return "bg-gray-100 text-gray-700 hover:bg-gray-100";
      case "Replied": return "bg-green-100 text-green-700 hover:bg-green-100";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <Input 
            placeholder="Search messages..." 
            className="pl-9" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="destructive" className="gap-2" onClick={handleClearAll}>
            <Trash2 size={16} /> Clear All
          </Button>
        </div>
      </div>


      {/* Messages Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead className="hidden md:table-cell">Subject</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMessages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                  No messages found
                </TableCell>
              </TableRow>
            ) : (
              filteredMessages.map((msg) => (
                <TableRow key={msg.id} className="hover:bg-gray-50/50 cursor-pointer" onClick={() => handleView(msg)}>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(msg.status)}>
                      {msg.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{msg.sender}</span>
                      <span className="text-xs text-gray-500 md:hidden">{msg.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-medium text-gray-700 truncate max-w-xs">
                    {msg.subject}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                       {msg.category}
                     </span>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm whitespace-nowrap">{msg.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleView(msg)}>
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(msg.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Message Detail Modal */}
      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex justify-between items-start pr-4">
              <DialogTitle className="text-xl font-bold">{selectedMessage?.subject}</DialogTitle>
            </div>
            <DialogDescription className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {selectedMessage?.sender.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedMessage?.sender}</p>
                    <p className="text-sm text-gray-500">{selectedMessage?.email}</p>
                  </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{selectedMessage?.date}</p>
                    <Badge variant="outline" className="mt-1">{selectedMessage?.category}</Badge>
                </div>
              </div>
              
              <div className="mt-6 text-gray-700 leading-relaxed whitespace-pre-wrap min-h-[200px] p-2">
                {selectedMessage?.message}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
             <Button variant="outline" onClick={() => setSelectedMessage(null)}>Close</Button>
             <Button className="gap-2" onClick={() => {
                alert("Reply functionality would open email client or form");
             }}>
                <Mail size={16} /> Reply via Email
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}