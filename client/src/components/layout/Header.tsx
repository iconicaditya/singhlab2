import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Facebook, Twitter, Linkedin, Youtube, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Typewriter = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % 1; // Only one text
      const fullText = text;

      setDisplayText(
        isDeleting
          ? fullText.substring(0, displayText.length - 1)
          : fullText.substring(0, displayText.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 100);

      if (!isDeleting && displayText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000); // Pause at end
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, typingSpeed, text]);

  return (
    <span className="border-r-2 border-white pr-1 animate-pulse">
      {displayText}
    </span>
  );
};

export default function Header({ onNavigate, isScrolled: externalScrolled }: { onNavigate?: () => void; isScrolled?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalScrolled, setInternalScrolled] = useState(false);
  const [location, setLocation] = useLocation();
  const { t, language, setLanguage } = useLanguage();

  const navLinks = [
    { name: t('header.home'), href: "/" },
    { name: t('header.about'), href: "#about" },
    { name: t('header.team'), href: "#team" },
    { name: t('header.projects'), href: "#projects" },
    { name: t('header.publications'), href: "#publications" },
    { name: t('header.research'), href: "/research" },
    { name: t('header.resources'), href: "#resources" },
    { name: t('header.activities'), href: "#activities" },
    { name: t('header.gallery'), href: "#gallery" },
    { name: t('header.contact'), href: "#contact" },
  ];

  const scrolled = externalScrolled !== undefined ? externalScrolled : internalScrolled;

  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setInternalScrolled(window.scrollY > 50);

      // Active section detection
      const sections = navLinks
        .filter(link => link.href.startsWith("#"))
        .map(link => link.href.substring(1));

      let current = "";
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            current = section;
            break;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [externalScrolled, navLinks]);

  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Linkedin, href: "#" },
    { icon: Youtube, href: "#" },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (onNavigate) {
      onNavigate();
    }
    
    // Small delay to allow modal close if onNavigate is present
    setTimeout(() => {
      if (href === "/") {
        if (location === "/") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          setLocation("/");
        }
        return;
      }
      
      if (href.startsWith("#")) {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else if (location !== "/") {
          // If on a different page and target is an anchor, go home first
          setLocation("/");
          // Wait for navigation then try to scroll
          setTimeout(() => {
             const element = document.querySelector(href);
             if (element) element.scrollIntoView({ behavior: "smooth" });
          }, 300);
        }
      } else {
        setLocation(href);
      }
    }, onNavigate ? 100 : 0);
  };

  return (
    <header className="fixed w-full z-50 top-0 left-0 font-sans">
      {/* Top Bar - Black - Increased Height */}
      <div 
        className={`bg-black text-white px-4 md:px-8 flex flex-row justify-between items-center text-sm transition-all duration-300 overflow-hidden ${
          scrolled ? "h-0 py-0 opacity-0" : "py-3 min-h-[50px] md:min-h-[80px] opacity-100"
        }`}
      >
        <div className="flex items-center gap-2 md:gap-4 w-auto">
          <div className="flex flex-row items-center gap-2 md:gap-3">
             <img src="/images/logo.png" alt="Singh Lab Logo" className="h-8 md:h-12 w-auto object-contain bg-white rounded-sm px-1.5 py-0.5 md:px-2 md:py-1" />
             <div className="flex flex-col items-start leading-none">
               <span className="font-heading font-bold text-sm md:text-xl tracking-wider text-blue-400">SINGHLAB</span>
               <span className="font-heading font-bold text-[8px] md:text-xs tracking-widest text-red-500 mt-0.5">ENVIRONMENT</span>
             </div>
          </div>
        </div>
        
        <div className="hidden lg:block text-gray-300 mx-auto w-1/3 text-center min-h-[1.5rem] overflow-hidden text-base font-light tracking-wide">
           <Typewriter text={t('header.tagline')} />
        </div>

        <div className="flex gap-1 md:gap-6 items-center">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-400 hover:text-white hover:bg-white/10 p-1.5 md:p-2 rounded-full transition-colors flex items-center gap-1 md:gap-2 outline-none">
                <Globe size={18} className="md:w-5 md:h-5" />
                <span className="text-[10px] md:text-xs font-bold uppercase hidden xs:inline">{language}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 bg-black/90 border-gray-800 text-white">
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-white/20 focus:bg-white/20 focus:text-white"
                onClick={() => setLanguage('en')}
              >
                English
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-white/20 focus:bg-white/20 focus:text-white"
                onClick={() => setLanguage('jp')}
              >
                Japanese
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex gap-0.5 md:gap-2">
          {socialLinks.map((social, idx) => (
            <a key={idx} href={social.href} className="hover:text-red-500 transition-colors p-1.5 md:p-2 hover:bg-white/10 rounded-full">
              <social.icon size={18} className="md:w-5 md:h-5" />
            </a>
          ))}
          </div>
        </div>
      </div>

      {/* Main Nav - Blue - Smaller Height */}
      <div 
        className={`text-white shadow-lg transition-all duration-300 ${
          scrolled ? "bg-primary/90 backdrop-blur-md py-1.5" : "bg-primary py-2"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Mobile Logo shown only on scroll or small screens */}
          <div className="md:hidden flex items-center">
             <div className="flex items-center gap-2">
               <img src="/images/logo.png" alt="Singh Lab Logo" className="h-7 w-auto object-contain bg-white rounded-sm px-1 py-0.5" />
               <div className="font-heading font-bold text-[10px] tracking-wider leading-none text-white flex flex-col">
                 <span>SINGHLAB</span>
                 <span className="text-red-500 text-[8px]">ENVIRONMENT</span>
               </div>
             </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-4 lg:gap-6 items-center justify-between w-full">
            {/* Scrolled Logo for Desktop */}
            <div className={`flex items-center gap-2 lg:gap-3 transition-all duration-300 ${scrolled ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden invisible'}`}>
                 <img src="/images/logo.png" alt="Singh Lab Logo" className="h-8 w-auto object-contain bg-white rounded-sm px-1 py-0.5" />
                 <div className="font-heading font-bold tracking-wider leading-none text-white flex flex-col items-start">
                   <span className="text-xs lg:text-sm">SINGHLAB</span>
                   <span className="text-red-500 text-[8px] lg:text-[10px]">ENVIRONMENT</span>
                 </div>
            </div>

            <div className="flex gap-1 lg:gap-2 items-center justify-end flex-1">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? location === "/" && !activeSection : link.href.substring(1) === activeSection;
              return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`px-1.5 lg:px-2 py-1 rounded-lg transition-all text-[10px] lg:text-[11px] font-bold uppercase tracking-wide cursor-pointer whitespace-nowrap
                  ${isActive 
                    ? "text-red-400 font-bold" 
                    : "text-white/90 hover:text-red-400 hover:underline hover:decoration-white"
                  }`}
              >
                {link.name}
              </a>
            )})}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-1.5 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-primary/95 backdrop-blur-md border-t border-primary-foreground/10 overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-1 items-center text-center">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="text-white hover:text-red-400 transition-all font-bold py-3 w-full border-b border-white/5 last:border-0 uppercase tracking-widest text-sm"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}