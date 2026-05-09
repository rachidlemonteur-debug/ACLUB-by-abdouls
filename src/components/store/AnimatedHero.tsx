import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export function AnimatedHero({ handleWhatsAppGeneral }: { handleWhatsAppGeneral: () => void }) {
  const text = "L'ÉLITE DU STREETWEAR À NIAMEY.";
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <section className="relative w-full bg-brand-noir min-h-[90vh] flex flex-col lg:flex-row border-b border-[#333]">
      {/* Left Side: Content */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 lg:px-16 py-20 lg:py-0 z-10">
        <div className="mb-12">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="inline-block border border-[#333] px-3 py-1 text-[10px] uppercase font-bold tracking-widest text-brand-kaki mb-6"
          >
            Concept Store · Niamey
          </motion.span>
          <motion.h1
            style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
            variants={container}
            initial="hidden"
            animate="visible"
            className="text-6xl md:text-8xl font-display text-brand-blanc leading-[0.9] tracking-[0.02em] mb-6"
          >
            {words.map((word, index) => (
              <motion.span variants={child} key={index} className={word.includes('NIAMEY') ? 'text-brand-kaki' : ''}>
                {word}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="font-sans text-brand-gris text-sm md:text-base max-w-md font-medium leading-relaxed mb-10"
          >
            Une curation sans compromis. Pièces exclusives, soins et essentiels lifestyle. Livraison express dans la capitale.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.4, delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-max"
          >
            <Link 
              to="/catalogue"
              className="group relative w-full sm:w-auto flex items-center justify-center bg-brand-kaki text-brand-noir px-8 py-4 text-xs font-bold uppercase tracking-widest border border-brand-kaki overflow-hidden hover:bg-[#7a8a5a] transition-colors"
            >
              <span className="relative z-10">Explorer la sélection</span>
            </Link>
            <button 
              onClick={handleWhatsAppGeneral}
              className="group relative w-full sm:w-auto bg-transparent text-brand-kaki px-8 py-4 text-xs font-bold uppercase tracking-widest border border-brand-kaki flex justify-center hover:bg-brand-kaki hover:text-brand-noir transition-colors"
            >
              <span className="relative z-10">Fast Order (WhatsApp)</span>
            </button>
          </motion.div>
        </div>
        
        <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#555] border-t border-[#333] pt-8">
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-kaki"></div> Livraison 24h</span>
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-kaki"></div> Qualité premium</span>
        </div>
      </div>

      {/* Right Side: Editorial Image */}
      <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-auto border-t lg:border-t-0 lg:border-l border-[#333] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale-[20%] hover:scale-105 transition-transform duration-[10s] ease-linear"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1523398002811-999aa8ffdd59?auto=format&fit=crop&q=80&w=2000")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-noir/60 to-transparent lg:hidden" />
        <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10 text-brand-blanc">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-brand-noir px-2 py-1 border border-[#333]">Lookbook</span>
          <p className="mt-2 font-display tracking-wider text-xl">ESSENTIELS DE SAISON</p>
        </div>
      </div>
    </section>
  );
}
