import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { formatPrice, getWhatsAppLink, cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Check, MessageCircle, ShieldCheck, Truck } from 'lucide-react';

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products, trackWhatsAppClick, addToCart } = useApp();
  
  const product = products.find(p => p.slug === slug);

  // Initialize selected variants if they exist
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product?.variants) {
      if (product.variants.colors && product.variants.colors.length > 0) {
        setSelectedColor(product.variants.colors[0]);
      } else {
        setSelectedColor(null);
      }
      
      if (product.variants.sizes && product.variants.sizes.length > 0) {
        setSelectedSize(product.variants.sizes[0]);
      } else {
        setSelectedSize(null);
      }
    } else {
      setSelectedColor(null);
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
    <div className="bg-brand-noir text-brand-blanc min-h-screen">
      <div className="max-w-[1440px] mx-auto px-0 sm:px-6 lg:px-12 py-0 border-t border-[#333]">
        <div className="flex flex-col md:flex-row relative">
          
          {/* Images Gallery - Scrollable Stack */}
          <div className="w-full md:w-[60%] lg:w-[65%] flex flex-col gap-1 border-r border-[#333]">
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
          </div>

          {/* Product Info - Sticky Sidebar */}
          <div className="w-full md:w-[40%] lg:w-[35%] px-6 py-12 md:px-12 relative">
            <div className="md:sticky md:top-24">
              
              <div className="mb-4">
                <span className="text-[10px] font-bold text-brand-gris uppercase tracking-widest border border-[#333] px-2 py-1">{product.category}</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-display text-brand-blanc mb-4 tracking-[0.05em] uppercase leading-none">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-12">
                <p className="text-2xl text-brand-kaki tracking-widest font-mono font-bold">
                  {formatPrice(discountedPrice)}
                </p>
                <p className="text-lg text-brand-gris tracking-widest font-mono line-through">
                  {formatPrice(product.price)}
                </p>
                <span className="text-[10px] font-bold text-brand-noir bg-brand-kaki px-2 py-1 uppercase tracking-widest">
                  -10% Lancement
                </span>
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
              {product.variants && (
                <div className="mb-12 space-y-8">
                  {product.variants.colors && product.variants.colors.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[10px] font-bold text-brand-gris uppercase tracking-widest">Couleur</h3>
                        <span className="text-[10px] font-bold text-brand-kaki uppercase">{selectedColor}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.variants.colors.map(color => (
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

                  {product.variants.sizes && product.variants.sizes.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[10px] font-bold text-brand-gris uppercase tracking-widest">Taille</h3>
                        <span className="text-[10px] font-bold text-brand-kaki uppercase">{selectedSize}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.variants.sizes.map(size => (
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
                  onClick={handleAddToCart}
                  className="w-full bg-brand-kaki text-brand-noir py-5 text-xs font-bold uppercase tracking-widest hover:bg-[#7a8a5a] transition-colors border border-brand-kaki flex justify-center items-center gap-2"
                >
                  Ajouter au Panier
                </button>
                <button 
                  onClick={handleWhatsAppClick}
                  className="w-full bg-brand-noir text-brand-blanc py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#111] transition-colors border border-[#333] flex justify-center items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Achat Rapide
                </button>
                {addedMessage && (
                  <div className="absolute -top-12 left-0 right-0 bg-brand-kaki text-brand-noir text-xs font-bold text-center py-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    Produit ajouté au panier
                  </div>
                )}
              </div>

              {/* Trust Information */}
              <div className="mt-12 space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-[#222]">
                  <span className="text-[10px] font-bold tracking-widest text-brand-gris uppercase">Livraison</span>
                  <span className="text-[10px] font-bold tracking-widest text-brand-blanc uppercase text-right">Express Niamey</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[#222]">
                  <span className="text-[10px] font-bold tracking-widest text-brand-gris uppercase">Paiement</span>
                  <span className="text-[10px] font-bold tracking-widest text-brand-blanc uppercase text-right">Cash / Mobile Money</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[#222]">
                  <span className="text-[10px] font-bold tracking-widest text-brand-gris uppercase">Service Client</span>
                  <span className="text-[10px] font-bold tracking-widest text-brand-blanc uppercase text-right">Direct WhatsApp</span>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
