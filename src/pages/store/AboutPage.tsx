import React, { useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { ShieldCheck, Zap, HeartHandshake } from 'lucide-react';

export function AboutPage() {
  const { trackPageView } = useApp();

  useEffect(() => {
    trackPageView();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col w-full bg-brand-noir">
      <section className="py-24 lg:py-40 border-t border-[#333]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-24">
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-brand-kaki mb-6">Le Manifeste</span>
          <h1 className="text-5xl md:text-8xl font-display text-brand-blanc mb-12 tracking-[0.05em] leading-[0.9]">
            REDÉFINIR<br />L'ESSENTIEL.
          </h1>
          <p className="font-sans text-brand-gris text-lg sm:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            AClub est né d'une idée simple : proposer à Niamey une sélection pointue d'essentiels pour le quotidien, sans compromis sur la qualité. Nous retirons le superflu pour ne garder que l'excellence.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24 text-center pb-12">
            <div className="flex flex-col items-center">
              <div className="text-brand-kaki mb-8">
                <ShieldCheck className="w-10 h-10" strokeWidth={1} />
              </div>
              <h3 className="font-display font-medium text-3xl tracking-[0.05em] mb-4 text-brand-blanc">CURATION PREMIUM</h3>
              <p className="text-brand-gris text-sm leading-relaxed font-medium">Chaque produit est sélectionné avec une attention obsessionnelle. Nous ne proposons que ce que nous portons ou utilisons nous-mêmes.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-brand-kaki mb-8">
                <Zap className="w-10 h-10" strokeWidth={1} />
              </div>
              <h3 className="font-display font-medium text-3xl tracking-[0.05em] mb-4 text-brand-blanc">STREET ÉLÉGANCE</h3>
              <p className="text-brand-gris text-sm leading-relaxed font-medium">Un design minimaliste, pensé pour s'intégrer naturellement et élever votre style. Moins, mais infiniment mieux.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-brand-kaki mb-8">
                <HeartHandshake className="w-10 h-10" strokeWidth={1} />
              </div>
              <h3 className="font-display font-medium text-3xl tracking-[0.05em] mb-4 text-brand-blanc">SERVICE DIRECT</h3>
              <p className="text-brand-gris text-sm leading-relaxed font-medium">Une expérience d'achat directe, humaine et ultra-rapide exclusivement via WhatsApp. Pas d'attente, pas de fioritures.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-24 bg-brand-anthracite border-y border-[#333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="aspect-[4/3] bg-brand-noir overflow-hidden border border-[#333]">
              <img 
                src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=1200" 
                alt="Brand essence" 
                className="w-full h-full object-cover grayscale opacity-80"
              />
            </div>
            <div>
              <span className="text-brand-kaki border border-brand-kaki px-3 py-1 uppercase tracking-widest text-[10px] font-bold mb-6 inline-block">
                Basé à Niamey
              </span>
              <h2 className="text-4xl sm:text-5xl font-display text-brand-blanc tracking-[0.05em] leading-none mb-8">
                UNE APPROCHE<br /><span className="text-brand-kaki">SANS COMPROMIS.</span>
              </h2>
              <div className="space-y-6 text-brand-gris font-medium text-sm sm:text-base">
                <p>
                  Dans un monde saturé de choix et d'options inutiles, nous avons choisi la voie de la restriction assumée. Un catalogue limité, une sélection stricte.
                </p>
                <p>
                  Notre promesse est simple : vous faire gagner du temps tout en élevant votre quotidien. Commandez par un simple message de votre smartphone, et laissez-nous nous occuper du reste avec un service client qui met l'humain au centre.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
