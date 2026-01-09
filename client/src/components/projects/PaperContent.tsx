import React from 'react';
import { BookOpen, FileText, FlaskConical, BarChart3, MessageSquareQuote, Layers } from 'lucide-react';
import { ResearchSection } from '@/lib/DataContext';

interface PaperContentProps {
  abstract: string;
  sections?: ResearchSection[];
  references?: string[];
}

export default function PaperContent({ abstract, sections = [], references = [] }: PaperContentProps) {
  // Sort or prioritize known sections if needed, but for now map dynamically
  
  const getIconForSection = (title: string) => {
      const t = title.toLowerCase();
      if (t.includes('intro')) return <BookOpen size={20} />;
      if (t.includes('method')) return <FlaskConical size={20} />;
      if (t.includes('result')) return <BarChart3 size={20} />;
      if (t.includes('conclusion')) return <FileText size={20} />;
      return <Layers size={20} />;
  };

  const getColorForSection = (title: string) => {
      const t = title.toLowerCase();
      if (t.includes('intro')) return "text-blue-600 bg-blue-50 group-hover:bg-blue-600";
      if (t.includes('method')) return "text-teal-600 bg-teal-50 group-hover:bg-teal-600";
      if (t.includes('result')) return "text-purple-600 bg-purple-50 group-hover:bg-purple-600";
      return "text-gray-600 bg-gray-50 group-hover:bg-gray-600";
  };

  return (
    <div className="space-y-16 text-lg text-slate-800 leading-relaxed font-serif max-w-none">
       {/* Abstract Box - Enhanced */}
       <div id="abstract" className="scroll-mt-32 relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 rounded-full opacity-80"></div>
          <div className="bg-slate-50/80 p-8 md:p-10 rounded-r-2xl border border-slate-100 shadow-sm backdrop-blur-sm">
             <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-sans">Abstract</h3>
             </div>
             <div 
                className="text-lg md:text-xl text-slate-700 leading-relaxed italic prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: abstract || "" }}
             />
          </div>
       </div>

       {sections.map((section) => (
           <section key={section.id} id={section.id} className="scroll-mt-32 group">
               {section.title && (
                 <div className="flex items-center gap-3 mb-6">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center group-hover:text-white transition-colors duration-300 flex-shrink-0 ${getColorForSection(section.title)}`}>
                      {getIconForSection(section.title)}
                   </div>
                   <h3 className="text-3xl font-bold font-sans text-slate-900">
                       {section.title}
                   </h3>
                 </div>
               )}
               
               <div className="prose prose-lg prose-slate max-w-none text-gray-700">
                 {section.image && (
                     <figure className="mb-8">
                         <img src={section.image} alt={section.title} className="w-full rounded-xl shadow-md border border-slate-100" />
                     </figure>
                 )}
                 <div 
                    className="mb-6 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: section.content || "" }}
                 />
               </div>
           </section>
       ))}

       {/* References */}
       {references && references.length > 0 && (
           <section id="references" className="scroll-mt-32 pt-12 border-t border-slate-200 mt-16 bg-slate-50/50 -mx-4 px-4 md:-mx-10 md:px-10 pb-10 rounded-b-xl">
               <h3 className="text-lg font-bold mb-8 font-sans text-slate-900 uppercase tracking-wider flex items-center gap-2">
                   <BookOpen className="w-4 h-4" /> References
               </h3>
               <ul className="space-y-4 text-sm text-slate-600 font-sans">
                   {references.map((ref, i) => (
                       <li key={i} className="pl-4 border-l-2 border-slate-300 hover:border-blue-500 transition-colors cursor-text">
                           {ref}
                       </li>
                   ))}
               </ul>
           </section>
       )}
    </div>
  );
}