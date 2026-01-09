import { useRef, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top } = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <section 
      id="about" 
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative py-24 bg-black text-white overflow-hidden"
    >
      {/* Smoke / Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-50 transition duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(100, 100, 100, 0.25),
              transparent 80%
            )
          `,
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10 max-w-[95%] xl:max-w-[1600px]">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-primary">About The Lab</h2>
            <div className="h-1 w-20 bg-primary mx-auto mb-8 rounded-full" />
            
            <p className="text-xl md:text-2xl font-light text-gray-300 leading-relaxed mb-8">
              The Singh Lab is an interdisciplinary research group at Kobe City University of Foreign Studies 
              focused on understanding and addressing environmental challenges through applied research, 
              education, and community engagement.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 text-left mt-16">
            {[
              { title: "Our Vision", text: "To integrate research, teaching, and local action to reduce environmental risks and improve environmental and social well-being." },
              { title: "Our Mission", text: "Produce high-quality policy-relevant research, train students in field methods, and engage communities in sustainability initiatives." },
              { title: "Our Approach", text: "Mixed methods research grounded in real-world contexts, emphasizing impact beyond academia and linking environmental, social, and economic dimensions." }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                <h3 className="text-2xl font-bold font-heading mb-4 text-primary">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}