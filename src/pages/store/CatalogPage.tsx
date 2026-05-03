import React, { useEffect, useState } from 'react';
import { useApp } from '../../store/AppContext';
import { formatPrice } from '../../lib/utils';
import { ArrowRight, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

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
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-6 sm:gap-y-16">
          {filteredProducts.map((product) => (
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
                    Commander <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-24 border border-[#333] bg-[#0f0f0f]">
            <p className="text-brand-gris font-medium text-sm">Aucun produit ne correspond à votre recherche pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
