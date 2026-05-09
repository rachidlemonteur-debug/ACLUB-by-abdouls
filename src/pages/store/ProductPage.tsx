import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { formatPrice, getWhatsAppLink, cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Check, MessageCircle, ShieldCheck, Truck } from 'lucide-react';

import { PageTransition } from '../../components/ui/PageTransition';
import { ProductReviews } from '../../components/store/ProductReviews';

import { motion } from 'motion/react';

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products, trackWhatsAppClick, addToCart, settings } = useApp();
  
  const product = products.find(p => p.slug === slug);

  const productColors = Array.isArray(product?.variants) 
    ? product.variants.filter((v: any) => v.name.toLowerCase() === 'couleur').map((v: any) => v.value)
    : [];
  const productSizes = Array.isArray(product?.variants)
    ? product.variants.filter((v: any) => v.name.toLowerCase() === 'taille').map((v: any) => v.value)
    : [];

  // Initialize selected variants if they exist
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (productColors.length > 0) {
      setSelectedColor(productColors[0]);
    } else {
      setSelectedColor(null);
    }
    
    if (productSizes.length > 0) {
      setSelectedSize(productSizes[0]);
    } else {
      setSelectedSize(null);
    }
  }, [slug, product]);

  if (!product) {
    return <Navigate to="/" replace />;
  }

  const handleWhatsAppClick = () => {
    trackWhatsAppClick(product.name);
    
    const variantDetails = [];
    if (selectedColor) variantDetails.push(`Couleur: ${selectedColor}`);
    if (selectedSize) variantDetails.push(`Taille: ${selectedSize}`);
    const variantString = variantDetails.join(', ');
    
    const discountedPrice = Math.round(product.price * 0.9);
    
    let messageTemplate = settings.defaultWhatsappMessage || "Bonjour AClub, je souhaite commander : {produit} - {variante} au prix de {prix}";
    messageTemplate = messageTemplate.replace('{produit}', product.name)
                                     .replace('{variante}', variantString)
                                     .replace('{prix}', formatPrice(discountedPrice));
                                     
    const message = encodeURIComponent(messageTemplate);
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      productName: product.name,
      price: Math.round(product.price * 0.9), // Applying the 10% discount to cart price
      quantity: 1,
      selectedColor: selectedColor || undefined,
      selectedSize: selectedSize || undefined,
      image: product.images[0]
    });
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 3000);
  };

  const discountedPrice = Math.round(product.price * 0.9);

  return (
    <PageTransition>
    <div className="bg-brand-noir text-brand-blanc min-h-screen">
      <div className="max-w-[1440px] mx-auto px-0 sm:px-6 lg:px-12 py-0 border-t border-[#333]">
        <div className="flex flex-col md:flex-row relative">
          
          {/* Images Gallery - Scrollable Stack */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-[60%] lg:w-[65%] flex flex-col gap-1 border-r border-[#333]"
          >
            <div className="hidden md:flex flex-col w-full">
              {product.images.map((img, idx) => (
                <div key={idx} className="w-full aspect-[4/5] bg-[#0f0f0f] relative overflow-hidden">
                  <img 
                    src={img} 
                    alt={`${product.name} - Vue ${idx + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            {/* Mobile slider/single image view */}
            <div className="flex flex-col md:hidden w-full">
              <div className="w-full aspect-[4/5] bg-[#0f0f0f] relative overflow-hidden">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Optional: we could add a horizontal scroll for other images on mobile here */}
              {product.images.length > 1 && (
                <div className="flex overflow-x-auto gap-1 mt-1 snap-x">
                  {product.images.slice(1).map((img, idx) => (
                    <div key={idx} className="w-[80vw] shrink-0 aspect-[4/5] bg-[#0f0f0f] relative overflow-hidden snap-center">
                      <img 
                        src={img} 
                        alt={`${product.name} - Vue ${idx + 2}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info - Sticky Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full md:w-[40%] lg:w-[35%] px-6 py-12 md:px-12 relative"
          >
            <div className="md:sticky md:top-24">
              
              <div className="mb-4">
                <span className="text-[10px] font-bold text-brand-gris uppercase tracking-widest border border-[#333] px-2 py-1">{product.category}</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-display text-brand-blanc mb-4 tracking-[0.05em] uppercase leading-none">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <p className="text-2xl text-brand-kaki tracking-widest font-mono font-bold">
                  {formatPrice(discountedPrice)}
                </p>
                <p className="text-lg text-brand-gris tracking-widest font-mono line-through">
                  {formatPrice(product.price)}
                </p>
                <span className="text-[10px] font-bold text-brand-noir bg-brand-kaki px-2 py-1 uppercase tracking-widest">
                  -10% SITE
                </span>
              </div>
              <div className="flex items-center gap-2 mb-12 text-[10px] font-bold tracking-widest text-[#d97706] uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d97706] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d97706]"></span>
                </span>
                Très demandé · {Math.floor(Math.random() * 5) + 2} pièces restantes
              </div>

              <div className="w-full h-px bg-[#333] mb-12" />

              <div className="prose prose-sm sm:prose-base text-brand-blanc mb-8 max-w-none">
                <p className="font-sans text-sm font-medium leading-relaxed opacity-80">{product.description}</p>
              </div>

              {(product.materials || product.careInstructions) && (
                <div className="mb-12 space-y-4">
                  {product.materials && (
                    <div>
                      <h4 className="text-[10px] font-bold text-brand-gris uppercase tracking-widest mb-1">Matière</h4>
                      <p className="font-sans text-sm text-brand-blanc/80">{product.materials}</p>
                    </div>
                  )}
                  {product.careInstructions && (
                    <div>
                      <h4 className="text-[10px] font-bold text-brand-gris uppercase tracking-widest mb-1">Entretien</h4>
                      <p className="font-sans text-sm text-brand-blanc/80">{product.careInstructions}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Variants */}
              {(productColors.length > 0 || productSizes.length > 0) && (
                <div className="mb-12 space-y-8">
                  {productColors.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[10px] font-bold text-brand-gris uppercase tracking-widest">Couleur</h3>
                        <span className="text-[10px] font-bold text-brand-kaki uppercase">{selectedColor}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {productColors.map(color => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={cn(
                              "px-5 py-3 border text-[10px] font-bold uppercase tracking-widest transition-colors",
                              selectedColor === color 
                                ? "border-brand-kaki bg-brand-kaki text-brand-noir" 
                                : "border-[#333] text-brand-gris hover:border-brand-blanc hover:text-brand-blanc"
                            )}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {productSizes.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[10px] font-bold text-brand-gris uppercase tracking-widest">Taille</h3>
                        <span className="text-[10px] font-bold text-brand-kaki uppercase">{selectedSize}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {productSizes.map(size => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={cn(
                              "min-w-[3.5rem] px-4 py-3 border text-[10px] font-bold uppercase tracking-widest transition-colors",
                              selectedSize === size 
                                ? "border-brand-kaki bg-brand-kaki text-brand-noir" 
                                : "border-[#333] text-brand-gris hover:border-brand-blanc hover:text-brand-blanc"
                            )}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mb-12">
                <ul className="space-y-4 border-t border-b border-[#333] py-6">
                  {product.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-brand-kaki mr-4 font-mono text-xs mt-1">[{String(idx + 1).padStart(2, '0')}]</span>
                      <span className="text-brand-gris text-xs sm:text-sm font-medium uppercase tracking-wider">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col gap-3 relative">
                <button 
                  onClick={handleWhatsAppClick}
                  className="w-full bg-[#25D366] text-brand-noir py-5 text-sm font-bold uppercase tracking-widest hover:bg-[#20bd5a] transition-colors border border-[#25D366] flex justify-center items-center gap-2 group relative overflow-hidden"
                >
                  <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" /> COMMANDER VIA WHATSAPP
                  <span className="absolute right-0 top-0 h-full w-4 bg-white/20 blur-sm -skew-x-[20deg] px-6 -translate-x-[200%] group-hover:translate-x-[500%] transition-transform duration-700"></span>
                </button>
                <div className="flex items-center gap-2 text-xs text-brand-gris text-center w-full justify-center mt-2">
                  <ShieldCheck className="w-4 h-4 text-brand-kaki" /> Paiement sécurisé à la livraison ou Mobile Money
                </div>
              </div>

              {/* Social Proof & Trust */}
              <div className="mt-10 mb-8 flex gap-4 overflow-x-hidden p-4 bg-[#111] border border-[#222]">
                <div className="flex flex-col items-center justify-center border-r border-[#333] pr-4 w-1/3">
                  <span className="text-xl font-display font-bold text-brand-blanc">1K+</span>
                  <span className="text-[9px] uppercase tracking-widest text-brand-gris text-center mt-1">Commandes livrées</span>
                </div>
                 <div className="flex flex-col items-center justify-center border-r border-[#333] pr-4 w-1/3">
                  <span className="text-xl font-display font-bold text-brand-kaki">48h</span>
                  <span className="text-[9px] uppercase tracking-widest text-brand-gris text-center mt-1">Satisfait ou échangé</span>
                </div>
                <div className="flex flex-col items-center justify-center w-1/3">
                  <Star className="w-5 h-5 text-brand-kaki mb-1 fill-brand-kaki" />
                  <span className="text-[9px] uppercase tracking-widest text-brand-gris text-center">Avis 5 Étoiles</span>
                </div>
              </div>

              {/* Inline FAQ */}
              <div className="mt-8 border-t border-[#222]">
                <details className="group border-b border-[#222]">
                  <summary className="flex justify-between items-center font-bold cursor-pointer list-none py-4 text-brand-blanc hover:text-brand-kaki transition-colors text-xs uppercase tracking-widest">
                    <span>Livraison rapide à Niamey</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="16" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="pb-4 text-brand-gris text-xs leading-relaxed">
                    Livraison en 24h-48h n'importe où à Niamey. Commandez avant 16h pour une programmation dès le lendemain.
                  </div>
                </details>

                <details className="group border-b border-[#222]">
                  <summary className="flex justify-between items-center font-bold cursor-pointer list-none py-4 text-brand-blanc hover:text-brand-kaki transition-colors text-xs uppercase tracking-widest">
                    <span>Paiements acceptés</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="16" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="pb-4 text-brand-gris text-xs leading-relaxed">
                    Options 100% sécurisées : espèces à la livraison (Cash) ou via Mobile Money au moment de valider sur WhatsApp.
                  </div>
                </details>

                <details className="group border-b border-[#222]">
                  <summary className="flex justify-between items-center font-bold cursor-pointer list-none py-4 text-brand-blanc hover:text-brand-kaki transition-colors text-xs uppercase tracking-widest">
                    <span>Retours & Échanges</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="16" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="pb-4 text-brand-gris text-xs leading-relaxed">
                    Satisfait ou échangé sous 48h (excepté sous-vêtements et cosmétiques). Le produit doit être dans son état d'origine.
                  </div>
                </details>
              </div>
              
            </div>
          </motion.div>
        </div>
      </div>
      
      <ProductReviews productId={product.id} />
    </div>
    </PageTransition>
  );
}
