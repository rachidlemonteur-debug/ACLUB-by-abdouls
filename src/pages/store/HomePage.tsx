import React, { useEffect, useState } from 'react';
import { useApp } from '../../store/AppContext';
import { formatPrice } from '../../lib/utils';
import { Star, ArrowRight, Shirt, Monitor, Home, Sparkles, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

import { PageTransition } from '../../components/ui/PageTransition';

export function HomePage() {
  const { products, testimonials, settings, trackPageView, trackWhatsAppClick } = useApp();
  const location = useLocation();

  useEffect(() => {
    trackPageView();
    
    // Check if there is a hash in the URL, if so scroll to it
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.hash]);

  const handleWhatsAppProduct = (productName: string, price: number) => {
    trackWhatsAppClick(`Produit: ${productName}`);
    const discountedPrice = Math.round(price * 0.9);
    const message = encodeURIComponent(`Bonjour AClub 👋 Je suis intéressé(e) par ${productName} (Offre Site -10%). Le prix est de ${formatPrice(discountedPrice)} au lieu de ${formatPrice(price)}. Est-il disponible ?`);
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppGeneral = () => {
    trackWhatsAppClick('Bannière WhatsApp');
    const message = encodeURIComponent('Bonjour AClub 👋 Je voudrais passer une commande via le site et profiter des -10%. Pouvez-vous m\'aider ?');
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const categoriesUI = [
    { name: 'Mode', icon: <Shirt className="w-8 h-8 mb-4" /> },
    { name: 'Soin', icon: <Sparkles className="w-8 h-8 mb-4" /> },
    { name: 'Accessoire', icon: <Home className="w-8 h-8 mb-4" /> }, // Example icon mapped
    { name: 'Bundle', icon: <Monitor className="w-8 h-8 mb-4" /> }, // Example icon mapped
  ];

  return (
    <PageTransition>
      <div className="flex flex-col w-full">
      {/* SECTION 1 — HERO / EDITORIAL */}
      <section className="relative w-full bg-brand-noir min-h-[90vh] flex flex-col lg:flex-row border-b border-[#333]">
        {/* Left Side: Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 lg:px-16 py-20 lg:py-0 z-10">
          <div className="mb-12">
            <span className="inline-block border border-[#333] px-3 py-1 text-[10px] uppercase font-bold tracking-widest text-brand-kaki mb-6">
              Concept Store · Niamey
            </span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-6xl md:text-8xl font-display text-brand-blanc leading-[0.9] tracking-[0.02em] mb-6"
            >
              L'ÉLITE DU<br />STREETWEAR<br /><span className="text-brand-kaki">À NIAMEY.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-sans text-brand-gris text-sm md:text-base max-w-md font-medium leading-relaxed mb-10"
            >
              Une curation sans compromis. Pièces exclusives, soins et essentiels lifestyle. Livraison express dans la capitale.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-max"
            >
              <Link 
                to="/catalogue"
                className="w-full sm:w-auto flex items-center justify-center bg-brand-kaki text-brand-noir px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#7a8a5a] transition-colors border border-brand-kaki"
              >
                Explorer la sélection
              </Link>
              <button 
                onClick={handleWhatsAppGeneral}
                className="w-full sm:w-auto bg-transparent text-brand-kaki px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand-kaki hover:text-brand-noir transition-colors border border-brand-kaki flex justify-center"
              >
                Fast Order (WhatsApp)
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
            className="absolute inset-0 bg-cover bg-center grayscale-[20%] hover:scale-105 transition-transform duration-[1.5s]"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1523398002811-999aa8ffdd59?auto=format&fit=crop&q=80&w=2000")' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-noir/60 to-transparent lg:hidden" />
          <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10 text-brand-blanc">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-brand-noir px-2 py-1 border border-[#333]">Lookbook</span>
            <p className="mt-2 font-display tracking-wider text-xl">ESSENTIELS DE SAISON</p>
          </div>
        </div>
      </section>

      {/* SECTION 2 — DÉPARTEMENTS */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="bg-brand-noir py-16 lg:py-24 border-b border-[#333]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl lg:text-5xl font-display text-brand-blanc tracking-[0.05em]">CLASSEMENT OBLIGATOIRE</h2>
            <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest text-brand-gris">Départements</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-[#333]">
            {categoriesUI.map((cat, idx) => (
              <Link 
                key={idx}
                to="/catalogue"
                state={{ category: cat.name }}
                className="group relative flex flex-col justify-between h-48 sm:h-64 border-b lg:border-b-0 lg:border-r border-[#333] p-6 hover:bg-brand-anthracite transition-colors duration-300"
              >
                <div className="text-brand-kaki group-hover:scale-110 transition-transform duration-500 origin-top-left">
                  {cat.icon}
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="font-display text-2xl lg:text-3xl tracking-wider text-brand-blanc group-hover:text-brand-kaki transition-colors">{cat.name}</span>
                  <ArrowRight className="w-5 h-5 text-brand-gris group-hover:text-brand-kaki transform group-hover:translate-x-2 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SECTION 3 — LE CATALOGUE (Aperçu) */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        id="collection" 
        className="py-24 bg-brand-noir border-b border-[#333]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl lg:text-5xl font-display text-brand-blanc tracking-[0.05em] mb-2">LATEST DROPS</h2>
              <p className="text-brand-gris font-medium text-sm">Les pièces exclusives fraîchement ajoutées.</p>
            </div>
            <Link 
              to="/catalogue"
              className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-kaki hover:text-brand-blanc transition-colors"
            >
              Voir tout l'inventaire <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-6 sm:gap-y-16">
            {products
              .filter(p => p.isActive)
              .slice(0, 4)
              .map((product) => (
              <div key={product.id} className="group flex flex-col">
                {/* Image Area */}
                <Link to={`/product/${product.slug}`} className="relative aspect-[3/4] bg-[#0f0f0f] overflow-hidden block mb-4">
                  {product.badge && product.badge !== "Aucun" && (
                    <div className="absolute top-4 left-4 z-10 bg-brand-blanc text-brand-noir text-[10px] font-bold uppercase tracking-widest px-2 py-1">
                      {product.badge}
                    </div>
                  )}
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                  {product.images[1] && (
                    <img 
                      src={product.images[1]} 
                      alt={`${product.name} alternate`}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    />
                  )}
                </Link>
                
                {/* Info Area */}
                <div className="flex flex-col grow">
                  <div className="flex justify-between items-start mb-1">
                    <Link to={`/product/${product.slug}`} className="text-sm font-bold text-brand-blanc hover:text-brand-kaki transition-colors truncate pr-4">
                      {product.name}
                    </Link>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-brand-kaki whitespace-nowrap">
                        {formatPrice(Math.round(product.price * 0.9))}
                      </span>
                      <span className="text-[10px] text-brand-gris line-through whitespace-nowrap">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gris mb-4">{product.category}</span>
                  
                  <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 transform">
                    <button 
                      onClick={() => handleWhatsAppProduct(product.name, product.price)}
                      className="w-full bg-brand-kaki text-brand-noir py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#7a8a5a] transition-colors flex items-center justify-center gap-2"
                    >
                      Cop Now <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link 
            to="/catalogue"
            className="w-full sm:hidden mt-12 flex items-center justify-center gap-2 text-brand-kaki text-xs font-bold uppercase tracking-widest border border-[#333] py-4 hover:bg-[#111] transition-colors"
          >
            Voir tout l'inventaire <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.section>

      {/* SECTION 4 — COMMENT ÇA MARCHE */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="bg-brand-noir py-24 border-y border-[#333]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-6xl font-display text-brand-blanc mb-16 tracking-[0.05em] text-center">AUSSI SIMPLE QUE ÇA</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#333] border border-[#333]">
            
            <div className="bg-brand-noir p-8 sm:p-12 relative overflow-hidden group">
              <span className="absolute -top-4 -right-2 text-[120px] font-display text-[#111] leading-none pointer-events-none select-none z-0">01</span>
              <div className="relative z-10">
                <div className="font-bold text-xs uppercase tracking-widest text-brand-kaki mb-4">Étape 01</div>
                <h3 className="text-2xl font-bold text-brand-blanc mb-3">Tu parcours</h3>
                <p className="font-sans text-brand-gris text-sm font-medium">Découvre notre catalogue en ligne. Choisis les pièces qui matchent avec ton style.</p>
              </div>
            </div>

            <div className="bg-brand-noir p-8 sm:p-12 relative overflow-hidden group">
              <span className="absolute -top-4 -right-2 text-[120px] font-display text-[#111] leading-none pointer-events-none select-none z-0">02</span>
              <div className="relative z-10">
                <div className="font-bold text-xs uppercase tracking-widest text-brand-kaki mb-4">Étape 02</div>
                <h3 className="text-2xl font-bold text-brand-blanc mb-3">Tu envoies</h3>
                <p className="font-sans text-brand-gris text-sm font-medium">Un clic sur "Commander", et ton message WhatsApp est déjà prêt. Simple, direct.</p>
              </div>
            </div>

            <div className="bg-brand-noir p-8 sm:p-12 relative overflow-hidden group">
              <span className="absolute -top-4 -right-2 text-[120px] font-display text-[#111] leading-none pointer-events-none select-none z-0">03</span>
              <div className="relative z-10">
                <div className="font-bold text-xs uppercase tracking-widest text-brand-kaki mb-4">Étape 03</div>
                <h3 className="text-2xl font-bold text-brand-blanc mb-3">Tu reçois</h3>
                <p className="font-sans text-brand-gris text-sm font-medium">Validation avec nous, puis livraison rapide où tu le souhaites à Niamey.</p>
              </div>
            </div>

          </div>
        </div>
      </motion.section>

      {/* SECTION 5 — AVIS CLIENTS */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-24 bg-brand-anthracite"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display text-brand-blanc tracking-[0.05em] mb-4">ILS ONT COMMANDÉ</h2>
          </div>
          
          {/* Add horizontal scroll wrapper on mobile */}
          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0 gap-6 snap-x">
            {testimonials.filter(t => t.isActive).map((testi) => (
              <div key={testi.id} className="min-w-[280px] sm:min-w-0 bg-brand-noir p-8 border border-[#333] flex flex-col snap-start shrink-0">
                <div className="flex text-brand-kaki mb-6 gap-1">
                  {[...Array(testi.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="font-serif italic text-brand-blanc leading-relaxed mb-8 grow text-lg text-brand-blanc/90">"{testi.content}"</p>
                <div className="pt-4 border-t border-[#222]">
                  <p className="font-bold text-xs uppercase tracking-widest text-brand-kaki mb-1">{testi.name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gris flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Client vérifié
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SECTION 6 — BANNIÈRE WHATSAPP */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="bg-brand-kaki text-brand-noir w-full"
      >
        <div className="max-w-4xl mx-auto px-4 py-24 sm:py-32 text-center flex flex-col items-center">
          <h2 className="text-5xl md:text-8xl font-display mb-6 tracking-[0.05em] leading-none text-brand-noir">CONCIERGERIE PRIVÉE</h2>
          <p className="font-bold uppercase tracking-widest text-xs sm:text-sm mb-12 text-brand-noir/80">RÉSERVATION en un clic VIA WHATSAPP (-10%). LIVRAISON OÙ TU VEUX.</p>
          <button 
            onClick={handleWhatsAppGeneral}
            className="w-full sm:w-auto bg-brand-noir text-brand-blanc px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-[#222] transition-colors border border-brand-noir"
          >
            COMMANDER MAINTENANT →
          </button>
        </div>
      </motion.section>

      {/* SECTION 7 — FAQ */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-24 bg-brand-noir border-t border-[#333]"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display text-brand-blanc tracking-[0.05em] mb-4">FAQS</h2>
          </div>
          
          <div className="space-y-4">
            <details className="group border border-[#333] bg-[#0f0f0f] rounded-none">
              <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-brand-blanc hover:text-brand-kaki transition-colors">
                <span className="uppercase tracking-widest text-xs">Quels sont les délais et zones de livraison ?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="p-6 pt-0 text-brand-gris text-sm font-medium">
                La livraison express est disponible uniquement à Niamey. Une fois votre commande confirmée sur WhatsApp, vous serez livré(e) dans un délai de 24 à 48 heures.
              </div>
            </details>
            
            <details className="group border border-[#333] bg-[#0f0f0f] rounded-none">
              <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-brand-blanc hover:text-brand-kaki transition-colors">
                <span className="uppercase tracking-widest text-xs">Quels sont les moyens de paiement ?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="p-6 pt-0 text-brand-gris text-sm font-medium">
                Vous avez la possibilité de régler votre commande en Cash à la livraison ou via Mobile Money (+227). Le choix vous sera demandé lors de la validation WhatsApp.
              </div>
            </details>

            <details className="group border border-[#333] bg-[#0f0f0f] rounded-none">
              <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-brand-blanc hover:text-brand-kaki transition-colors">
                <span className="uppercase tracking-widest text-xs">Comment fonctionne le processus de commande ?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="p-6 pt-0 text-brand-gris text-sm font-medium">
                C'est très simple : ajoutez vos produits au panier, cliquez sur "Commander sur WhatsApp". Un message pré-rempli sera généré listant tout votre panier avec 10% de réduction. Nous vérifierons la disponibilité, et viendrons planifier la livraison directement avec vous.
              </div>
            </details>

            <details className="group border border-[#333] bg-[#0f0f0f] rounded-none">
              <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-brand-blanc hover:text-brand-kaki transition-colors">
                <span className="uppercase tracking-widest text-xs">Puis-je retourner ou échanger un article ?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="p-6 pt-0 text-brand-gris text-sm font-medium">
                Les retours et échanges sont acceptés sous 48h, uniquement si l'article n'a pas été porté/utilisé et se trouve dans son état d'origine. Les soins cosmétiques (ex: Baume à lèvres) ne sont ni repris ni échangés par mesure d'hygiène.
              </div>
            </details>
          </div>
        </div>
      </motion.section>
    </div>
    </PageTransition>
  );
}

