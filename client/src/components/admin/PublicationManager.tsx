import { useState, useRef } from "react";
import { useData } from "@/lib/DataContext";
import { Publication } from "@/lib/DataContext";
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
import { Pencil, Trash2, Plus, Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function PublicationManager() {
  const { data, updateData } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPub, setCurrentPub] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (pub: Publication) => {
    setCurrentPub({ ...pub });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setCurrentPub({
      id: 0,
      title: "",
      journal: "",
      year: new Date().getFullYear().toString(),
      authors: [],
      type: "Journal Article",
      tags: [],
      abstract: "",
      doi: "",
      linkUrl: ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this publication?")) {
      try {
        await api.publications.delete(id);
        const newData = data.publications.filter(p => p.id !== id);
        updateData('publications', newData);
        toast.success("Publication deleted");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete publication");
      }
    }
  };

  const handleSave = async () => {
    if (!currentPub) return;

    if (!currentPub.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!currentPub.year?.toString().trim()) {
      toast.error("Year is required");
      return;
    }
    if (!currentPub.journal.trim()) {
      toast.error("Journal is required");
      return;
    }
    if (!currentPub.abstract.trim()) {
      toast.error("Abstract is required");
      return;
    }

    try {
      const payload = {
        title: currentPub.title,
        journal: currentPub.journal,
        year: currentPub.year.toString(),
        authors: Array.isArray(currentPub.authors) 
          ? currentPub.authors 
          : currentPub.authors.split(",").map((s: string) => s.trim()),
        type: currentPub.type || "Journal Article",
        tags: Array.isArray(currentPub.tags) 
          ? currentPub.tags 
          : (currentPub.tags?.split(",").map((s: string) => s.trim()) || []),
        abstract: currentPub.abstract,
        doi: currentPub.doi || "",
        linkUrl: currentPub.linkUrl || null,
      };

      let newData;
      if (currentPub.id === 0) {
        const created = await api.publications.create(payload);
        newData = [...data.publications, created];
        toast.success("Publication added");
      } else {
        const updated = await api.publications.update(currentPub.id, payload);
        newData = data.publications.map(p => p.id === currentPub.id ? updated : p);
        toast.success("Publication updated");
      }

      updateData('publications', newData);
      setIsDialogOpen(false);
      setCurrentPub(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to save publication");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Publications</h2>
        <Button onClick={handleAdd} className="gap-2">
          <Plus size={16} /> Add Publication
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Year</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Journal</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.publications.map((pub) => (
              <TableRow key={pub.id}>
                <TableCell>{pub.year}</TableCell>
                <TableCell className="font-medium max-w-xs truncate">{pub.title}</TableCell>
                <TableCell>{pub.journal}</TableCell>
                <TableCell>
                  {pub.linkUrl ? (
                    <a href={pub.linkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                      <FileText size={14} /> View
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(pub)}>
                      <Pencil size={16} className="text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(pub.id)}>
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentPub?.id === 0 ? "Add Publication" : "Edit Publication"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <Input 
                id="title" 
                value={currentPub?.title || ""} 
                onChange={(e) => setCurrentPub((prev: any) => prev ? ({ ...prev, title: e.target.value }) : null)}
                placeholder="Publication title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="journal">Journal/Conference <span className="text-red-500">*</span></Label>
              <Input 
                id="journal" 
                value={currentPub?.journal || ""} 
                onChange={(e) => setCurrentPub((prev: any) => prev ? ({ ...prev, journal: e.target.value }) : null)}
                placeholder="Journal or conference name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year <span className="text-red-500">*</span></Label>
              <Input 
                id="year" 
                value={currentPub?.year || ""} 
                onChange={(e) => setCurrentPub((prev: any) => prev ? ({ ...prev, year: e.target.value }) : null)}
                placeholder="2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input 
                id="type" 
                value={currentPub?.type || ""} 
                onChange={(e) => setCurrentPub((prev: any) => prev ? ({ ...prev, type: e.target.value }) : null)}
                placeholder="Journal Article, Conference Paper, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doi">DOI</Label>
              <Input 
                id="doi" 
                value={currentPub?.doi || ""} 
                onChange={(e) => setCurrentPub((prev: any) => prev ? ({ ...prev, doi: e.target.value }) : null)}
                placeholder="10.1234/example.doi"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="authors">Authors (comma separated)</Label>
              <Input 
                id="authors" 
                value={Array.isArray(currentPub?.authors) ? currentPub.authors.join(", ") : currentPub?.authors || ""} 
                onChange={(e) => setCurrentPub((prev: any) => prev ? ({ ...prev, authors: e.target.value.split(",").map((s: string) => s.trim()) }) : null)}
                placeholder="Author 1, Author 2, Author 3"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="abstract">Abstract <span className="text-red-500">*</span></Label>
              <Textarea 
                id="abstract" 
                value={currentPub?.abstract || ""} 
                onChange={(e) => setCurrentPub((prev: any) => prev ? ({ ...prev, abstract: e.target.value }) : null)}
                placeholder="Publication abstract"
                className="min-h-24"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input 
                id="tags" 
                value={Array.isArray(currentPub?.tags) ? currentPub.tags.join(", ") : currentPub?.tags || ""} 
                onChange={(e) => setCurrentPub((prev: any) => prev ? ({ ...prev, tags: e.target.value.split(",").map((s: string) => s.trim()) }) : null)}
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkUrl">Publication Link (Google Drive, DOI, etc.)</Label>
              <Input 
                id="linkUrl" 
                type="url"
                value={currentPub?.linkUrl || ""} 
                onChange={(e) => setCurrentPub((prev: any) => prev ? ({ ...prev, linkUrl: e.target.value }) : null)}
                placeholder="https://drive.google.com/..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Publication</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
