import { motion } from "framer-motion";
import { FileText, Download, ExternalLink, ArrowRight, BookOpen, Calendar, Users } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/lib/DataContext";

export default function Publications() {
  const { t } = useLanguage();
  const { data } = useData();
  const publications = data.publications;

  return (
    <section id="publications" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 max-w-[95%] xl:max-w-[1600px]">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 mb-6">{t('publications.title')}</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mb-6" />
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Exploring critical environmental challenges through rigorous academic research and community-based studies.
            </p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
          {publications.map((pub, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group bg-white rounded-xl md:rounded-2xl p-5 md:p-8 border border-slate-100 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 relative overflow-hidden"
            >
              {/* Decorative gradient blob */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500 hidden md:block" />

              <div className="flex flex-col md:flex-row gap-4 md:gap-6 relative z-10">
                {/* Left Side: Date & Type */}
                <div className="md:w-32 flex-shrink-0 flex flex-row md:flex-col items-center md:items-start gap-3 md:gap-2 text-slate-500">
                   <div className="bg-slate-100 rounded-lg px-3 py-1.5 md:py-2 text-center min-w-[70px] md:w-full">
                      <span className="block text-xl md:text-2xl font-bold text-slate-900">{pub.year}</span>
                   </div>
                   <Badge variant="outline" className="font-semibold border-slate-200 text-slate-600 bg-transparent text-[10px] md:text-xs uppercase tracking-wider">
                      {pub.type}
                   </Badge>
                </div>

                {/* Middle: Content */}
                <div className="flex-grow space-y-2 md:space-y-3">
                  <h3 className="text-lg md:text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors font-serif leading-snug">
                    {pub.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs md:text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <BookOpen size={14} className="text-primary md:w-4 md:h-4" />
                      <span className="font-medium italic">{pub.journal}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={14} className="text-primary md:w-4 md:h-4" />
                      <span>{pub.authors.join(", ")}</span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-none">
                    {pub.abstract}
                  </p>

                  <div className="flex flex-wrap gap-1.5 md:gap-2 pt-1 md:pt-0">
                    {pub.tags.map((tag, tagIdx) => (
                      <span key={tagIdx} className="text-[10px] md:text-xs font-medium px-2 py-0.5 md:px-2.5 md:py-1 bg-slate-50 text-slate-600 rounded-full border border-slate-100">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-row md:flex-col justify-start md:justify-center gap-2 md:gap-3 mt-4 md:mt-0 md:pl-6 md:border-l border-slate-100 md:min-w-[120px]">
                   {pub.pdfUrl && (
                     <a href={pub.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none">
                       <Button variant="default" size="sm" className="w-full gap-2 shadow-sm bg-slate-900 hover:bg-primary transition-colors h-10 md:h-9" data-testid={`button-pdf-${pub.id}`}>
                         <FileText size={16} /> PDF
                       </Button>
                     </a>
                   )}
                   {pub.linkUrl && (
                     <a href={pub.linkUrl} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none">
                       <Button variant="ghost" size="sm" className="w-full gap-2 text-slate-600 hover:text-primary hover:bg-primary/5 h-10 md:h-9" data-testid={`button-link-${pub.id}`}>
                         <ExternalLink size={16} /> Link
                       </Button>
                     </a>
                   )}
                   {!pub.pdfUrl && !pub.linkUrl && (
                     <div className="text-[10px] text-slate-400 font-medium uppercase tracking-widest text-center w-full">No Files Available</div>
                   )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
             <Button variant="outline" size="lg" className="rounded-full px-8 border-slate-300 text-slate-700 hover:text-primary hover:border-primary gap-2 group bg-white">
                View All Publications <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}