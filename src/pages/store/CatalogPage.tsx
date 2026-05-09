import React, { useEffect, useState } from 'react';
import { useApp } from '../../store/AppContext';
import { formatPrice } from '../../lib/utils';
import { ArrowRight, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

import { PageTransition } from '../../components/ui/PageTransition';
import { ProductCard } from '../../components/store/ProductCard';

export function CatalogPage() {
  const { products, settings, trackPageView, trackWhatsAppClick } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('Tout');
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    trackPageView();
    
    // Check if category is passed in path state or hash
    if (location.state && location.state.category) {
      setActiveCategory(location.state.category);
    }
    
    window.scrollTo(0, 0);
  }, [location.state]);

  const handleWhatsAppProduct = (productName: string, price: number) => {
    trackWhatsAppClick(`Produit (Catalogue): ${productName}`);
    const discountedPrice = Math.round(price * 0.9);
    const message = encodeURIComponent(`Bonjour AClub 👋 Je suis intéressé(e) par ${productName} (Offre Site -10%). Le prix est de ${formatPrice(discountedPrice)} au lieu de ${formatPrice(price)}. Est-il disponible ?`);
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const filteredProducts = products
    .filter(p => p.isActive)
    .filter(p => activeCategory === 'Tout' || p.category === activeCategory)
    .filter(p => 
      searchQuery === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <PageTransition>
    <div className="flex flex-col w-full bg-brand-noir min-h-screen pt-12 pb-24 border-t border-[#333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 border-b border-[#333] pb-6 gap-6">
          <div className="w-full sm:w-auto">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-brand-kaki mb-4">Inventaire Intégral</span>
            <h1 className="text-4xl md:text-5xl font-display text-brand-blanc tracking-[0.05em] leading-none mb-6">LE CATALOGUE</h1>
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
              {['Tout', 'Mode', 'Soin', 'Accessoire', 'Bundle'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors border ${
                    activeCategory === cat
                      ? 'bg-brand-kaki text-brand-noir border-brand-kaki'
                      : 'bg-transparent text-brand-gris border-transparent hover:border-[#333] hover:text-brand-blanc'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full sm:w-auto flex flex-col items-start sm:items-end gap-4 relative">
            <div className="w-full sm:w-64 relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111] border border-[#333] text-brand-blanc text-sm px-4 py-3 pl-10 focus:outline-none focus:border-brand-kaki transition-colors"
              />
              <Search className="w-4 h-4 text-brand-gris absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <div className="text-brand-gris text-sm font-medium">
              {filteredProducts.length} résultats
            </div>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-6 sm:gap-y-16"
        >
          {filteredProducts.map((product, i) => (
             <ProductCard key={product.id} product={product} onWhatsAppClick={handleWhatsAppProduct} />
          ))}
        </motion.div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-24 border border-[#333] bg-[#0f0f0f]">
            <p className="text-brand-gris font-medium text-sm">Aucun produit ne correspond à votre recherche pour le moment.</p>
          </div>
        )}
      </div>
    </div>
    </PageTransition>
  );
}
