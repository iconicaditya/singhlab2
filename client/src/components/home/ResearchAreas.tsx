import { motion } from "framer-motion";
import { ArrowRight, Microscope, Globe, BarChart3, Leaf } from "lucide-react";
import imgAnalysis from "@assets/generated_images/detailed_environmental_data_analysis.png";

const areas = [
  {
    title: "Applied Environmental Science",
    description: "Utilizing advanced data analysis and field methods to monitor environmental changes and assess ecosystem health.",
    icon: Microscope
  },
  {
    title: "Global Sustainability Policy",
    description: "Analyzing international frameworks and local implementations to bridge the gap between policy goals and community action.",
    icon: Globe
  },
  {
    title: "Circular Economy Models",
    description: "Developing practical models for waste reduction and resource efficiency in urban and rural settings.",
    icon: Leaf
  },
  {
    title: "Impact Assessment",
    description: "Measuring the social and environmental outcomes of sustainability interventions to guide future decision-making.",
    icon: BarChart3
  }
];

export default function ResearchAreas() {
  return (
    <section id="research-areas" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Content Side */}
          <div className="w-full lg:w-1/2 space-y-6 md:space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4 md:mb-6">Our Research Focus</h2>
              <div className="h-1 w-20 bg-primary rounded-full mb-6 md:mb-8" />
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-6 md:mb-8">
                We go beyond theoretical study to apply rigorous scientific methods to real-world problems. 
                Our work informs policy, empowers communities, and contributes to the global body of sustainability knowledge.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {areas.map((area, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gray-50 p-5 md:p-6 rounded-xl border border-gray-100 hover:bg-white hover:shadow-md transition-all"
                >
                  <area.icon size={28} className="text-primary mb-3 md:mb-4" />
                  <h3 className="font-bold text-base md:text-lg text-gray-900 mb-1.5 md:mb-2">{area.title}</h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{area.description}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.div
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.4 }}
            >
                <a 
                  href="/research" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary font-bold hover:underline text-lg"
                >
                  View Our Research <ArrowRight className="ml-2" size={20} />
                </a>
            </motion.div>
          </div>

          {/* Image Side */}
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src={imgAnalysis} alt="Environmental Data Analysis" className="w-full h-auto" />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}