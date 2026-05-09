import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutGrid, MessageCircle, User } from 'lucide-react';
import { useApp } from '../../store/AppContext';

export function BottomNav() {
  const { settings, trackWhatsAppClick } = useApp();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-brand-noir/90 backdrop-blur-md border-t border-white/10 flex justify-around items-center px-2 py-3 sm:hidden">
      <NavLink 
        to="/" 
        end
        className={({ isActive }) => 
          `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-brand-kaki' : 'text-brand-gris hover:text-brand-blanc'}`
        }
      >
        <Home className="w-5 h-5" />
        <span className="text-[9px] uppercase tracking-widest font-bold">Accueil</span>
      </NavLink>

      <NavLink 
        to="/catalogue" 
        className={({ isActive }) => 
          `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-brand-kaki' : 'text-brand-gris hover:text-brand-blanc'}`
        }
      >
        <LayoutGrid className="w-5 h-5" />
        <span className="text-[9px] uppercase tracking-widest font-bold">Shop</span>
      </NavLink>

      <button 
        onClick={() => {
          trackWhatsAppClick('Bottom Nav');
          const message = encodeURIComponent('Bonjour AClub 👋 Je voudrais passer une commande et profiter des -10%. Pouvez-vous m\'aider ?');
          window.open(`https://wa.me/${settings.whatsappNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
        }}
        className="flex flex-col items-center gap-1 text-brand-gris hover:text-[#25D366] transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-[9px] uppercase tracking-widest font-bold">Contact</span>
      </button>

      <NavLink 
        to="/admin/login" 
        className={({ isActive }) => 
          `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-brand-kaki' : 'text-brand-gris hover:text-brand-blanc'}`
        }
      >
        <User className="w-5 h-5" />
        <span className="text-[9px] uppercase tracking-widest font-bold">Admin</span>
      </NavLink>
    </div>
  );
}
