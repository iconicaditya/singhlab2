import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const newsItems = [
  {
    id: 1,
    title: "New Research Grant Awarded",
    date: "Dec 15, 2024",
    summary: "The lab has received funding for a 3-year project on coastal plastic management.",
    category: "Announcement"
  },
  {
    id: 2,
    title: "Upcoming Workshop: Community Action",
    date: "Jan 10, 2025",
    summary: "Join us for a hands-on workshop on local sustainability initiatives.",
    category: "Event"
  },
  {
    id: 3,
    title: "Student Fieldwork in Okinawa",
    date: "Nov 20, 2024",
    summary: "Graduate students conducted marine litter surveys across 5 beaches.",
    category: "Project Update"
  }
];

export default function News() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  return (
    <section id="activities" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-heading text-gray-900 mb-4">{t('activities.title')}</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {newsItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setLocation(`/activity/${item.id}`)}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2 text-sm text-primary font-medium mb-3">
                <Calendar size={16} />
                <span>{item.date}</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500 uppercase text-xs tracking-wider">{item.category}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {item.summary}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => setLocation('/activities')}
            className="group rounded-full px-8"
          >
            View All Activities
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}