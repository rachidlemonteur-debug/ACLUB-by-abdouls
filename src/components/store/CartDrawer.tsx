import React from 'react';
import { useApp } from '../../store/AppContext';
import { formatPrice } from '../../lib/utils';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateCartItemQuantity, clearCart, settings, trackWhatsAppClick } = useApp();

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = () => {
    trackWhatsAppClick('Panier Checkout');
    let message = `Bonjour ${settings.storeName} 👋\n\nJe souhaite valider mon panier :\n\n`;
    
    cart.forEach(item => {
      message += `- ${item.quantity}x ${item.productName}`;
      if (item.selectedColor) message += ` (${item.selectedColor})`;
      if (item.selectedSize) message += ` (Taille: ${item.selectedSize})`;
      message += ` - ${formatPrice(item.price * item.quantity)}\n`;
    });
    
    message += `\n*TOTAL: ${formatPrice(cartTotal)}*\n\nPouvez-vous me confirmer la disponibilité et les modalités de livraison ?`;
    
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    
    // Optionally clear cart after checkout
    // clearCart();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-noir/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-brand-noir h-full flex flex-col border-l border-[#333] shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#333]">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-brand-kaki" />
            <h2 className="text-lg font-display text-brand-blanc tracking-widest uppercase">Mon Panier</h2>
            <span className="bg-[#222] text-brand-blanc text-xs px-2 py-0.5 ml-2 font-bold">{cart.length}</span>
          </div>
          <button onClick={onClose} className="p-2 -mr-2 text-brand-gris hover:text-brand-blanc transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <ShoppingBag className="w-16 h-16 text-[#333]" strokeWidth={1} />
              <p className="text-brand-gris font-medium">Votre panier est tristement vide.</p>
              <button 
                onClick={onClose}
                className="text-brand-kaki text-xs font-bold uppercase tracking-widest hover:underline mt-4"
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button 
                  onClick={clearCart}
                  className="text-[10px] text-brand-gris font-bold uppercase tracking-widest hover:text-brand-blanc flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Vider le panier
                </button>
              </div>
              
              {cart.map((item) => (
                <div key={item.cartItemId} className="flex gap-4 border border-[#333] p-3 bg-[#0f0f0f]">
                  <div className="w-20 h-24 shrink-0 bg-[#111] overflow-hidden">
                    <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex flex-col flex-1 py-1">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <Link to={`/product/${item.productId}`} onClick={onClose} className="text-sm font-bold text-brand-blanc hover:text-brand-kaki transition-colors line-clamp-2">
                        {item.productName}
                      </Link>
                      <button 
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-brand-gris hover:text-brand-terra transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-[10px] font-bold text-brand-gris uppercase tracking-widest mb-auto">
                      {item.selectedColor && <span>{item.selectedColor}</span>}
                      {item.selectedColor && item.selectedSize && <span>/</span>}
                      {item.selectedSize && <span>T: {item.selectedSize}</span>}
                    </div>
                    
                    <div className="flex items-end justify-between mt-4">
                      <div className="flex items-center border border-[#333] bg-brand-noir">
                        <button 
                          onClick={() => updateCartItemQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-brand-gris hover:text-brand-blanc hover:bg-[#222] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-brand-blanc">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateCartItemQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-brand-gris hover:text-brand-blanc hover:bg-[#222] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-brand-kaki font-mono">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-[#333] bg-[#0f0f0f]">
            <div className="flex justify-between items-end mb-6">
              <span className="text-xs font-bold text-brand-gris uppercase tracking-widest">Total provisoire</span>
              <span className="text-2xl font-bold text-brand-blanc font-mono">{formatPrice(cartTotal)}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full bg-brand-kaki text-brand-noir py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#7a8a5a] transition-colors flex items-center justify-center gap-2"
            >
              Commander sur WhatsApp
            </button>
            <p className="text-center text-[10px] text-brand-gris mt-4 font-medium">
              Le paiement et la livraison seront organisés avec vous via WhatsApp.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
