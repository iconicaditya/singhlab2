import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ChevronRight, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import ResearchPaperViewer from "./ResearchPaperViewer";
import { useData } from "@/lib/DataContext";

const categories = [
  "All",
  "Waste Management",
  "Climate Change",
  "Sustainable Tourism",
  "Renewable energy and tech"
];

export default function Research() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { t } = useLanguage();
  const [location, setLocation] = useLocation();
  const { data } = useData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const researchTopics = data?.research || [];
  const [selectedTopic, setSelectedTopic] = useState<typeof researchTopics[0] | null>(null);

  const filteredTopics = activeCategory === "All" 
    ? researchTopics 
    : researchTopics.filter(topic => topic.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] w-full bg-gray-900 mt-[60px] md:mt-[80px] overflow-hidden">
        <motion.div 
           initial={{ scale: 1.1 }}
           animate={{ scale: 1 }}
           transition={{ duration: 10, ease: "linear" }}
           className="absolute inset-0 w-full h-full"
        >
          <img 
            src="/images/research_hero_placeholder.png" 
            alt="Research Hero" 
            className="w-full h-full object-cover opacity-60"
            onError={(e) => {
              e.currentTarget.src = "/images/lush_green_forest_nature_landscape.png"; 
            }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-white tracking-tight text-center px-4 font-heading"
            >
              Research & Impact
            </motion.h1>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-black text-white sticky top-[60px] md:top-[80px] z-40 shadow-xl border-b border-gray-800">
        <div className="container mx-auto max-w-[1800px] flex flex-col md:flex-row">
          {/* Category Label Box */}
          <div className="bg-blue-600 px-8 py-4 flex items-center justify-center md:justify-start font-bold text-xl md:w-auto w-full tracking-wide">
            CATEGORY:
          </div>
          
          {/* Categories */}
          <div className="flex-1 flex flex-wrap items-center justify-center md:justify-start px-6 py-2 gap-4 md:gap-8 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-sm md:text-base whitespace-nowrap font-medium transition-all duration-300 relative group px-2 py-1 ${
                  activeCategory === cat ? "text-blue-400" : "text-gray-300 hover:text-white"
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" 
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="container mx-auto px-4 py-16 max-w-[1800px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredTopics.map((topic, idx) => (
              <motion.div
                layout
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group cursor-pointer flex flex-col shadow-sm hover:shadow-2xl transition-all duration-500 bg-white rounded-none overflow-hidden border border-transparent hover:border-gray-200"
                onClick={() => setSelectedTopic(topic)}
              >
                {/* Image Area */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-gray-200 relative">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 z-10" />
                  <img 
                    src={topic.image} 
                    alt={topic.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  {/* Category Badge overlay on image */}
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 z-20 rounded-sm">
                    {topic.category}
                  </div>

                  {/* Description Overlay - Moves UP from Bottom-Inside to Center */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/70 backdrop-blur-[2px]">
                     <div 
                       className="text-white text-center font-medium leading-relaxed transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out prose prose-invert prose-sm max-w-none"
                       dangerouslySetInnerHTML={{ __html: topic.description || "" }}
                     />
                  </div>
                </div>
                
                {/* Text Area */}
                <div className="bg-white p-6 flex items-center justify-between border border-t-0 border-gray-100 group-hover:bg-gray-50 transition-colors duration-300 relative z-20">
                  <span className="text-gray-900 text-lg font-bold leading-tight line-clamp-2 pr-4 group-hover:text-blue-600 transition-colors">
                    {topic.title}
                  </span>
                  <div className="bg-gray-100 rounded-full p-2 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <ChevronRight className="flex-shrink-0" size={20} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination (Mock) */}
        <div className="flex justify-center items-center gap-6 mt-20 text-gray-400 font-bold text-lg select-none">
          <span className="text-red-500 cursor-pointer relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-red-500 after:rounded-full">1</span>
          <span className="hover:text-gray-800 cursor-pointer transition-colors duration-300">2</span>
          <span className="hover:text-gray-800 cursor-pointer transition-colors duration-300">3</span>
          <span className="tracking-widest">...</span>
          <span className="hover:text-gray-800 cursor-pointer transition-colors duration-300 flex items-center gap-2 group">
            Next <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>

      <Footer />

      {selectedTopic && (
        <ResearchPaperViewer
          isOpen={!!selectedTopic}
          onClose={() => setSelectedTopic(null)}
          paper={selectedTopic}
          image={selectedTopic.image}
          status="Published"
        />
      )}
    </div>
  );
}
