import { useQuery, useMutation } from "@tanstack/react-query";
import { Project, insertProjectSchema, ProjectCategory } from "@shared/schema";
import type { researchTopics } from "@shared/schema";
type ResearchTopic = typeof researchTopics.$inferSelect;
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Loader2, Search, Check, ChevronsUpDown, Upload, X, PlusCircle } from "lucide-react";
import { useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { RichTextEditor } from "./RichTextEditor";

export default function ProjectManager() {
  const { toast } = useToast();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sectionFileInputRef = useRef<HTMLInputElement>(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: researchTopics = [] } = useQuery<ResearchTopic[]>({
    queryKey: ["/api/research"],
  });

  const { data: categories = [] } = useQuery<ProjectCategory[]>({
    queryKey: ["/api/project-categories"],
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await apiRequest("POST", "/api/project-categories", { name });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/project-categories"] });
      setNewCategory("");
      toast({ title: "Success", description: "Category added successfully" });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/project-categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/project-categories"] });
      toast({ title: "Success", description: "Category deleted successfully" });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/projects", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Success", description: "Project created successfully" });
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PATCH", `/api/projects/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Success", description: "Project updated successfully" });
      setIsDialogOpen(false);
      setEditingProject(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Success", description: "Project deleted successfully" });
    },
  });

  const form = useForm({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      category: "RESEARCH",
      year: new Date().getFullYear().toString(),
      status: "Ongoing...",
      tags: [] as string[],
      impact: "",
      paperUrl: "",
      paperDetails: null,
      sections: [] as { content: string, image?: string }[],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sections",
  });

  const onSubmit = (data: any) => {
    const formattedData = {
      ...data,
      impact: data.impact || "",
      paperUrl: data.paperUrl || "",
    };
    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, data: formattedData });
    } else {
      createMutation.mutate(formattedData);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    form.reset({
      ...project,
      impact: project.impact || "",
      paperUrl: project.paperUrl || "",
      paperDetails: project.paperDetails as any,
      sections: (project.sections as any[]) || [],
    });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingProject(null);
    form.reset({
      title: "",
      description: "",
      image: "",
      category: "RESEARCH",
      year: new Date().getFullYear().toString(),
      status: "Ongoing...",
      tags: [],
      impact: "",
      paperUrl: "",
      paperDetails: null,
      sections: [],
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        form.setValue("image", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSectionImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeSectionIndex !== null) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        form.setValue(`sections.${activeSectionIndex}.image`, result);
        setActiveSectionIndex(null);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-4 md:px-0">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Project Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="gap-2">
              <Plus className="h-4 w-4" /> Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Edit Project" : "Add New Project"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold border-b pb-2">1. Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <div className="space-y-2">
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map((cat) => (
                                    <div key={cat.id} className="flex items-center justify-between px-2 py-1">
                                      <SelectItem value={cat.name} className="flex-1">
                                        {cat.name}
                                      </SelectItem>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-destructive opacity-50 hover:opacity-100"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          if (confirm(`Are you sure you want to delete the category "${cat.name}"?`)) {
                                            deleteCategoryMutation.mutate(cat.id);
                                          }
                                        }}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </SelectContent>
                              </Select>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="New category name"
                                  value={newCategory}
                                  onChange={(e) => setNewCategory(e.target.value)}
                                  className="h-8"
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => {
                                    if (newCategory.trim()) {
                                      createCategoryMutation.mutate(newCategory.trim());
                                    }
                                  }}
                                  disabled={createCategoryMutation.isPending}
                                >
                                  Add
                                </Button>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Ongoing...">Ongoing</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title Image</FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                {field.value ? (
                                  <div className="relative w-32 h-32 rounded-md overflow-hidden border">
                                    <img src={field.value} alt="Preview" className="w-full h-full object-cover" />
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="icon"
                                      className="absolute top-1 right-1 h-6 w-6"
                                      onClick={() => field.onChange("")}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div 
                                    className="w-32 h-32 rounded-md border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-zinc-50"
                                    onClick={() => fileInputRef.current?.click()}
                                  >
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                  </div>
                                )}
                                <div className="flex flex-col gap-2">
                                  <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                  />
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    {field.value ? "Change Image" : "Choose Image"}
                                  </Button>
                                  <p className="text-xs text-muted-foreground">
                                    {field.value ? "Image chosen" : "No file chosen"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-bold border-b pb-2">2. Brief Details</h3>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brief Description</FormLabel>
                          <FormControl>
                            <RichTextEditor 
                              value={field.value} 
                              onChange={field.onChange} 
                              placeholder="Describe the project overview..." 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="impact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Impact Statement</FormLabel>
                          <FormControl>
                            <RichTextEditor 
                              value={field.value} 
                              onChange={field.onChange} 
                              placeholder="e.g. Helping local communities improve sustainability outcomes by 15%." 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="text-lg font-bold">Additional Paragraphs</h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => append({ content: "", image: "" })}
                        >
                          <PlusCircle className="h-4 w-4" /> Add Paragraph
                        </Button>
                      </div>

                      {fields.map((field, index) => (
                        <div key={field.id} className="space-y-4 p-4 border rounded-lg bg-zinc-50/50 relative">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 text-destructive z-10"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          <FormField
                            control={form.control}
                            name={`sections.${index}.content`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Paragraph Content</FormLabel>
                                <FormControl>
                                  <RichTextEditor 
                                    value={field.value} 
                                    onChange={field.onChange} 
                                    placeholder="Enter additional paragraph content..." 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`sections.${index}.image`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Paragraph Image (Optional)</FormLabel>
                                <FormControl>
                                  <div className="flex items-center gap-4">
                                    {field.value ? (
                                      <div className="relative w-24 h-24 rounded-md overflow-hidden border">
                                        <img src={field.value} alt="Section" className="w-full h-full object-cover" />
                                        <Button
                                          type="button"
                                          variant="destructive"
                                          size="icon"
                                          className="absolute top-1 right-1 h-6 w-6"
                                          onClick={() => form.setValue(`sections.${index}.image`, "")}
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <div 
                                        className="w-24 h-24 rounded-md border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-white"
                                        onClick={() => {
                                          setActiveSectionIndex(index);
                                          sectionFileInputRef.current?.click();
                                        }}
                                      >
                                        <Upload className="h-6 w-6 text-muted-foreground" />
                                      </div>
                                    )}
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setActiveSectionIndex(index);
                                        sectionFileInputRef.current?.click();
                                      }}
                                    >
                                      {field.value ? "Change" : "Upload"} Image
                                    </Button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      ))}
                      <input
                        type="file"
                        className="hidden"
                        ref={sectionFileInputRef}
                        accept="image/*"
                        onChange={handleSectionImageUpload}
                      />
                    </div>

                    {form.watch("status") === "Completed" && (
                      <div className="space-y-4 border rounded-lg p-4 bg-zinc-50/50">
                        <FormField
                          control={form.control}
                          name="paperUrl"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Linked Research Paper</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className={cn(
                                        "w-full justify-between bg-white",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      <span className="truncate">
                                        {field.value
                                          ? researchTopics.find(
                                              (topic) => topic.doi === field.value
                                            )?.title || field.value
                                          : "Select research paper..."}
                                      </span>
                                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                                  <Command>
                                    <CommandInput placeholder="Search research by title or DOI..." />
                                    <CommandEmpty>No research found.</CommandEmpty>
                                    <CommandGroup className="max-h-64 overflow-y-auto">
                                      {researchTopics.map((topic) => (
                                        <CommandItem
                                          value={topic.title}
                                          key={topic.id}
                                          onSelect={() => {
                                            form.setValue("paperUrl", topic.doi);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              topic.doi === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {topic.title}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                              <FormDescription>
                                Select a research paper from the available research database.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-zinc-50 px-2 text-muted-foreground">Or provide URL manually</span>
                          </div>
                        </div>
                        <FormField
                          control={form.control}
                          name="paperUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Manual Paper URL</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="https://..." />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="sticky bottom-0 bg-white pt-4 pb-2">
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-bold"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {editingProject ? "Update Project" : "Create Project"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-white shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50/50">
              <TableHead className="font-bold min-w-[200px]">Title</TableHead>
              <TableHead className="font-bold hidden sm:table-cell">Category</TableHead>
              <TableHead className="font-bold hidden md:table-cell">Year</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects?.map((project) => (
              <TableRow key={project.id} className="hover:bg-zinc-50/30">
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                    {project.category}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell">{project.year}</TableCell>
                <TableCell>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    project.status.toLowerCase().includes('ongoing') 
                      ? "bg-amber-50 text-amber-600" 
                      : "bg-emerald-50 text-emerald-600"
                  )}>
                    {project.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 hover:bg-zinc-100"
                      onClick={() => handleEdit(project)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this project?")) {
                          deleteMutation.mutate(project.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {projects?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 opacity-20" />
                    <p>No projects found. Create your first project to get started.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
