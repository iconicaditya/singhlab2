import { motion } from "framer-motion";

// Images from public/images
const bgImage = "/images/lush_green_forest_nature_landscape.png";
const imgPlastics = "/images/marine_plastic_pollution_artistic_concept.png";
const imgWaste = "/images/composting_and_organic_waste_management.png";
const imgClimate = "/images/climate_change_abstract_concept.png";
const imgEnergy = "/images/solar_panels_and_wind_energy.png";
const imgUrban = "/images/sustainable_urban_city_planning.png";
const imgOthers = "/images/global_policy_and_sdgs_concept.png";

const themes = [
  {
    title: "Plastics",
    image: imgPlastics,
    points: ["Marine litter education", "Microplastics monitoring", "Plastic-climate nexus"]
  },
  {
    title: "Waste Management",
    image: imgWaste,
    points: ["Campus compost & LCA", "Open burning mitigation", "Municipal solid waste planning"]
  },
  {
    title: "Climate Change",
    image: imgClimate,
    points: ["Heat risk perception", "Mitigation co-benefits", "Community resilience"]
  },
  {
    title: "Renewable Energy & Tech",
    image: imgEnergy,
    points: ["Solar adoption & behavior", "Energy efficiency research", "Community energy systems"]
  },
  {
    title: "Social & Urban Systems",
    image: imgUrban,
    points: ["Sustainable urban planning", "Environmental justice", "Public health & resilience"]
  },
  {
    title: "Others",
    image: imgOthers,
    points: ["Fair trade impacts", "Biodiversity & plastics", "Policy design & SDGs"]
  }
];

export default function ResearchThemes() {
  return (
    <section id="research-themes" className="relative py-16 md:py-24 min-h-screen flex items-center">
      {/* Background with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 z-0 bg-black/75 backdrop-blur-sm" />

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold font-heading text-primary tracking-tight"
          >
            Research Themes
          </motion.h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
            Our interdisciplinary research spans multiple critical areas of environmental sustainability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {themes.map((theme, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.6)" }}
              className="bg-black/80 rounded-2xl p-6 md:p-8 border border-white/10 hover:border-primary/50 backdrop-blur-md flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-white/20 mb-4 md:mb-6 shadow-lg group-hover:border-primary transition-colors">
                <img 
                  src={theme.image} 
                  alt={theme.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6 font-heading tracking-wide group-hover:text-primary transition-colors">
                {theme.title}
              </h3>
              
              <ul className="space-y-2 md:space-y-3 inline-block text-left">
                {theme.points.map((point, pIdx) => (
                  <li key={pIdx} className="text-gray-400 text-xs md:text-sm flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}