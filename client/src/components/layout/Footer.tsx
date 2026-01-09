import { motion } from "framer-motion";
import { Link } from "wouter";
import { Facebook, Twitter, Linkedin, Youtube, MapPin, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function Footer({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useLanguage();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate();
    }
    
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, onNavigate ? 100 : 0);
  };

  return (
    <footer className="bg-gray-900 text-white pt-12 md:pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-bold font-heading text-primary tracking-tight">SINGH LAB | ENVIRONMENT</h3>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 md:mb-6 font-heading border-b border-white/10 pb-2 inline-block uppercase tracking-widest text-xs md:text-sm">{t('footer.quickLinks')}</h4>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-y-3 gap-x-4">
              {[
                { name: t('header.home'), id: 'home' },
                { name: t('header.about'), id: 'about' },
                { name: t('header.publications'), id: 'publications' },
                { name: t('header.team'), id: 'team' },
                { name: t('header.contact'), id: 'contact' }
              ].map((item) => (
                <li key={item.id}>
                  <a 
                    href={`#${item.id}`} 
                    onClick={(e) => handleLinkClick(e, item.id)}
                    className="text-gray-400 hover:text-white hover:pl-2 transition-all block text-sm font-medium py-1"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4 md:mb-6 font-heading border-b border-white/10 pb-2 inline-block uppercase tracking-widest text-xs md:text-sm">{t('footer.contactUs')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="shrink-0 text-primary mt-0.5" size={18} />
                <span>Kobe City University of Foreign Studies,<br />Kobe, Japan</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="shrink-0 text-primary" size={18} />
                <a href="mailto:contact@singhlab.org" className="hover:text-white break-all">contact@singhlab.org</a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="shrink-0 text-primary" size={18} />
                <span>+81 78-794-8111</span>
              </li>
            </ul>
          </div>

          {/* Map / Social */}
          <div>
            <h4 className="text-lg font-bold mb-4 md:mb-6 font-heading border-b border-white/10 pb-2 inline-block uppercase tracking-widest text-xs md:text-sm">{t('footer.findUs')}</h4>
            <div className="w-full h-40 md:h-48 bg-gray-800 rounded-xl mb-6 overflow-hidden relative shadow-inner border border-gray-700">
               <iframe 
                 width="100%" 
                 height="100%" 
                 src="https://maps.google.com/maps?width=100%&height=300&hl=en&q=Kobe%20City%20University%20of%20Foreign%20Studies&t=&z=14&ie=UTF8&iwloc=B&output=embed" 
                 frameBorder="0" 
                 scrolling="no" 
                 marginHeight={0} 
                 marginWidth={0}
                 title="Location Map"
                 className="filter grayscale hover:grayscale-0 transition-all duration-500 opacity-80 hover:opacity-100"
               ></iframe>
            </div>
            <div className="flex gap-4">
              {[Facebook, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/5 hover:bg-primary/20 p-2.5 rounded-xl text-primary transition-all border border-white/5"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs md:text-sm text-center md:text-left">
          <p>© {new Date().getFullYear()} Singh Lab | Environment. {t('footer.rights')}</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 items-center">
            <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a>
            <a href="/login" className="hover:text-primary font-bold transition-colors uppercase tracking-widest text-[10px]">{t('header.adminLogin')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}