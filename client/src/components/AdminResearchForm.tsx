import { useState, useRef, useEffect, useCallback } from "react";
import { 
  X, Upload, Plus, Trash2, Search, FlaskConical, 
  Bold, Italic, Underline, AlignLeft, AlignCenter, 
  AlignRight, Link, List, ListOrdered, Undo, Redo,
  Type, ChevronDown, BookOpen, User, Palette, Highlighter,
  Check,
  AlignJustify
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import LinkExtension from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { useData } from "@/lib/DataContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = [
  "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3", "#ffffff",
  "#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff",
  "#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc",
];

const FONT_FAMILIES = [
  { name: 'Default', value: 'Inter' },
  { name: 'Arial', value: 'Arial' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Tahoma', value: 'Tahoma, sans-serif' },
  { name: 'Calibri', value: 'Calibri, sans-serif' },
  { name: 'Garamond', value: 'Garamond, serif' },
  { name: 'Cambria', value: 'Cambria, serif' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif' },
];

const TEXT_SIZES = Array.from({ length: 51 }, (_, i) => ({
  name: `${i + 10}`,
  value: `${i + 10}px`
}));

// Custom Font Size Extension
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: element => element.style.fontSize,
        renderHTML: attributes => {
          if (!attributes.fontSize) {
            return {};
          }
          return {
            style: `font-size: ${attributes.fontSize}`,
          };
        },
      },
    };
  },
  addCommands() {
    return {
      ...this.parent?.(),
      setFontSize: (fontSize: string) => ({ chain }: { chain: any }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run();
      },
      unsetFontSize: () => ({ chain }: { chain: any }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run();
      },
    } as any;
  },
});

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    }
  }
}

const RichTextEditor = ({ value, onChange, placeholder }: { value: string, onChange: (val: string) => void, placeholder?: string }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc ml-4',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal ml-4',
          },
        },
      }),
      UnderlineExtension,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      LinkExtension.configure({ openOnClick: false }),
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1 items-center sticky top-0 z-10">
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => editor.chain().focus().undo().run()} 
          disabled={!editor.can().undo()}
        >
          <Undo size={14}/>
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => editor.chain().focus().redo().run()} 
          disabled={!editor.can().redo()}
        >
          <Redo size={14}/>
        </Button>
        <div className="w-[1px] h-6 bg-gray-200 mx-1" />
        
        {/* Font Family */}
        <Select onValueChange={(val) => editor.chain().focus().setFontFamily(val).run()}>
          <SelectTrigger className="h-8 w-32 border-none bg-transparent hover:bg-gray-200">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map(f => <SelectItem key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.name}</SelectItem>)}
          </SelectContent>
        </Select>

        {/* Text Size */}
        <Select onValueChange={(val) => editor.chain().focus().setFontSize(val).run()}>
          <SelectTrigger className="h-8 w-24 border-none bg-transparent hover:bg-gray-200">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {TEXT_SIZES.map(s => <SelectItem key={s.value} value={s.value}>{s.name}</SelectItem>)}
          </SelectContent>
        </Select>

        <div className="w-[1px] h-6 bg-gray-200 mx-1" />
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`} 
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={14}/>
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`} 
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={14}/>
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`} 
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline size={14}/>
        </Button>
        
        {/* Color Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8"><Palette size={14} /></Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2">
            <div className="grid grid-cols-10 gap-1">
              {COLORS.map(c => (
                <button key={c} type="button" className="w-5 h-5 rounded-sm border border-gray-200" style={{ backgroundColor: c }} onClick={() => editor.chain().focus().setColor(c).run()} />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Highlight Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8"><Highlighter size={14} /></Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2">
            <div className="grid grid-cols-10 gap-1">
              {COLORS.map(c => (
                <button key={c} type="button" className="w-5 h-5 rounded-sm border border-gray-200" style={{ backgroundColor: c }} onClick={() => editor.chain().focus().toggleHighlight({ color: c }).run()} />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <div className="w-[1px] h-6 bg-gray-200 mx-1" />
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 text-primary' : ''}`} 
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeft size={14}/>
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 text-primary' : ''}`} 
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenter size={14}/>
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 text-primary' : ''}`} 
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <AlignRight size={14}/>
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200 text-primary' : ''}`} 
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        >
          <AlignJustify size={14}/>
        </Button>
        
        <div className="w-[1px] h-6 bg-gray-200 mx-1" />
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 ${editor.isActive('bulletList') ? 'bg-gray-200 text-primary' : ''}`} 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={14}/>
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 ${editor.isActive('orderedList') ? 'bg-gray-200 text-primary' : ''}`} 
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={14}/>
        </Button>
      </div>
      <div className="flex-1 overflow-auto bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default function AdminResearchForm({ onCancel, onSuccess, initialData }: { onCancel: () => void, onSuccess: () => void, initialData?: any }) {
  const { data, updateData } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [categories, setCategories] = useState([
    "Waste Management", "Climate Change", "Sustainable Tourism", "Renewable energy and tech"
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [pubSearchTerm, setPubSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    category: initialData?.category || "",
    year: initialData?.year || new Date().getFullYear(),
    description: initialData?.description || "",
    image: initialData?.image || "",
    abstract: initialData?.abstract || "",
    authors: initialData?.authors || [{ name: "", image: "" }],
    doi: initialData?.doi || "",
    journal: initialData?.journal || "",
    sections: initialData?.sections || [{ title: "", content: "", image: "" }],
    relatedPublicationIds: initialData?.relatedPublicationIds || [] as number[]
  });

  const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (wordCount(val) <= 30 || val.length < formData.description.length) {
      setFormData(prev => ({ ...prev, description: val }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'main' | 'author' | 'section', index?: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (target === 'main') {
          setFormData(prev => ({ ...prev, image: result }));
        } else if (target === 'author' && typeof index === 'number') {
          const newAuthors = [...formData.authors];
          newAuthors[index] = { ...newAuthors[index], image: result };
          setFormData(prev => ({ ...prev, authors: newAuthors }));
        } else if (target === 'section' && typeof index === 'number') {
          const newSections = [...formData.sections];
          newSections[index] = { ...newSections[index], image: result };
          setFormData(prev => ({ ...prev, sections: newSections }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredPublications = data.publications.filter(p => 
    p.title.toLowerCase().includes(pubSearchTerm.toLowerCase()) && 
    !formData.relatedPublicationIds.includes(p.id)
  );

  const handleSave = async () => {
    if (!formData.title || !formData.category || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      let result: any;
      if (initialData?.id) {
        result = await api.research.update(initialData.id, formData);
        const updatedList = data.research.map(item => item.id === initialData.id ? result : item);
        updateData('research', updatedList);
        toast.success("Research updated successfully");
      } else {
        result = await api.research.create(formData);
        updateData('research', [result, ...data.research]);
        toast.success("Research added successfully");
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to save research");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 px-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{initialData ? "Edit Research" : "Add New Research"}</h2>
        <p className="text-gray-500">{initialData ? "Update the existing research details." : "Manage details for the research card and viewer."}</p>
      </div>

      {/* 1. Basic Information */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</div>
          <h3 className="text-xl font-bold">Basic Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input placeholder="Enter title" value={formData.title} onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="flex gap-2">
              <Select value={formData.category} onValueChange={val => setFormData(prev => ({ ...prev, category: val }))}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <div key={cat} className="flex items-center justify-between px-2 hover:bg-gray-100 rounded-sm">
                      <SelectItem value={cat} className="flex-1 border-none bg-transparent shadow-none focus:bg-transparent">{cat}</SelectItem>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-700" onClick={(e) => {
                        e.stopPropagation();
                        setCategories(prev => prev.filter(c => c !== cat));
                        if (formData.category === cat) setFormData(prev => ({ ...prev, category: "" }));
                      }}><Trash2 size={12}/></Button>
                    </div>
                  ))}
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild><Button variant="outline"><Plus size={16}/></Button></PopoverTrigger>
                <PopoverContent className="w-64 p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>New Category</Label>
                    <Input placeholder="Name..." value={newCategory} onChange={e => setNewCategory(e.target.value)} />
                  </div>
                  <Button className="w-full" onClick={() => { if (newCategory) { setCategories([...categories, newCategory]); setNewCategory(""); } }}>Add Category</Button>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Year</Label>
            <Input type="number" value={formData.year} onChange={e => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <Label>Summary Description *</Label>
              <span className={`text-[10px] font-bold ${wordCount(formData.description) >= 30 ? 'text-red-500' : 'text-gray-400'}`}>
                {wordCount(formData.description)}/30 words
              </span>
            </div>
            <Textarea 
              placeholder="Brief summary (max 30 words)..." 
              value={formData.description} 
              onChange={handleSummaryChange}
              className="h-20 resize-none" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Title Image</Label>
          <div className="flex items-center gap-4">
            <div className="w-32 h-32 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
              {formData.image ? <img src={formData.image} alt="Preview" className="w-full h-full object-cover" /> : <Upload className="text-gray-300" />}
            </div>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
              <Upload size={16} /> Choose Image
            </Button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'main')} />
          </div>
        </div>
      </section>

      {/* 2. Advance Information */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">2</div>
          <h3 className="text-xl font-bold">Advance Information</h3>
        </div>

        <div className="space-y-2">
          <Label>Abstract</Label>
          <Textarea placeholder="Detailed abstract..." value={formData.abstract} onChange={e => setFormData(prev => ({ ...prev, abstract: e.target.value }))} className="min-h-[120px]" />
        </div>

        <div className="space-y-8">
          <Label className="text-lg font-bold">Contents</Label>
          <AnimatePresence>
            {formData.sections.map((section: any, idx: number) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 p-4 border border-gray-100 rounded-xl relative bg-white shadow-sm">
                <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 text-red-500 bg-white shadow-sm border h-8 w-8" onClick={() => setFormData(prev => ({ ...prev, sections: prev.sections.filter((_: any, i: number) => i !== idx) }))}><Trash2 size={14}/></Button>
                <Input placeholder="Section Title (e.g. Introduction)" value={section.title} onChange={e => {
                  const newSections = [...formData.sections];
                  newSections[idx] = { ...newSections[idx], title: e.target.value };
                  setFormData(prev => ({ ...prev, sections: newSections }));
                }} />
                <RichTextEditor value={section.content} onChange={val => {
                  const newSections = [...formData.sections];
                  newSections[idx] = { ...newSections[idx], content: val };
                  setFormData(prev => ({ ...prev, sections: newSections }));
                }} />
                
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">Section Image (Optional)</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 border border-dashed border-gray-200 rounded flex items-center justify-center overflow-hidden bg-gray-50">
                      {section.image ? <img src={section.image} alt="Preview" className="w-full h-full object-cover" /> : <Upload size={16} className="text-gray-300" />}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => handleImageUpload(e as any, 'section', idx);
                      input.click();
                    }}>Upload Image</Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <Button variant="outline" className="w-full border-dashed py-8" onClick={() => setFormData(prev => ({ ...prev, sections: [...prev.sections, { title: "", content: "", image: "" }] }))}>
            <Plus size={16} className="mr-2" /> Add Content Section
          </Button>
        </div>
      </section>

      {/* 3. Paper Details & Authors */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">3</div>
          <h3 className="text-xl font-bold">Paper Details & Authors</h3>
        </div>

        <div className="space-y-4">
          <Label className="font-bold">Authors</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {formData.authors.map((author: any, idx: number) => (
                <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3 p-3 border border-gray-100 rounded-lg bg-gray-50/50 relative group">
                  <div className="w-12 h-12 rounded-full border border-gray-200 bg-white flex-shrink-0 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-gray-100" onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => handleImageUpload(e as any, 'author', idx);
                    input.click();
                  }}>
                    {author.image ? <img src={author.image} alt="" className="w-full h-full object-cover" /> : <User size={20} className="text-gray-400" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <Input className="h-10 bg-white" placeholder="Author Name" value={author.name} onChange={e => {
                      const newAuthors = [...formData.authors];
                      newAuthors[idx] = { ...newAuthors[idx], name: e.target.value };
                      setFormData(prev => ({ ...prev, authors: newAuthors }));
                    }} />
                  </div>
                  {formData.authors.length > 1 && (
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-600" onClick={() => setFormData(prev => ({ ...prev, authors: prev.authors.filter((_: any, i: number) => i !== idx) }))}><X size={14}/></Button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <Button variant="outline" size="sm" className="w-full border-dashed" onClick={() => setFormData(prev => ({ ...prev, authors: [...prev.authors, { name: "", image: "" }] }))}>
            <Plus size={14} className="mr-1" /> Add Author
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>DOI</Label>
            <Input placeholder="10.1021/..." value={formData.doi} onChange={e => setFormData(prev => ({ ...prev, doi: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Journal</Label>
            <Input placeholder="e.g. Env. Sci. & Tech." value={formData.journal} onChange={e => setFormData(prev => ({ ...prev, journal: e.target.value }))} />
          </div>
        </div>
      </section>

      {/* 4. Related Publications */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">4</div>
          <h3 className="text-xl font-bold">Related Publications</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {formData.relatedPublicationIds.map((id: number) => {
                const pub = data.publications.find(p => p.id === id);
                return pub ? (
                  <motion.div key={id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs flex items-center gap-2 border border-blue-100 font-medium shadow-sm">
                    <BookOpen size={12} /> <span className="max-w-[200px] truncate">{pub.title}</span>
                    <button onClick={() => setFormData(prev => ({ ...prev, relatedPublicationIds: prev.relatedPublicationIds.filter((pid: number) => pid !== id) }))} className="hover:text-red-500"><X size={12}/></button>
                  </motion.div>
                ) : null;
              })}
            </AnimatePresence>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full border-dashed justify-start text-gray-500 font-normal">
                <Search size={16} className="mr-2" /> Search and Add Publications...
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <div className="p-3 border-b border-gray-100">
                <Input placeholder="Type to search..." value={pubSearchTerm} onChange={e => setPubSearchTerm(e.target.value)} className="h-9" autoFocus />
              </div>
              <div className="max-h-[300px] overflow-auto p-1">
                {filteredPublications.length > 0 ? (
                  filteredPublications.map(pub => (
                    <button key={pub.id} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors flex flex-col gap-1" onClick={() => {
                      setFormData(prev => ({ ...prev, relatedPublicationIds: [...prev.relatedPublicationIds, pub.id] }));
                      setPubSearchTerm("");
                    }}>
                      <span className="font-medium line-clamp-1">{pub.title}</span>
                      <span className="text-[10px] text-gray-400">{pub.journal} • {pub.year}</span>
                    </button>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-400 text-sm">No publications found</div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      <div className="flex justify-end gap-3 pt-8 border-t border-gray-100 sticky bottom-6 z-20 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[160px] shadow-md transition-all hover:scale-[1.02]">
          {isSubmitting ? "Creating..." : "Publish Research"}
        </Button>
      </div>
    </div>
  );
}
