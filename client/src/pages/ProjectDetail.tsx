import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Project } from "@shared/schema";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { 
  Calendar, 
  FileText,
  BarChart3,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Copy of MOCK_PROJECTS from Projects.tsx to handle project display when DB is empty
const MOCK_PROJECTS: Project[] = [
  {
    id: -1,
    title: "Marine Plastic Pollution Analysis",
    description: "Comprehensive study on the distribution and impact of microplastics in coastal waters, focusing on marine ecosystem health.",
    image: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?auto=format&fit=crop&q=80&w=800",
    category: "RESEARCH",
    year: "2024",
    status: "Ongoing...",
    tags: ["Microplastics", "OceanHealth"],
    paperUrl: null,
    paperDetails: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: -2,
    title: "Community Recycling Workshop",
    description: "Empowering local communities with sustainable waste management practices through interactive workshops and resource sharing.",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800",
    category: "COMMUNITY",
    year: "2023",
    status: "Completed",
    tags: ["ZeroWaste", "Education"],
    paperUrl: null,
    paperDetails: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: -3,
    title: "Climate Data Visualization AI",
    description: "Developing advanced AI models to visualize complex climate data patterns, helping policymakers make informed decisions.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    category: "TECHNOLOGY",
    year: "2024",
    status: "Ongoing...",
    tags: ["AI", "ClimateAction"],
    paperUrl: null,
    paperDetails: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: -4,
    title: "Urban River Restoration",
    description: "A community-led initiative to clean and restore local riverbanks, improving biodiversity and recreational spaces.",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800",
    category: "COMMUNITY",
    year: "2022",
    status: "Completed",
    tags: ["Conservation", "Rivers"],
    paperUrl: null,
    paperDetails: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: -5,
    title: "Solar Efficiency Research",
    description: "Testing next-generation solar panel coatings in diverse environmental conditions to maximize energy conversion rates.",
    image: "https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?auto=format&fit=crop&q=80&w=800",
    category: "RESEARCH",
    year: "2023",
    status: "Ongoing...",
    tags: ["Renewables", "Energy"],
    paperUrl: null,
    paperDetails: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: -6,
    title: "Forest Biodiversity Monitoring",
    description: "Using IoT sensors to track wildlife patterns and plant health in protected forest areas to prevent ecosystem degradation.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800",
    category: "TECHNOLOGY",
    year: "2024",
    status: "Ongoing...",
    tags: ["IoT", "Biodiversity"],
    paperUrl: null,
    paperDetails: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: -7,
    title: "Green Hydrogen Infrastructure",
    description: "Evaluating the scalability of green hydrogen production and its integration into the existing energy grid for carbon neutrality.",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800",
    category: "TECHNOLOGY",
    year: "2025",
    status: "Ongoing...",
    tags: ["Hydrogen", "CleanEnergy"],
    paperUrl: null,
    paperDetails: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: -8,
    title: "Sustainable Urban Gardens",
    description: "Analyzing the impact of vertical gardens on urban temperature regulation and local biodiversity in metropolitan areas.",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800",
    category: "COMMUNITY",
    year: "2024",
    status: "Ongoing...",
    tags: ["UrbanGreen", "Biodiversity"],
    paperUrl: null,
    paperDetails: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: -9,
    title: "E-Waste Robotics Recycling",
    description: "Implementing automated robotic systems for the precise dismantling and recycling of electronic waste components.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    category: "TECHNOLOGY",
    year: "2023",
    status: "Completed",
    tags: ["Robotics", "Recycling"],
    paperUrl: null,
    paperDetails: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: -10,
    title: "Ocean Energy Conversion",
    description: "Studying the efficiency of deep-sea turbines in capturing kinetic energy from ocean currents for remote coastal power.",
    image: "https://images.unsplash.com/photo-1439405326854-014607f694d7?auto=format&fit=crop&q=80&w=800",
    category: "RESEARCH",
    year: "2025",
    status: "Ongoing...",
    tags: ["MarinePower", "Engineering"],
    paperUrl: null,
    paperDetails: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: -11,
    title: "Smart Crop Irrigation",
    description: "Developing IoT-based precision irrigation systems to minimize water waste and maximize crop yields in arid regions.",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800",
    category: "TECHNOLOGY",
    year: "2024",
    status: "Ongoing...",
    tags: ["AgriTech", "WaterSaving"],
    paperUrl: null,
    paperDetails: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: -12,
    title: "Industrial Carbon Capture",
    description: "Designing and testing modular carbon capture units for existing industrial facilities to reduce direct CO2 emissions.",
    image: "https://images.unsplash.com/photo-1466611653911-954ffea113ad?auto=format&fit=crop&q=80&w=800",
    category: "RESEARCH",
    year: "2023",
    status: "Completed",
    tags: ["CarbonCapture", "ClimateChange"],
    paperUrl: null,
    paperDetails: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: -13,
    title: "Wetland Preservation Initiative",
    description: "Collaborating with local stakeholders to protect and restore critical wetland habitats through citizen science programs.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    category: "COMMUNITY",
    year: "2022",
    status: "Completed",
    tags: ["CitizensScience", "Wetlands"],
    paperUrl: null,
    paperDetails: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: -14,
    title: "Plastic-Free Supply Chains",
    description: "Assisting small businesses in transitioning to circular, plastic-free supply chains through policy and logistics consulting.",
    image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=800",
    category: "RESEARCH",
    year: "2024",
    status: "Ongoing...",
    tags: ["Sustainability", "SupplyChain"],
    paperUrl: null,
    paperDetails: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: -15,
    title: "Youth Environmental Leadership",
    description: "Mentoring the next generation of environmental leaders through a 12-month program focused on advocacy and project management.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800",
    category: "COMMUNITY",
    year: "2025",
    status: "Ongoing...",
    tags: ["Leadership", "Advocacy"],
    paperUrl: null,
    paperDetails: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

export default function ProjectDetail() {
  const [, params] = useRoute("/project/:id");
  const [, setLocation] = useLocation();
  const id = params?.id;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const { data: dbProjects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const allProjects = dbProjects.length > 0 ? dbProjects : MOCK_PROJECTS;
  const project = allProjects.find(p => String(p.id) === String(id));

  const handleBackToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    setLocation("/");
    setTimeout(() => {
      const element = document.getElementById("projects");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -2000 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -2000 }}
      transition={{ 
        type: "spring",
        damping: 30,
        stiffness: 150,
        mass: 1,
        duration: 0.8
      }}
      className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col"
    >
      <Header />
      
      <main className="flex-1">
        {/* Hero Section with Image and Overlay Back Button */}
        <div className="relative w-full h-[40vh] md:h-[60vh] overflow-hidden">
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="fixed top-[119px] md:top-[135px] left-4 md:left-8 z-50">
            <a 
              href="/#projects" 
              onClick={handleBackToProjects}
              className="inline-flex items-center gap-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-4 md:px-6 py-2 md:py-2.5 rounded-full text-zinc-900 dark:text-zinc-50 hover:bg-white dark:hover:bg-zinc-900 transition-all text-[10px] md:text-xs font-black shadow-xl border border-zinc-200/50 dark:border-zinc-800/50 tracking-widest"
            >
              <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 stroke-[3]" />
              BACK
            </a>
          </div>
        </div>

        <div className="container mx-auto max-w-[95%] px-4 py-8 md:py-12 mt-5 md:mt-8">
          <div className="space-y-8 md:space-y-16">
            {/* Header Section: Badges and Title */}
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-wrap gap-2 md:gap-3">
                <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none px-3 md:px-5 py-1 md:py-2 rounded-lg md:rounded-xl uppercase tracking-widest text-[9px] md:text-[11px] font-black">
                  {project.category}
                </Badge>
                <Badge variant="secondary" className="bg-green-50 text-green-600 border-none px-3 md:px-5 py-1 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-[11px] font-black tracking-wide uppercase">
                  {project.status}
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 leading-[1.1] md:leading-[1] break-words">
                {project.title}
              </h1>
            </div>

            {/* Impact and Timeline Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="flex items-center gap-3 md:gap-4 bg-white dark:bg-zinc-900 p-4 md:p-5 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <div className="bg-zinc-50 dark:bg-zinc-800 p-2 md:p-3 rounded-lg shrink-0">
                  <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-zinc-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] md:text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-0.5 truncate">Project Impact</div>
                  <div 
                    className="text-xs md:text-sm font-bold text-zinc-800 dark:text-zinc-200 leading-tight line-clamp-2 prose prose-sm dark:prose-invert max-w-none [&_p]:m-0"
                    dangerouslySetInnerHTML={{ __html: project.impact || "Sustainability focused research." }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 md:gap-4 bg-white dark:bg-zinc-900 p-4 md:p-5 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <div className="bg-zinc-50 dark:bg-zinc-800 p-2 md:p-3 rounded-lg shrink-0">
                  <Calendar className="w-5 h-5 md:w-6 md:h-6 text-zinc-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] md:text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-0.5 truncate">Timeline</div>
                  <div className="text-lg md:text-xl font-black text-zinc-800 dark:text-zinc-200 leading-none">
                    {project.year}
                  </div>
                </div>
              </div>
            </div>

            {/* Description and Sections */}
            <div className="space-y-4 md:space-y-6 text-sm md:text-base leading-relaxed text-zinc-600 dark:text-zinc-400 font-medium">
              <div 
                className="prose prose-sm md:prose-base dark:prose-invert max-w-none [&_p]:mb-3 last:[&_p]:mb-0"
                dangerouslySetInnerHTML={{ __html: project.description }}
              />
              
              {/* Dynamically rendered sections */}
              {(project.sections as any[])?.map((section, index) => (
                <div key={index} className="pt-4 md:pt-6 border-t border-zinc-100 dark:border-zinc-800 clearfix block overflow-visible">
                  {section.image && (
                    <div className={cn(
                      "rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-lg shrink-0",
                      section.content ? "w-[85%] sm:w-[60%] md:w-[45%] float-right ml-4 md:ml-6 mb-3 md:mb-4 mt-1" : "w-full mb-4"
                    )}>
                      <img 
                        src={section.image} 
                        alt={`Project detail ${index + 1}`} 
                        className={cn(
                          "w-full h-auto object-cover",
                          section.content ? "aspect-square md:aspect-auto" : "aspect-video"
                        )}
                      />
                    </div>
                  )}
                  {section.content && (
                    <div 
                      className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed text-justify break-words [&_p]:mb-3 last:[&_p]:mb-0"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  )}
                  <div className="clear-both" />
                </div>
              ))}
            </div>

            {/* Tags and Research Paper */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 md:gap-8 pt-8 md:pt-10 border-t mt-8 md:mt-10">
              <div className="flex flex-wrap gap-2 md:gap-3">
                {project.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="bg-zinc-50 dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-none px-3 md:px-5 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-[12px] font-black uppercase tracking-wide">
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              {project.paperUrl ? (
                <a href={project.paperUrl} target="_blank" rel="noopener noreferrer" className="w-full lg:w-auto">
                  <Button className="w-full gap-2 md:gap-3 bg-primary hover:bg-primary/90 text-white rounded-xl md:rounded-2xl h-12 md:h-14 px-6 md:px-10 font-black text-xs md:text-base shadow-xl transition-all active:scale-95">
                    View Research Paper
                    <FileText className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                </a>
              ) : (
                <div className="w-full lg:w-auto px-6 md:px-8 py-3 md:py-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl md:rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center">
                  <span className="text-zinc-400 font-black text-[10px] md:text-sm tracking-widest uppercase italic">
                    {project.status.toLowerCase().includes('ongoing') ? 'Research in Progress' : 'No Publication Available'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
}
