import { motion } from "framer-motion";
import { Building2, Landmark, Globe2, GraduationCap } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const collaborators = [
  { 
    name: "University of Tokyo", 
    icon: GraduationCap,
    color: "text-blue-800"
  },
  { 
    name: "Global Environment Facility", 
    icon: Globe2,
    color: "text-green-600"
  },
  { 
    name: "WWF Japan", 
    icon: Landmark, // Placeholder
    color: "text-black"
  },
  { 
    name: "Kobe City Government", 
    icon: Building2,
    color: "text-cyan-600"
  },
];

export default function Collaborators() {
  const { t } = useLanguage();

  return (
    <section id="collaborators" className="py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-gray-900 mb-4 tracking-tight">{t('collaborators.title')}</h2>
            <div className="h-1 w-16 bg-primary mx-auto rounded-full mb-6 md:mb-8" />
            <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto font-medium">
              We work with leading institutions and organizations worldwide to advance environmental research.
            </p>
          </motion.div>
        </div>

        <div className="relative">
          <div className="flex overflow-hidden group">
            <motion.div 
              className="flex gap-8 md:gap-16 items-center whitespace-nowrap py-4"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ 
                duration: 30, 
                repeat: Infinity, 
                ease: "linear",
                repeatType: "loop"
              }}
            >
              {[...collaborators, ...collaborators].map((collab, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-3 md:gap-4 px-6 md:px-10 py-4 md:py-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className={`p-2 rounded-lg bg-gray-50 group-hover:bg-white transition-colors ${collab.color}`}>
                    <collab.icon size={24} strokeWidth={1.5} className="md:w-7 md:h-7" />
                  </div>
                  <span className="text-gray-700 font-bold text-xs md:text-sm uppercase tracking-widest">{collab.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}