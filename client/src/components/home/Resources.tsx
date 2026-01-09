import { motion } from "framer-motion";
import { FileDown, FileText, Video, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const resources = [
  {
    id: 1,
    title: "Community Guide to Plastic Reduction",
    type: "PDF Guide",
    icon: FileText,
    size: "2.4 MB"
  },
  {
    id: 2,
    title: "Marine Litter Survey Protocol",
    type: "Field Manual",
    icon: FileDown,
    size: "1.1 MB"
  },
  {
    id: 3,
    title: "Introduction to Sustainability",
    type: "Video Lecture",
    icon: Video,
    size: "External Link"
  },
  {
    id: 4,
    title: "Local Policy Recommendations 2024",
    type: "Policy Brief",
    icon: FileText,
    size: "500 KB"
  }
];

export default function Resources() {
  return (
    <section id="resources" className="py-24 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-heading text-gray-900 mb-4">Resources</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Downloadable guides, reports, and educational materials for students, researchers, and community members.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, idx) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                <resource.icon size={32} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{resource.title}</h3>
              <p className="text-sm text-gray-500 mb-6">{resource.type} • {resource.size}</p>
              <Button variant="outline" className="w-full mt-auto group-hover:border-primary group-hover:text-primary">
                Download / View
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}