"use client";

import { motion } from "framer-motion";
import RichTextRenderer from "./ui/RichTextRenderer";

interface CTAProps {
  cta?: {
    title?: string;
    description?: any[];
    button?: {
      text?: string;
      link?: string;
    };
    showSection?: boolean;
  };
}

export default function CTA({ cta }: CTAProps) {

  if (!cta || cta.showSection === false) return null;

  const handleSmoothScroll = (link: string, e: React.MouseEvent) => {
    if (link && !link.startsWith('http')) {
      e.preventDefault()
      const element = document.getElementById(link.replace('#', ''))
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        })
      }
    }
  }

  return (
    <section className="py-16 px-6">
      <div className="container mx-auto">
        <motion.div 
          className="bg-gradient-to-t from-hnmc-blue to-hnmc-teal rounded-3xl p-8 md:p-12 text-white max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h3 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            {cta.title || "Join Our Community of Satisfied Patients"}
          </motion.h3>
          
          <motion.div 
            className="text-white/90 mb-8 text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {cta.description && 
              <RichTextRenderer content={cta.description} />
            }
          </motion.div>
          
          {cta.button?.text && <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <a
              href={cta.button?.link || "#about"}
              className="inline-block bg-white text-hnmc-blue px-8 py-4 rounded-xl font-semibold hover:bg-white/95 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              {...(cta.button?.link?.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              onClick={(e) => handleSmoothScroll(cta.button?.link || '', e)}
            >
              {cta.button?.text || "Schedule Your Consultation"}
            </a>
          </motion.div>}
        </motion.div>
      </div>
    </section>
  );
}
