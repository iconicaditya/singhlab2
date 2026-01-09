import { useState, useRef } from "react";
import { useData } from "@/lib/DataContext";
import { GalleryItem } from "@/lib/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Pencil, Trash2, Plus, Image as ImageIcon, Upload } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function GalleryManager() {
  const { data, updateData } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<GalleryItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (item: GalleryItem) => {
    setCurrentItem(item);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setCurrentItem({
      id: 0,
      src: "",
      category: "Lab",
      title: ""
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCurrentItem(prev => prev ? ({ ...prev, src: result }) : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this image?")) {
      try {
        await api.gallery.delete(id);
        const newData = data.gallery.filter(i => i.id !== id);
        updateData('gallery', newData);
        toast.success("Image deleted");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete image");
      }
    }
  };

  const handleSave = async () => {
    if (!currentItem) return;

    // Validation
    if (!currentItem.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!currentItem.category.trim()) {
      toast.error("Category is required");
      return;
    }
    if (!currentItem.src.trim()) {
      toast.error("Image is required");
      return;
    }

    try {
      let newData;
      if (currentItem.id === 0) {
        const created = await api.gallery.create(currentItem);
        newData = [...data.gallery, created];
        toast.success("Image added successfully");
      } else {
        const updated = await api.gallery.update(currentItem.id, currentItem);
        newData = data.gallery.map(i => i.id === currentItem.id ? updated : i);
        toast.success("Image updated successfully");
      }

      updateData('gallery', newData);
      setIsDialogOpen(false);
      setCurrentItem(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to save image");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gallery Images</h2>
        <Button onClick={handleAdd} className="gap-2">
          <Plus size={16} /> Add Image
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.gallery.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="w-12 h-10 md:w-16 md:h-12 rounded overflow-hidden bg-gray-100 border border-gray-100">
                       {item.src ? (
                          <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                       ) : (
                          <ImageIcon className="w-5 h-5 m-auto mt-2.5 text-gray-400" />
                       )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium max-w-[150px] truncate md:max-w-none">{item.title}</TableCell>
                  <TableCell className="hidden md:table-cell">{item.category}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Pencil size={16} className="text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 size={16} className="text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{currentItem?.id === 0 ? "Add Image" : "Edit Image"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <Input 
                id="title" 
                value={currentItem?.title || ""} 
                onChange={(e) => setCurrentItem(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
              <Input 
                id="category" 
                value={currentItem?.category || ""} 
                onChange={(e) => setCurrentItem(prev => prev ? ({ ...prev, category: e.target.value }) : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="src">Image <span className="text-red-500">*</span></Label>
              <div className="flex gap-2">
                  <div className="h-10 w-16 rounded overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                    {currentItem?.src ? (
                        <img src={currentItem.src} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <ImageIcon className="w-5 h-5 m-auto mt-2.5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-grow">
                      <Input 
                        id="src" 
                        value={currentItem?.src || ""} 
                        onChange={(e) => setCurrentItem(prev => prev ? ({ ...prev, src: e.target.value }) : null)}
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