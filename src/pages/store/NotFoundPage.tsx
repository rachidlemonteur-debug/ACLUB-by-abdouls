import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useApp } from '../../store/AppContext';

export function NotFoundPage() {
  const { settings } = useApp();

  return (
    <div className="min-h-[80vh] flex flex-col w-full bg-brand-noir items-center justify-center p-6 border-t border-[#333] text-center">
      <div className="max-w-xl mx-auto flex flex-col items-center">
        <h1 className="text-[12rem] font-display text-brand-kaki leading-none mb-4 md:mb-8 opacity-80">
          404
        </h1>
        <h2 className="text-3xl md:text-5xl font-display text-brand-blanc uppercase tracking-widest mb-6">
          Article introuvable
        </h2>
        <p className="text-brand-gris font-medium mb-12 uppercase tracking-widest text-xs md:text-sm">
          Il semble que vous ayez cliqué sur un lien cassé ou que la page ait été déplacée. 
          Ne vous inquiétez pas, le reste du club est toujours ouvert.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link 
            to="/catalogue"
            className="flex-1 bg-brand-kaki text-brand-noir px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#7a8a5a] transition-colors border border-brand-kaki group flex justify-center items-center gap-2"
          >
            Le Catalogue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href={`https://wa.me/${settings.whatsappNumber}?text=Bonjour,%20j'ai%20besoin%20d'aide%20pour%20trouver%20un%20article.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#111] text-brand-blanc px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#222] transition-colors border border-[#333] flex justify-center items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" /> Support WhatsApp
          </a>
        </div>
        
        <Link to="/" className="text-brand-gris hover:text-brand-blanc text-xs font-bold uppercase tracking-widest transition-colors mt-12 underline underline-offset-4">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
