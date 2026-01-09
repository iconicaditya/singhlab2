import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useData } from "@/lib/DataContext";

export default function Gallery() {
  const [filter, setFilter] = useState("All");
  const { data } = useData();
  const galleryItems = data.gallery;

  const filteredItems = galleryItems.filter(
    (item) => filter === "All" || item.category === filter
  );

  // Derive categories from items
  const categories = ["All", ...Array.from(new Set(galleryItems.map(item => item.category)))];

  return (
    <section id="gallery" className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-[95%] xl:max-w-[1600px]">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">Gallery</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full mb-8" />
          
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 px-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={filter === cat ? "default" : "outline"}
                onClick={() => setFilter(cat)}
                className="rounded-full px-4 md:px-6 h-9 md:h-10 text-xs md:text-sm font-bold tracking-wide"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="relative group rounded-xl overflow-hidden shadow-lg aspect-[4/3]"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4">
                  <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                  <span className="text-sm uppercase tracking-wider bg-primary px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}