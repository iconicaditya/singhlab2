import { motion } from "framer-motion";
import { User, Linkedin, Twitter, Mail, Facebook, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useData } from "@/lib/DataContext";
import { Button } from "@/components/ui/button";

export default function Team() {
  const { t } = useLanguage();
  const { data } = useData();
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    onSelect(); // Initial sync
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const baseTeamMembers = data.team;

  // Duplicate to ensure we have enough slides for the carousel effect if there are few members
  const teamMembers = baseTeamMembers.length < 4 ? [...baseTeamMembers, ...baseTeamMembers, ...baseTeamMembers] : baseTeamMembers;

  return (
    <section id="team" className="py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row items-end justify-between mb-8 md:mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl text-center md:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4 md:mb-6">{t('team.title')}</h2>
            <div className="h-1 w-20 bg-primary rounded-full mb-6 md:mb-8 mx-auto md:mx-0" />
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              {t('team.subtitle')}
            </p>
          </motion.div>
          
          <div className="flex gap-2 md:gap-4 justify-center">
             <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-10 w-10 md:h-12 md:w-12 border-2 hover:bg-primary hover:text-white transition-all"
                onClick={() => emblaApi?.scrollPrev()}
             >
               <ArrowLeft size={20} />
             </Button>
             <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-10 w-10 md:h-12 md:w-12 border-2 hover:bg-primary hover:text-white transition-all"
                onClick={() => emblaApi?.scrollNext()}
             >
               <ArrowRight size={20} />
             </Button>
          </div>
        </div>

        <div className="embla overflow-visible" ref={emblaRef}>
          <div className="embla__container flex">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="embla__slide flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4 md:pl-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all h-full flex flex-col items-center text-center group"
                >
                  <div className="relative mb-6 md:mb-8">
                    <div className="absolute inset-0 bg-primary/10 rounded-full scale-110 blur-md group-hover:bg-primary/20 transition-all" />
                    {member.image ? (
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-24 h-24 md:w-40 md:h-40 rounded-full object-cover relative z-10 border-4 border-white shadow-md group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-24 h-24 md:w-40 md:h-40 rounded-full bg-gray-200 flex items-center justify-center relative z-10 border-4 border-white shadow-md group-hover:scale-105 transition-transform">
                        <User size={48} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary font-bold text-xs md:text-sm uppercase tracking-widest mb-3 md:mb-4">{member.role}</p>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed line-clamp-4 md:line-clamp-none mb-6 md:mb-8 flex-grow">{member.bio}</p>
                  
                  <div className="flex gap-3 md:gap-4 mt-auto">
                    {member.social.linkedin && (
                      <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors p-2 hover:bg-gray-50 rounded-full">
                        <Linkedin size={18} className="md:w-5 md:h-5" />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors p-2 hover:bg-gray-50 rounded-full">
                        <Twitter size={18} className="md:w-5 md:h-5" />
                      </a>
                    )}
                    {member.social.email && (
                      <a href={`mailto:${member.social.email}`} className="text-gray-400 hover:text-primary transition-colors p-2 hover:bg-gray-50 rounded-full">
                        <Mail size={18} className="md:w-5 md:h-5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center gap-3 mt-4">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === selectedIndex 
                  ? "bg-primary w-8" 
                  : "bg-gray-300 hover:bg-gray-400"
              )}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}