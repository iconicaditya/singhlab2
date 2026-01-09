import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import AboutAndThemes from "@/components/home/AboutAndThemes";
import ResearchAreas from "@/components/home/ResearchAreas";
import Team from "@/components/home/Team";
import Projects from "@/components/home/Projects";
import Publications from "@/components/home/Publications";
import Resources from "@/components/home/Resources";
import Gallery from "@/components/home/Gallery";
import News from "@/components/home/News";
import Collaborators from "@/components/home/Collaborators";
import Contact from "@/components/home/Contact";
import ResearchPaperViewer from "@/pages/research/ResearchPaperViewer";
import { useState, useEffect } from "react";

export default function Home() {
  const [viewerOpen, setViewerOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      <Header />
      <Hero onOpenPaper={() => setViewerOpen(true)} />
      <AboutAndThemes />
      <ResearchAreas />
      <Team />
      <Projects />
      <Publications />
      <Resources />
      <Gallery />
      <News />
      <Collaborators />
      <Contact />
      <Footer />
    </div>
  );
}
