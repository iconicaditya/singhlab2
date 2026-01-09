import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/lib/i18n";
import { MapPin, Mail, Phone, Send, Globe, Facebook, Twitter, Linkedin } from "lucide-react";
import { useState } from "react";
import { useData } from "@/lib/DataContext";
import { toast } from "sonner";

export default function Contact() {
  const { t } = useLanguage();
  const { data, updateData } = useData();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
        toast.error("Please fill in all required fields.");
        setIsSubmitting(false);
        return;
    }

    // Simulate API call and update context
    setTimeout(() => {
        const newMessage = {
            id: Math.max(...data.messages.map(m => m.id), 0) + 1,
            sender: formData.name,
            email: formData.email,
            subject: formData.subject || "No Subject",
            message: formData.message,
            date: new Date().toISOString().split('T')[0],
            status: "Unread" as const,
            category: "Inquiry" // Default category
        };

        updateData('messages', [...data.messages, newMessage]);
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10 max-w-[95%] xl:max-w-[1600px]">
        <div className="w-full">
            <div className="text-center mb-16 space-y-4">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-5xl font-bold font-heading text-gray-900"
                >
                  {t('contact.title')}
                </motion.h2>
                <motion.p 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.1 }}
                   className="text-gray-600 max-w-2xl mx-auto text-lg"
                >
                  {t('contact.subtitle')}
                </motion.p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:grid lg:grid-cols-5 border border-gray-100 min-h-[600px]">
                {/* Left Side: Contact Info (Dark Theme) */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden"
                >
                    {/* Abstract Pattern overlay */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                    
                    <div className="relative z-10 space-y-8">
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 font-heading text-white">Contact Information</h3>
                            <p className="text-gray-300 text-sm md:text-base mb-6 md:mb-8 leading-relaxed">
                                We are always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 group">
                                <div className="bg-white/10 p-3 rounded-lg group-hover:bg-primary transition-colors shrink-0">
                                    <MapPin className="text-white" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white/90 text-sm mb-1">{t('contact.location')}</h4>
                                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                                        {t('contact.locationValue').split(', ').map((line, i) => (
                                            <span key={i} className="block">{line}</span>
                                        ))}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="bg-white/10 p-3 rounded-lg group-hover:bg-primary transition-colors shrink-0">
                                    <Mail className="text-white" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white/90 text-sm mb-1">{t('contact.email')}</h4>
                                    <p className="text-gray-400 text-xs md:text-sm break-all">contact@singhlab.org</p>
                                    <p className="text-gray-400 text-xs md:text-sm break-all">research@singhlab.org</p>
                                </div>
                            </div>
                            
                             <div className="flex items-start gap-4 group">
                                <div className="bg-white/10 p-3 rounded-lg group-hover:bg-primary transition-colors shrink-0">
                                    <Globe className="text-white" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white/90 text-sm mb-1">Socials</h4>
                                    <div className="flex gap-4 mt-2">
                                        {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                                            <a key={i} href="#" className="text-gray-400 hover:text-white transition-colors">
                                                <Icon size={18} />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 mt-8 lg:mt-12 hidden md:block">
                        <div className="w-24 h-24 bg-primary/20 rounded-full absolute -right-10 -bottom-10 blur-xl" />
                        <div className="w-32 h-32 bg-blue-500/20 rounded-full absolute -left-10 -bottom-20 blur-xl" />
                    </div>
                </motion.div>

                {/* Right Side: Contact Form */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="lg:col-span-3 p-8 md:p-12 bg-white flex flex-col justify-center"
                >
                    <form className="space-y-4 md:space-y-6 w-full" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-700 font-semibold text-sm">Your Name <span className="text-red-500">*</span></Label>
                                <Input 
                                    id="name" 
                                    placeholder="John Doe" 
                                    className="bg-gray-50 border-gray-200 focus:bg-white focus:border-primary transition-all h-11 md:h-12 rounded-xl text-sm"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700 font-semibold text-sm">Your Email <span className="text-red-500">*</span></Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="john@example.com" 
                                    className="bg-gray-50 border-gray-200 focus:bg-white focus:border-primary transition-all h-11 md:h-12 rounded-xl text-sm"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="subject" className="text-gray-700 font-semibold text-sm">Subject</Label>
                            <Input 
                                id="subject" 
                                placeholder="Research collaboration..." 
                                className="bg-gray-50 border-gray-200 focus:bg-white focus:border-primary transition-all h-11 md:h-12 rounded-xl text-sm"
                                value={formData.subject}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-gray-700 font-semibold text-sm">Message <span className="text-red-500">*</span></Label>
                            <Textarea 
                                id="message" 
                                placeholder="How can we help you?" 
                                className="min-h-[140px] md:min-h-[180px] bg-gray-50 border-gray-200 focus:bg-white focus:border-primary transition-all rounded-xl resize-none p-4 text-sm"
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                required
                            />
                        </div>
                        
                        <Button 
                            type="submit"
                            size="lg" 
                            disabled={isSubmitting}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 md:h-14 rounded-xl text-base md:text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                        >
                            <Send size={18} className="mr-2" />
                            {isSubmitting ? "Sending..." : t('contact.form.send')}
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
      </div>
    </section>
  );
}