import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Search, Calendar, Filter, ArrowLeft, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Removed unused imports and simplified the component for design evaluation
const ALL_ACTIVITIES = [
  {
    id: 1,
    title: "New Research Grant Awarded",
    date: "Dec 15, 2024",
    summary: "The lab has received funding for a 3-year project on coastal plastic management.",
    category: "Announcement",
    image: "https://images.unsplash.com/photo-1532094349884-543bb1198c33?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Upcoming Workshop: Community Action",
    date: "Jan 10, 2025",
    summary: "Join us for a hands-on workshop on local sustainability initiatives.",
    category: "Event",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Student Fieldwork in Okinawa",
    date: "Nov 20, 2024",
    summary: "Graduate students conducted marine litter surveys across 5 beaches.",
    category: "Project Update",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    title: "International Symposium Presentation",
    date: "Oct 05, 2024",
    summary: "Dr. Tanaka presented our latest findings on microplastic degradation.",
    category: "Conference",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    title: "New Lab Equipment Installed",
    date: "Sep 22, 2024",
    summary: "Upgraded our spectroscopic analysis capabilities for better precision.",
    category: "Announcement",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    title: "Sustainability Week Campaign",
    date: "Aug 15, 2024",
    summary: "A week-long series of events promoting plastic-free living on campus.",
    category: "Event",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800"
  }
];

import { useQuery } from "@tanstack/react-query";
import { Activity } from "@shared/schema";

export default function AllActivities() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredActivities = ALL_ACTIVITIES.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || 
                         a.summary.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || a.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...Array.from(new Set(ALL_ACTIVITIES.map((a) => a.category)))];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/')}
              className="group text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Button>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                All Activities
              </motion.h1>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                className="h-1.5 bg-primary rounded-full mb-4" 
              />
              <p className="text-muted-foreground max-w-xl">
                Stay updated with our latest research findings, community events, and laboratory announcements.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-1 sm:min-w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search activities..." 
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-lg border">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select 
                  className="bg-transparent border-none focus:ring-0 text-sm font-semibold outline-none cursor-pointer"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredActivities.map((activity: any, idx: number) => (
                <motion.div
                  key={activity.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setLocation(`/activity/${activity.id}`)}
                  className="group bg-card rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col h-full"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <img 
                      src={activity.image} 
                      alt={activity.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="backdrop-blur-md bg-white/80 uppercase text-[10px] font-bold tracking-wider">
                        {activity.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-xs text-primary font-bold mb-3 uppercase tracking-widest">
                      <Calendar size={14} />
                      <span>{activity.date}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {activity.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6">
                      {activity.summary}
                    </p>
                    <div className="mt-auto flex items-center gap-1 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Read Details <ArrowRight size={16} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No activities found matching your criteria.</p>
              <Button variant="link" onClick={() => { setSearch(""); setCategory("All"); }}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
