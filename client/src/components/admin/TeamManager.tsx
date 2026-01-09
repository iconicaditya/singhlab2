import { useState, useRef } from "react";
import { useData } from "@/lib/DataContext";
import { TeamMember } from "@/lib/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, User, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function TeamManager() {
  const { data, updateData } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (member: TeamMember) => {
    setCurrentMember(member);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setCurrentMember({
      id: 0, // Temp ID
      name: "",
      role: "",
      image: "",
      bio: "",
      social: { linkedin: "", twitter: "", email: "", facebook: "" }
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCurrentMember(prev => prev ? ({ ...prev, image: result }) : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this team member?")) {
      try {
        await api.team.delete(id);
        const newData = data.team.filter(m => m.id !== id);
        updateData('team', newData);
        toast.success("Team member deleted");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete team member");
      }
    }
  };

  const handleSave = async () => {
    if (!currentMember) return;

    // Validation
    if (!currentMember.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!currentMember.role.trim()) {
      toast.error("Role is required");
      return;
    }

    try {
      let newData;
      if (currentMember.id === 0) {
        // Add new
        const created = await api.team.create(currentMember);
        newData = [...data.team, created];
        toast.success("Team member added");
      } else {
        // Update existing
        const updated = await api.team.update(currentMember.id, currentMember);
        newData = data.team.map(m => m.id === currentMember.id ? updated : m);
        toast.success("Team member updated");
      }

      updateData('team', newData);
      setIsDialogOpen(false);
      setCurrentMember(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to save team member");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Members</h2>
        <Button onClick={handleAdd} className="gap-2">
          <Plus size={16} /> Add Member
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.team.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                     {member.image ? (
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                     ) : (
                        <User className="w-6 h-6 m-2 text-gray-400" />
                     )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(member)}>
                      <Pencil size={16} className="text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)}>
                      <Trash2 size={16} className="text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{currentMember?.id === 0 ? "Add Team Member" : "Edit Team Member"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
              <Input 
                id="name" 
                value={currentMember?.name || ""} 
                onChange={(e) => setCurrentMember(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role <span className="text-red-500">*</span></Label>
              <Input 
                id="role" 
                value={currentMember?.role || ""} 
                onChange={(e) => setCurrentMember(prev => prev ? ({ ...prev, role: e.target.value }) : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                value={currentMember?.bio || ""} 
                onChange={(e) => setCurrentMember(prev => prev ? ({ ...prev, bio: e.target.value }) : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <div className="flex gap-2">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                    {currentMember?.image ? (
                        <img src={currentMember.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <User className="w-5 h-5 m-auto mt-2.5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-grow">
                      <Input 
                        id="image" 
                        value={currentMember?.image || ""} 
                        onChange={(e) => setCurrentMember(prev => prev ? ({ ...prev, image: e.target.value }) : null)}
                        placeholder="Image URL or upload..."
                        className="hidden" 
                      />
                       <Button 
                        type="button"
                        variant="outline" 
                        className="w-full gap-2 text-gray-600"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload size={16} /> Upload Image
                      </Button>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                  </div>
              </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={currentMember?.social.email || ""} 
                    onChange={(e) => setCurrentMember(prev => prev ? ({ ...prev, social: {...prev.social, email: e.target.value} }) : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input 
                    id="linkedin" 
                    value={currentMember?.social.linkedin || ""} 
                    onChange={(e) => setCurrentMember(prev => prev ? ({ ...prev, social: {...prev.social, linkedin: e.target.value} }) : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input 
                    id="twitter" 
                    value={currentMember?.social.twitter || ""} 
                    onChange={(e) => setCurrentMember(prev => prev ? ({ ...prev, social: {...prev.social, twitter: e.target.value} }) : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input 
                    id="facebook" 
                    value={currentMember?.social.facebook || ""} 
                    onChange={(e) => setCurrentMember(prev => prev ? ({ ...prev, social: {...prev.social, facebook: e.target.value} }) : null)}
                  />
                </div>
             </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}