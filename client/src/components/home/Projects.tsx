import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { Search, ChevronRight, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

// Mock data with direct Unsplash URLs to guarantee visibility for design check
// while local paths are being fixed
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
    paperDetails: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

export default function Projects() {
  const { data: dbProjects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const [, setLocation] = useLocation();

  // Use mock data if database is empty for design check
  const projects = dbProjects.length > 0 ? dbProjects : MOCK_PROJECTS;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [year, setYear] = useState("All");

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  const years = ["All", ...Array.from(new Set(projects.map((p) => p.year)))];

  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 9; // 3 rows * 3 columns

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    const matchesYear = year === "All" || p.year === year;
    return matchesSearch && matchesCategory && matchesYear;
  });

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const element = document.getElementById("projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Projects
          </motion.h2>
          <div className="w-24 h-1.5 bg-primary mx-auto mb-8 rounded-full" />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Explore our ongoing and past initiatives dedicated to environmental sustainability and community engagement.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 md:mb-12 items-stretch md:items-center justify-between bg-card p-4 rounded-xl shadow-sm border">
          <div className="relative w-full md:w-80 lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search Projects...." 
              className="pl-10 h-10 md:h-11 rounded-lg"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-lg border">
              <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Category</span>
              <select 
                className="bg-transparent border-none focus:ring-0 text-sm font-semibold outline-none cursor-pointer"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-lg border">
              <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Year</span>
              <select 
                className="bg-transparent border-none focus:ring-0 text-sm font-semibold outline-none cursor-pointer"
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {currentProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onView={() => setLocation(`/project/${project.id}`)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`min-w-[2rem] h-8 flex items-center justify-center rounded transition-colors ${
                    currentPage === page 
                      ? "text-primary font-bold bg-primary/10" 
                      : "text-muted-foreground cursor-pointer hover:text-primary hover:bg-accent"
                  }`}
                  data-testid={`button-pagination-${page}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <Button 
              variant="default" 
              className="px-8 bg-blue-600 hover:bg-blue-700"
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              data-testid="button-pagination-next"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, onView }: { project: Project; onView: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-card rounded-xl overflow-hidden shadow-md border cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onView}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img 
          src={project.image} 
          alt={project.title}
          key={project.image}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            // Use a local fallback if CDN fails
            target.src = "https://images.unsplash.com/photo-1518173946687-a4c8a9b746f5?auto=format&fit=crop&q=80&w=800";
            console.error(`Failed to load image: ${project.image}`);
          }}
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="secondary" className="uppercase text-[10px] font-bold tracking-wider">
            {project.category}
          </Badge>
        </div>

        {/* Hover Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="flex items-center gap-2 text-white font-bold text-lg"
              >
                <span>View</span>
                <ExternalLink className="w-5 h-5" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 uppercase group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <div 
          className="text-muted-foreground text-sm mb-4 line-clamp-3"
        >
          {project.description.replace(/<[^>]*>/g, '').split(' ').slice(0, 20).join(' ') + (project.description.replace(/<[^>]*>/g, '').split(' ').length > 20 ? '...' : '')}
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <span className={`text-sm font-bold ${project.status === 'Ongoing...' ? 'text-green-500' : 'text-muted-foreground'}`}>
            {project.status}
          </span>
          <div className="text-blue-600 text-sm font-bold flex items-center gap-1 group-hover:underline">
            Learn More <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
