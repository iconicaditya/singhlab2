import { motion } from "framer-motion";
import { useParams, Link } from "wouter";
import { 
  ArrowLeft, 
  Calendar, 
  Tag, 
  Share2, 
  Printer, 
  Clock, 
  User,
  ChevronRight,
  BookOpen,
  Globe,
  MessageSquare,
  Award,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Placeholder data for design evaluation
const ACTIVITIES_PLACEHOLDERS = [
  {
    id: 1,
    title: "Breakthrough in Microplastic Degradation Using Engineered Enzymes",
    date: "May 15, 2024",
    category: "Research News",
    summary: "Our team has identified a novel enzyme variant that accelerates the breakdown of polyethylene terephthalate (PET) in saltwater environments.",
    image: "https://images.unsplash.com/photo-1532187875605-2fe358a71424?auto=format&fit=crop&q=80&w=1200",
    content: `
      <p>The SinghLab is proud to announce a significant milestone in our ongoing efforts to combat marine plastic pollution. Our researchers, led by Dr. Sarah Chen, have successfully engineered a thermophilic enzyme variant capable of degrading PET plastics significantly faster than previously documented strains.</p>
      <h3>Key Findings</h3>
      <p>The study, published in the latest issue of <em>Nature Sustainability</em>, demonstrates that the enzyme remains stable and active in varying salinity levels, making it a viable candidate for ocean-based bioremediation strategies.</p>
      <p>This breakthrough opens new avenues for developing sustainable waste management solutions and highlights the power of synthetic biology in addressing global environmental challenges.</p>
    `,
    author: "Dr. Sarah Chen",
    readTime: "8 min read",
    tags: ["Biotechnology", "Microplastics", "Sustainability"],
    objectives: ["Enhance enzyme stability", "Quantify degradation rates", "Scale up production"]
  },
  {
    id: 2,
    title: "Annual Environmental Impact Symposium 2024",
    date: "June 2, 2024",
    category: "Event",
    summary: "Join us for a two-day symposium featuring leading experts in climate science and environmental policy.",
    image: "https://images.unsplash.com/photo-1540575861501-7ad067638dfd?auto=format&fit=crop&q=80&w=1200",
    content: "<p>The symposium will focus on the intersection of data science and conservation, with keynote speakers from the UN Environment Programme and various global research institutes.</p>",
    author: "SinghLab Events Team",
    readTime: "5 min read",
    tags: ["Conference", "Policy", "Climate Change"],
    objectives: ["Facilitate collaboration", "Share latest findings", "Draft policy recommendations"]
  },
  {
    id: 3,
    title: "New Partnership with Global Ocean Initiative",
    date: "April 28, 2024",
    category: "Announcement",
    summary: "SinghLab officially joins forces with the GOI to expand our coastal monitoring network across Southeast Asia.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
    content: "<p>This strategic partnership will provide our researchers with access to extensive satellite data and local monitoring stations, enhancing the accuracy of our plastic drift models.</p>",
    author: "Lab Director",
    readTime: "4 min read",
    tags: ["Partnership", "Oceanography", "Global Impact"],
    objectives: ["Expand data collection", "Strengthen regional ties", "Improve model accuracy"]
  },
  { id: 4, title: "Field Study: Great Barrier Reef Monitoring", date: "July 12, 2024", category: "Project Update", summary: "Initial data from our summer expedition reveals concerning trends in coral bleaching.", image: "https://images.unsplash.com/photo-1546027658-e536f19109ef?auto=format&fit=crop&q=80&w=1200", content: "<p>The team spent three weeks mapping high-risk zones and collecting water samples for nutrient analysis.</p>", author: "Team Lead", readTime: "10 min read", tags: ["Fieldwork", "Coral Reefs", "Climate Change"], objectives: ["Map bleaching zones", "Analyze water chemistry"] },
  { id: 5, title: "Grant Award: Sustainable Fisheries Research", date: "August 5, 2024", category: "Announcement", summary: "We are honored to receive the National Science Foundation grant for our work on artisanal fisheries.", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200", content: "<p>The $2M grant will support five PhD students and the development of new tracking technologies.</p>", author: "Lab Office", readTime: "3 min read", tags: ["Funding", "Fisheries", "NSF"], objectives: ["Support PhD researchers", "Develop tracking tools"] },
  { id: 6, title: "Workshop: Advanced Chemical Analysis", date: "September 15, 2024", category: "Event", summary: "Hands-on training session for graduate students on mass spectrometry techniques.", image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=1200", content: "<p>A comprehensive workshop covering sample preparation and data interpretation for environmental toxins.</p>", author: "Dr. Robert Miller", readTime: "15 min read", tags: ["Education", "Chemistry", "Technique"], objectives: ["Master sample prep", "Analyze complex spectra"] },
  { id: 7, title: "Publication: Trends in Urban Plastic Waste", date: "October 10, 2024", category: "Research News", summary: "Our latest paper analyzes the impact of municipal policy changes on plastic output in three major cities.", image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=1200", content: "<p>Study shows that plastic bag bans combined with improved recycling infrastructure leads to a 30% reduction in landfill waste.</p>", author: "Dr. Sarah Chen", readTime: "12 min read", tags: ["Urban Planning", "Policy", "Recycling"], objectives: ["Assess policy impact", "Identify best practices"] },
  { id: 8, title: "Community Outreach: Clean Water Initiative", date: "November 5, 2024", category: "Event", summary: "Lab members volunteer at local schools to teach water quality testing.", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200", content: "<p>Engaging the next generation of scientists through practical experiments and storytelling about our oceans.</p>", author: "Outreach Coordinator", readTime: "6 min read", tags: ["Outreach", "Education", "Water Quality"], objectives: ["Inspire students", "Test local sources"] },
  { id: 9, title: "Tech Demo: Autonomous Underwater Vehicles", date: "December 1, 2024", category: "Announcement", summary: "First successful deployment of our custom-built AUV for deep-sea plastic detection.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200", content: "<p>The AUV reached depths of 2000m and successfully identified microplastic hotspots using on-board AI.</p>", author: "Engineering Team", readTime: "9 min read", tags: ["Robotics", "AI", "Oceanography"], objectives: ["Verify depth capability", "Test detection algorithms"] }
];

export default function ActivitiesDetails() {
  const { id } = useParams();
  
  // Find activity from placeholders
  const activity = ACTIVITIES_PLACEHOLDERS.find(a => a.id === Number(id)) || ACTIVITIES_PLACEHOLDERS[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] flex flex-col font-sans">
      <Header />

      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Sidebar: Navigation & Meta */}
            <aside className="lg:col-span-3 space-y-8 order-2 lg:order-1">
              <div className="sticky top-28 space-y-8">
                <Link href="/activities">
                  <Button variant="ghost" className="group text-muted-foreground hover:text-primary pl-0">
                    <ArrowLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Feed
                  </Button>
                </Link>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Metadata</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <User size={16} className="text-primary" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{activity.author}</p>
                          <p className="text-[10px]">Lead Researcher</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <Calendar size={16} className="text-primary" />
                        <span>{activity.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <Clock size={16} className="text-primary" />
                        <span>{activity.readTime}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Sharing</h4>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="rounded-xl border-slate-200 dark:border-slate-800"><Share2 size={16} /></Button>
                      <Button variant="outline" size="icon" className="rounded-xl border-slate-200 dark:border-slate-800" onClick={() => window.print()}><Printer size={16} /></Button>
                      <Button variant="outline" size="icon" className="rounded-xl border-slate-200 dark:border-slate-800"><MessageSquare size={16} /></Button>
                    </div>
                  </div>

                  {activity.tags && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Relevant Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {activity.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 transition-colors">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <article className="lg:col-span-9 order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                {/* Hero Header */}
                <div className="space-y-6">
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors uppercase tracking-widest px-4 py-1.5 rounded-lg font-bold">
                    {activity.category}
                  </Badge>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                    {activity.title}
                  </h1>
                  <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-3xl">
                    {activity.summary}
                  </p>
                </div>

                {/* Featured Image with Glassmorphism Overlay */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative aspect-[21/9] rounded-[2rem] overflow-hidden shadow-2xl">
                    <img 
                      src={activity.image} 
                      alt={activity.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                  <div className="md:col-span-8 space-y-10">
                    <div 
                      className="prose prose-slate dark:prose-invert max-w-none 
                        prose-headings:font-bold prose-headings:tracking-tight
                        prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed prose-p:text-lg
                        prose-strong:text-slate-900 dark:prose-strong:text-white
                        prose-blockquote:border-primary prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-900/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-xl
                        prose-em:text-primary"
                      dangerouslySetInnerHTML={{ __html: activity.content }}
                    />
                  </div>

                  {/* Sidebar Widgets */}
                  <div className="md:col-span-4 space-y-8">
                    {activity.objectives && activity.objectives.length > 0 && (
                      <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl overflow-hidden">
                        <CardContent className="p-6 space-y-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl">
                              <Award size={20} className="text-primary" />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Core Objectives</h3>
                          </div>
                          <ul className="space-y-4">
                            {activity.objectives.map((obj, i) => (
                              <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 group">
                                <ChevronRight className="w-4 h-4 text-primary shrink-0 transition-transform group-hover:translate-x-1" />
                                <span>{obj}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    <Card className="border-primary/20 bg-primary/5 dark:bg-primary/10 rounded-3xl">
                      <CardContent className="p-6 space-y-4 text-center">
                        <BookOpen size={32} className="mx-auto text-primary" />
                        <h4 className="font-bold text-slate-900 dark:text-white">Research Resources</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Access the full methodology and data sets related to this activity.
                        </p>
                        <Button className="w-full rounded-xl gap-2 shadow-lg shadow-primary/20">
                          <Globe size={16} /> Explore Repository
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Bottom Call to Action */}
                <Separator className="opacity-50" />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-8">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-900 dark:bg-slate-100 flex items-center justify-center">
                      <ExternalLink className="text-white dark:text-slate-900" size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Stay Informed</p>
                      <p className="text-xs text-slate-500">Subscribe to our monthly research digest.</p>
                    </div>
                  </div>
                  <Button variant="outline" className="rounded-2xl border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 px-8">
                    Subscribe Now
                  </Button>
                </div>
              </motion.div>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}