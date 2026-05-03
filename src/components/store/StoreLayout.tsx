import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { FloatingWhatsApp } from '../ui/FloatingWhatsApp';
import { useApp } from '../../store/AppContext';

export function StoreLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { settings, trackWhatsAppClick } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-brand-noir text-brand-blanc">
      {/* Promo Bar */}
      <div className="bg-brand-kaki text-brand-noir text-[10px] sm:text-xs font-bold tracking-widest uppercase py-2.5 text-center px-4">
        {settings.storeName} · Livraison rapide · Réponse immédiate
      </div>

      {/* Navbar */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${isHome ? 'bg-brand-noir/90 backdrop-blur-md border-b border-white/5' : 'bg-brand-noir border-b border-brand-anthracite'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-brand-blanc p-2 -ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <nav className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest">
              <Link to="/" className="text-brand-blanc hover:text-brand-kaki transition-colors">Accueil</Link>
              <Link to="/catalogue" className="text-brand-gris hover:text-brand-blanc transition-colors">Catalogue</Link>
              <Link to="/a-propos" className="text-brand-gris hover:text-brand-blanc transition-colors">À Propos</Link>
            </nav>
          </div>

          <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group">
            <span className="font-display text-4xl tracking-[0.1em] leading-none text-brand-blanc">ACLUB</span>
            <span className="font-serif italic text-xs text-brand-kaki mt-0.5 group-hover:text-brand-blanc transition-colors">by Abdouls</span>
          </Link>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => {
                trackWhatsAppClick('Menu Principal');
                const message = encodeURIComponent('Bonjour AClub 👋 Je voudrais passer une commande. Pouvez-vous m\'aider ?');
                window.open(`https://wa.me/${settings.whatsappNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
              }}
              className="bg-brand-kaki text-brand-noir px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-[#7a8a5a] transition-colors hidden sm:block border border-brand-kaki"
            >
              Commander sur WhatsApp →
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute top-[80px] left-0 w-full bg-brand-noir border-b border-[#333] lg:hidden shadow-2xl">
            <nav className="flex flex-col p-4 gap-2">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-brand-blanc hover:text-brand-kaki transition-colors py-4 px-4 font-bold uppercase tracking-widest text-sm border-b border-[#222]">Accueil</Link>
              <Link to="/catalogue" onClick={() => setIsMobileMenuOpen(false)} className="text-brand-blanc hover:text-brand-kaki transition-colors py-4 px-4 font-bold uppercase tracking-widest text-sm border-b border-[#222]">Catalogue</Link>
              <Link to="/a-propos" onClick={() => setIsMobileMenuOpen(false)} className="text-brand-blanc hover:text-brand-kaki transition-colors py-4 px-4 font-bold uppercase tracking-widest text-sm border-b border-[#222]">À Propos</Link>
              <div className="pt-4 pb-2 px-4">
                <button 
                  onClick={() => {
                    trackWhatsAppClick('Menu Mobile');
                    const message = encodeURIComponent('Bonjour AClub 👋 Je voudrais passer une commande. Pouvez-vous m\'aider ?');
                    window.open(`https://wa.me/${settings.whatsappNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
                  }}
                  className="w-full bg-brand-kaki text-brand-noir px-4 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#7a8a5a] transition-colors border border-brand-kaki flex justify-center items-center"
                >
                  Commander sur WhatsApp →
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 sm:pb-0">
        <Outlet />
      </main>

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp />

      {/* Footer */}
      <footer className="bg-[#060606] border-t border-brand-kaki pt-16 pb-24 sm:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div>
              <Link to="/" className="flex flex-col items-start mb-6 group">
                <span className="font-display text-3xl tracking-[0.1em] leading-none text-brand-blanc">ACLUB</span>
                <span className="font-serif italic text-sm text-brand-kaki mt-1 group-hover:text-brand-blanc transition-colors">by Abdouls</span>
              </Link>
              <p className="font-serif italic text-brand-gris max-w-xs mb-4">
                "La sélection qui te ressemble. Sélectionné. Livré. C'est tout."
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-kaki">
                Basé à Niamey, Niger
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-brand-blanc mb-6 uppercase tracking-widest text-xs">Navigation</h3>
              <ul className="space-y-4 text-sm text-brand-gris font-medium">
                <li><Link to="/" className="hover:text-brand-kaki transition-colors">Accueil</Link></li>
                <li><Link to="/catalogue" className="hover:text-brand-kaki transition-colors">Le Catalogue</Link></li>
                <li><Link to="/a-propos" className="hover:text-brand-kaki transition-colors">À Propos</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-brand-blanc mb-6 uppercase tracking-widest text-xs">Contact</h3>
              <ul className="space-y-4 text-sm text-brand-gris font-medium">
                <li><a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-kaki transition-colors">Instagram @aclubbyabdouls</a></li>
                <li><a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-kaki transition-colors">WhatsApp Direct</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[#222] flex flex-col justify-center items-center text-[10px] font-bold uppercase tracking-widest text-brand-gris text-center">
            <p>&copy; {new Date().getFullYear()} {settings.storeName.toUpperCase()}. TOUS DROITS RÉSERVÉS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
