import { useState, useRef } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Plus, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

interface PrivateGalleryItem {
  id: number;
  src: string;
  category: string;
  title: string;
  year: string;
  description: string;
}

const CATEGORIES = ["Lab", "Fieldwork", "Research", "Events", "Microscopy", "Other"];
const YEARS = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString());

export default function PrivateGalleryManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<PrivateGalleryItem | null>(null);
  const [filterYear, setFilterYear] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: items = [] } = useQuery<PrivateGalleryItem[]>({
    queryKey: ["/api/private-gallery"],
  });
  const [isLoading, setIsLoading] = useState(false);

  const createMutation = useMutation({
    mutationFn: async (item: Omit<PrivateGalleryItem, "id">) => {
      const res = await fetch("/api/private-gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error("Failed to create");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/private-gallery"] });
      toast.success("Image added successfully");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (item: PrivateGalleryItem) => {
      const res = await fetch(`/api/private-gallery/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, id: undefined }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/private-gallery"] });
      toast.success("Image updated successfully");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/private-gallery/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/private-gallery"] });
      toast.success("Image deleted successfully");
    },
  });

  const handleEdit = (item: PrivateGalleryItem) => {
    setCurrentItem(item);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setCurrentItem({
      id: 0,
      src: "",
      category: "Lab",
      title: "",
      year: new Date().getFullYear().toString(),
      description: "",
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCurrentItem((prev: PrivateGalleryItem | null) =>
          prev ? { ...prev, src: result } : null
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this image?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = async () => {
    if (!currentItem) return;

    if (!currentItem.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!currentItem.category.trim()) {
      toast.error("Category is required");
      return;
    }
    if (!currentItem.year.trim()) {
      toast.error("Year is required");
      return;
    }
    if (!currentItem.src.trim()) {
      toast.error("Image is required");
      return;
    }

    try {
      if (currentItem.id === 0) {
        await createMutation.mutateAsync({
          src: currentItem.src,
          category: currentItem.category,
          title: currentItem.title,
          year: currentItem.year,
          description: currentItem.description,
        });
      } else {
        await updateMutation.mutateAsync(currentItem);
      }
      setIsDialogOpen(false);
      setCurrentItem(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to save image");
    }
  };

  const filteredItems = items.filter((item) => {
    if (filterYear && filterYear !== "all" && item.year !== filterYear) return false;
    if (filterCategory && filterCategory !== "all" && item.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Private Gallery</h2>
        <Button onClick={handleAdd} className="gap-2">
          <Plus size={16} /> Add Image
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-48">
          <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 block">Filter by Year</Label>
          <Select value={filterYear} onValueChange={setFilterYear}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {YEARS.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-48">
          <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 block">Filter by Category</Label>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden sm:table-cell">Year</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                        <ImageIcon className="text-gray-300" size={24} />
                      </div>
                      <p>{items.length === 0 ? "No images found" : "No images match filters"}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item: PrivateGalleryItem) => (
                  <TableRow key={item.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="w-12 h-10 rounded overflow-hidden border border-gray-100">
                        <img
                          src={item.src}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-[120px] truncate sm:max-w-none">{item.title}</TableCell>
                    <TableCell className="hidden md:table-cell">{item.category}</TableCell>
                    <TableCell className="hidden sm:table-cell">{item.year}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil size={16} className="text-blue-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentItem?.id === 0 ? "Add Image" : "Edit Image"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={currentItem?.title || ""}
                onChange={(e) =>
                  setCurrentItem((prev: PrivateGalleryItem | null) =>
                    prev ? { ...prev, title: e.target.value } : null
                  )
                }
                placeholder="Image title"
              />
            </div>

            <div>
              <Label>Category</Label>
              <Select
                value={currentItem?.category || "Lab"}
                onValueChange={(value: string) =>
                  setCurrentItem((prev: PrivateGalleryItem | null) =>
                    prev ? { ...prev, category: value } : null
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Year</Label>
              <Select
                value={currentItem?.year || ""}
                onValueChange={(value: string) =>
                  setCurrentItem((prev: PrivateGalleryItem | null) =>
                    prev ? { ...prev, year: value } : null
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Description</Label>
              <Input
                value={currentItem?.description || ""}
                onChange={(e) =>
                  setCurrentItem((prev: PrivateGalleryItem | null) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
                placeholder="Image description"
              />
            </div>

            <div>
              <Label>Image</Label>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors"
              >
                <Upload size={20} className="mx-auto mb-2" />
                <p className="text-sm font-medium">Click to upload image</p>
                {currentItem?.src && (
                  <img
                    src={currentItem.src}
                    alt="preview"
                    className="mt-4 max-h-48 mx-auto rounded"
                  />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                createMutation.isPending || updateMutation.isPending
              }
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
