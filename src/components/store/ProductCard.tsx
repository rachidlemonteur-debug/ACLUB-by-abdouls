import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { formatPrice } from '../../lib/utils';
import { ArrowRight } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onWhatsAppClick: (name: string, price: number) => void;
}

export function ProductCard({ product, onWhatsAppClick }: ProductCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 800
      }}
      className="group flex flex-col p-4 bg-brand-noir border border-[#222] hover:border-brand-kaki hover:shadow-[0_10px_30px_rgba(201,168,76,0.1)] transition-all duration-300"
    >
      {/* Image Area */}
      <Link to={`/product/${product.slug}`} className="relative aspect-[3/4] bg-[#0f0f0f] overflow-hidden block mb-4" style={{ transform: "translateZ(30px)" }}>
        {product.badge && product.badge !== "Aucun" && (
          <div className="absolute top-4 left-4 z-10 bg-brand-kaki text-brand-noir text-[10px] font-bold uppercase tracking-widest px-3 py-1 overflow-hidden">
            {product.badge}
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 animate-[shimmer_2s_infinite]" />
          </div>
        )}
        <img 
          src={product.images[0]} 
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
        />
        {product.images[1] && (
          <img 
            src={product.images[1]} 
            alt={`${product.name} alternate`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          />
        )}
      </Link>
      
      {/* Info Area */}
      <div className="flex flex-col grow" style={{ transform: "translateZ(20px)" }}>
        <div className="flex flex-col mb-1 min-h-[44px]">
          <Link to={`/product/${product.slug}`} className="text-sm font-serif font-bold text-brand-blanc hover:text-brand-kaki transition-colors line-clamp-2 leading-snug mb-1">
            {product.name}
          </Link>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-sm font-bold text-brand-kaki whitespace-nowrap font-mono">
              {formatPrice(Math.round(product.price * 0.9))}
            </span>
            <span className="text-[10px] text-brand-gris line-through whitespace-nowrap font-mono">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#555] mb-4">{product.category}</span>
        
        <div className="mt-auto opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-0 lg:translate-y-2 group-hover:translate-y-0 transform">
          <button 
            onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
               onWhatsAppClick(product.name, product.price);
            }}
            className="w-full bg-brand-kaki text-brand-noir py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#7a8a5a] transition-colors flex items-center justify-center gap-2 overflow-hidden relative cursor-pointer z-20"
          >
            <span className="relative z-10 flex items-center gap-2">Cop Now <ArrowRight className="w-3 h-3" /></span>
          </button>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(250%) skewX(-12deg); }
        }
      `}} />
    </motion.div>
  );
}
