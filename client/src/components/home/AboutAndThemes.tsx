import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import TechParticles from "@/components/ui/TechParticles";
import { useLanguage } from "@/lib/i18n";

// Images from public/images
const bgImage = "/images/lush_green_forest_nature_landscape.png";
const imgPlastics = "/images/marine_plastic_pollution_artistic_concept.png";
const imgWaste = "/images/composting_and_organic_waste_management.png";
const imgClimate = "/images/climate_change_abstract_concept.png";
const imgEnergy = "/images/solar_panels_and_wind_energy.png";
const imgUrban = "/images/sustainable_urban_city_planning.png";
const imgOthers = "/images/global_policy_and_sdgs_concept.png";

export default function AboutAndThemes() {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { t } = useLanguage();

  const themes = [
    {
      title: t('themes.plastics'),
      image: imgPlastics,
      points: ["Marine litter education", "Microplastics monitoring", "Plastic-climate nexus"]
    },
    {
      title: t('themes.waste'),
      image: imgWaste,
      points: ["Campus compost & LCA", "Open burning mitigation", "Municipal solid waste planning"]
    },
    {
      title: t('themes.climate'),
      image: imgClimate,
      points: ["Heat risk perception", "Mitigation co-benefits", "Community resilience"]
    },
    {
      title: t('themes.energy'),
      image: imgEnergy,
      points: ["Solar adoption & behavior", "Energy efficiency research", "Community energy systems"]
    },
    {
      title: t('themes.urban'),
      image: imgUrban,
      points: ["Sustainable urban planning", "Environmental justice", "Public health & resilience"]
    },
    {
      title: t('themes.others'),
      image: imgOthers,
      points: ["Fair trade impacts", "Biodiversity & plastics", "Policy design & SDGs"],
      highlight: true
    }
  ];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top } = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <div id="about" className="relative">
       {/* Section 1: About (Black Background with Tech Particles) */}
       <section 
        ref={ref}
        onMouseMove={handleMouseMove}
        className="relative py-16 md:py-24 bg-black text-white overflow-hidden pb-32 md:pb-48"
      >
        {/* Tech Particles Background */}
        <div className="absolute inset-0 z-0">
           <TechParticles />
        </div>
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-7xl mx-auto text-center space-y-8 md:space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 md:mb-6 text-primary">{t('about.title')}</h2>
              <div className="h-1 w-20 bg-primary mx-auto mb-6 md:mb-8 rounded-full" />
              
              <p className="text-lg md:text-2xl font-light text-gray-300 leading-relaxed mb-8">
                {t('about.description')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-left mt-12 md:mt-16">
              {[
                { title: t('about.vision.title'), text: t('about.vision.text') },
                { title: t('about.mission.title'), text: t('about.mission.text') },
                { title: t('about.approach.title'), text: t('about.approach.text') }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm group"
                >
                  <h3 className="text-xl md:text-2xl font-bold font-heading mb-3 md:mb-4 text-primary group-hover:text-white transition-colors">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm md:text-base group-hover:text-gray-300 transition-colors">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Research Themes (Blurred Background) */}
      <section id="research-themes" className="relative py-16 md:py-24 min-h-screen flex items-center -mt-12 md:-mt-24 pt-32 md:pt-48">
        {/* Background with Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 z-0 bg-black/75 backdrop-blur-sm" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-bold font-heading text-primary"
            >
              {t('themes.title')}
            </motion.h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              {t('themes.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {themes.map((theme, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.03, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)" }}
                className={`
                  bg-black/80 rounded-2xl p-8 border backdrop-blur-md transition-all duration-300
                  flex flex-col items-center text-center group
                  ${theme.highlight ? 'border-orange-500/50 shadow-[0_0_15px_rgba(255,165,0,0.15)]' : 'border-white/10 hover:border-primary/50'}
                `}
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 mb-6 shadow-lg group-hover:border-primary transition-colors">
                  <img 
                    src={theme.image} 
                    alt={theme.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-6 font-heading tracking-wide">
                  {theme.title}
                </h3>
                
                <ul className="space-y-3 w-full text-left pl-4">
                  {theme.points.map((point, pIdx) => (
                    <li key={pIdx} className="text-gray-400 flex items-center gap-3 text-sm">
                      <span className={`w-1.5 h-1.5 rounded-full ${theme.highlight ? 'bg-orange-500' : 'bg-primary'}`} />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}