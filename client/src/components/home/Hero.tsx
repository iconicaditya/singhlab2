import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

// Images from public/images
const hero1 = "/images/modern_environmental_research_lab_with_scientists.png";
const hero2 = "/images/lush_green_forest_nature_landscape.png";
const hero3 = "/images/community_gathering_for_environmental_discussion.png";

interface HeroProps {
  onOpenPaper?: () => void;
}

export default function Hero({ onOpenPaper }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();

  const slides = [
    {
      image: hero1,
      title: t('hero.slide1.title'),
      subtitle: t('hero.slide1.subtitle'),
    },
    {
      image: hero2,
      title: t('hero.slide2.title'),
      subtitle: t('hero.slide2.subtitle'),
    },
    {
      image: hero3,
      title: t('hero.slide3.title'),
      subtitle: t('hero.slide3.subtitle'),
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]); // Added dependency though slides changes on render due to t()

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {slides.map((slide, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentSlide ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      ))}

      <div className="absolute inset-0 flex items-center justify-center text-center px-4 md:px-6">
        <div className="max-w-5xl space-y-4 md:space-y-8">
          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-white font-heading leading-[1.1] md:leading-tight tracking-tight"
          >
            {slides[currentSlide].title}
          </motion.h1>
          <motion.p
            key={`sub-${currentSlide}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-base sm:text-lg md:text-2xl text-gray-100 font-medium max-w-2xl mx-auto leading-relaxed md:leading-normal"
          >
            {slides[currentSlide].subtitle}
          </motion.p>
          <motion.div
            key={`btn-${currentSlide}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="pt-4"
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-red-600 text-white font-bold text-base md:text-lg px-6 md:px-10 py-5 md:py-7 rounded-full shadow-2xl hover:shadow-primary/20 transition-all transform hover:-translate-y-1 active:scale-95"
              onClick={() => {
                if (onOpenPaper) {
                  onOpenPaper();
                } else {
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              {t('hero.learnMore')} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === currentSlide ? "bg-white w-8" : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}