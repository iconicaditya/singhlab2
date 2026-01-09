import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download, Quote, Share2, BookOpen, Maximize2, Minimize2, ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PaperContent from "@/components/projects/PaperContent";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLocation } from "wouter";
import { toast } from "sonner";
import html2pdf from "html2pdf.js";

import { useData, ResearchTopic } from "@/lib/DataContext";

interface ResearchPaperViewerProps {
  isOpen: boolean;
  onClose: () => void;
  paper: ResearchTopic;
  image: string;
  status?: string;
}

export default function ResearchPaperViewer({ isOpen, onClose, paper, image, status }: ResearchPaperViewerProps) {
  const [location] = useLocation();
  const initialLocation = useRef(location);
  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const isOngoing = status === "Ongoing";

  // Type guard to check if paper is ResearchTopic
  const isResearchTopic = (p: ResearchTopic): p is ResearchTopic => {
    return 'relatedPublicationIds' in p;
  };

  // Find related publications from the global publications data using IDs
  const { data } = useData();
  const relatedProjectsFromIds = isResearchTopic(paper) && paper.relatedPublicationIds && Array.isArray(paper.relatedPublicationIds)
    ? data.publications.filter(pub => (paper.relatedPublicationIds as number[]).includes(pub.id)).map(pub => ({
        paperDetails: {
            title: pub.title,
            journal: pub.journal,
            date: pub.year,
            authors: pub.authors
        }
    }))
    : [];
    
  // Fallback if no specific related publications
  const relatedProjects = relatedProjectsFromIds.length > 0 
    ? relatedProjectsFromIds 
    : data.publications.slice(0, 2).map(pub => ({
        paperDetails: {
            title: pub.title,
            journal: pub.journal,
            date: pub.year,
            authors: pub.authors
        }
    }));

  // Close the viewer when the route changes (e.g., clicking a nav link)
  useEffect(() => {
    if (isOpen && location !== initialLocation.current) {
      onClose();
    }
  }, [location, onClose, isOpen]);

  // Update initial location when opening
  useEffect(() => {
    if (isOpen) {
        initialLocation.current = location;
    }
  }, [isOpen, location]);

  const handleScroll = () => {
    if (containerRef.current) {
        setIsScrolled(containerRef.current.scrollTop > 50);
    }
  };

  const handleCite = () => {
    const authorNames = paper.authors.map((a: any) => typeof a === 'string' ? a : a.name).join(", ");
    const citation = `${authorNames} (${String(paper.year).split(' ').pop()}). ${paper.title}. ${paper.journal}. DOI: ${paper.doi}`;
    navigator.clipboard.writeText(citation);
    toast.success("Citation copied to clipboard!");
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sections = [
    { id: 'abstract', label: 'Abstract' },
    { id: 'introduction', label: 'Introduction' },
    { id: 'methodology', label: 'Methodology' },
    { id: 'results', label: 'Results & Discussion' },
    { id: 'conclusion', label: 'Conclusion' },
    { id: 'references', label: 'References' },
    { id: 'related', label: 'Related Publications' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-screen h-screen max-w-none m-0 p-0 border-0 rounded-none overflow-hidden flex flex-col bg-white">
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex flex-col h-full overflow-y-auto"
                onScroll={handleScroll}
                ref={containerRef}
            >
                {/* Fixed Header Container - Using relative to keep flow but allowing it to be part of the scroll or sticky */}
                {/* Using sticky to keep it visible while scrolling content */}
                <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                    <Header onNavigate={onClose} isScrolled={isScrolled} />
                </div>
                
                {/* Close Button / Back */}
                <div className="fixed top-36 left-4 md:left-8 z-40">
                    <Button 
                        onClick={onClose} 
                        variant="secondary" 
                        size="sm"
                        className="shadow-lg bg-white/90 backdrop-blur hover:bg-white gap-2 rounded-full"
                    >
                        <ArrowLeft size={16} /> Back
                    </Button>
                </div>

                <div className="flex-grow">
                    {/* Hero Image Section */}
                    <div className="relative h-[65vh] min-h-[500px] w-full overflow-hidden">
                        <img 
                            src={image} 
                            alt={paper.title} 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-12 md:pb-16 text-white">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="max-w-6xl"
                            >
                                <div className="flex items-center gap-3 mb-4 text-gray-300 text-sm font-medium">
                                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white border border-white/10 uppercase tracking-wider text-xs">
                                        {paper.journal}
                                    </span>
                                    <span>•</span>
                                    <span>{paper.year}</span>
                                </div>
                                <h1 className="text-2xl md:text-4xl lg:text-5xl md:leading-tight font-bold font-serif mb-4 shadow-sm">
                                    {paper.title}
                                </h1>
                                <div className="flex flex-wrap gap-3">
                                    {paper.authors.map((author: any, idx: number) => {
                                        const name = typeof author === 'string' ? author : author.name;
                                        const image = typeof author === 'string' ? null : author.image;
                                        
                                        return (
                                        <div key={idx} className="flex items-center gap-2 bg-black/30 pr-3 pl-1 py-1 rounded-full backdrop-blur-sm border border-white/10">
                                            {image ? (
                                                <img src={image} className="w-6 h-6 rounded-full object-cover border border-white/20" />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                                                    {name.charAt(0)}
                                                </div>
                                            )}
                                            <span className="text-sm text-gray-200 font-medium">
                                                {name}
                                            </span>
                                        </div>
                                    )})}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="bg-white">
                        <div className="container mx-auto px-4 py-16 md:py-24">
                            {isOngoing ? (
                                <div className="max-w-4xl mx-auto text-center">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="py-12"
                                    >
                                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                                <BookOpen className="w-8 h-8 text-blue-600" />
                                            </div>
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                            Research Topic
                                        </h2>
                                        <div className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed text-left prose prose-lg" dangerouslySetInnerHTML={{ __html: paper.abstract }} />
                                        
                                        <div className="grid md:grid-cols-3 gap-6 text-left mt-12 max-w-3xl mx-auto">
                                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                                <h3 className="font-bold text-slate-900 mb-2">Current Phase</h3>
                                                <p className="text-slate-600 text-sm">Data Collection & Analysis</p>
                                            </div>
                                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                                <h3 className="font-bold text-slate-900 mb-2">Expected Publication</h3>
                                                <p className="text-slate-600 text-sm">Coming Soon</p>
                                            </div>
                                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                                <h3 className="font-bold text-slate-900 mb-2">Principal Investigator</h3>
                                                <p className="text-slate-600 text-sm">
                                                    {(() => {
                                                        const firstAuthor = paper.authors[0];
                                                        if (!firstAuthor) return "Unknown";
                                                        // @ts-ignore
                                                        return typeof firstAuthor === 'string' ? firstAuthor : firstAuthor.name;
                                                    })()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-12 p-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                            <h3 className="font-bold text-gray-900 mb-4">Subscribe for Updates</h3>
                                            <div className="flex gap-2 max-w-md mx-auto">
                                                <input 
                                                    type="email" 
                                                    placeholder="Enter your email" 
                                                    className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <Button onClick={() => toast.success("You'll be notified when this research is published!")}>
                                                    Notify Me
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            ) : (
                                <div className="grid lg:grid-cols-[1fr_300px] gap-12 max-w-6xl mx-auto">
                                {/* Main Article */}
                                <div id="paper-content-source">
                                   <PaperContent 
                                        abstract={paper.abstract} 
                                        sections={paper.sections} 
                                        references={paper.references}
                                   />

                                   {/* Related Publications Section - Always Show */}
                                     <div id="related" className="mt-24 pt-12 border-t border-slate-200 scroll-mt-32">
                                         <div className="flex items-center gap-3 mb-8">
                                            <div className="h-8 w-1 bg-blue-600 rounded-full" />
                                            <h3 className="text-2xl font-bold font-serif text-slate-900">Related Publications</h3>
                                         </div>
                                         <div className="grid md:grid-cols-2 gap-6">
                                             {relatedProjects.map((pub, idx) => (
                                                 <div key={idx} className="group bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden">
                                                     <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />
                                                     <div className="relative z-10">
                                                        <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                            <FileText size={12} />
                                                            {pub.paperDetails?.journal} • {pub.paperDetails?.date}
                                                        </div>
                                                        <h4 className="font-bold text-lg text-slate-900 mb-3 group-hover:text-blue-700 transition-colors leading-snug line-clamp-2">
                                                            {pub.paperDetails?.title}
                                                        </h4>
                                                        <div className="text-sm text-slate-500 mb-4 line-clamp-1">{pub.paperDetails?.authors.join(", ")}</div>
                                                        <div className="flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transform duration-300">
                                                            Read Paper <ArrowRight size={14} className="ml-1" />
                                                        </div>
                                                     </div>
                                                 </div>
                                             ))}
                                         </div>
                                     </div>
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-8">
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 sticky top-36">
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Table of Contents</h3>
                                        <div className="space-y-2 mb-8">
                                            {sections.filter(s => s.label !== 'Table of Contents').map((section) => (
                                                <button
                                                    key={section.id}
                                                    onClick={() => scrollToSection(section.id)}
                                                    className="block w-full text-left text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2 py-1.5 rounded transition-colors border-l-2 border-transparent hover:border-blue-500"
                                                >
                                                    {section.label}
                                                </button>
                                            ))}
                                            {paper.sections?.map((section: any) => section.title && (
                                                <button
                                                    key={section.id}
                                                    onClick={() => scrollToSection(section.id)}
                                                    className="block w-full text-left text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2 py-1.5 rounded transition-colors border-l-2 border-transparent hover:border-blue-500"
                                                >
                                                    {section.title}
                                                </button>
                                            ))}
                                        </div>

                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-t border-slate-200 pt-4">Paper Details</h3>
                                        <div className="space-y-4 text-sm">
                                            <div>
                                                <div className="text-slate-500 mb-1 font-medium">DOI</div>
                                                <div className="font-mono text-slate-700 bg-white p-2 rounded border border-slate-200 text-xs break-all">{paper.doi}</div>
                                            </div>
                                            <div>
                                                <div className="text-slate-500 mb-1 font-medium">Publication Date</div>
                                                <div className="text-slate-900">{paper.year}</div>
                                            </div>
                                            <div>
                                                <div className="text-slate-500 mb-1 font-medium">Journal</div>
                                                <div className="text-slate-900 italic">{paper.journal}</div>
                                            </div>
                                            
                                            <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    className="w-full gap-2 bg-white"
                                                    onClick={handleCite}
                                                >
                                                    <Quote size={16} /> Cite Paper
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <Footer onNavigate={onClose} />
                </div>
            </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
