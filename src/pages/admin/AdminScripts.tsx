import React from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function AdminScripts() {
  const [copied, setCopied] = React.useState<number | null>(null);

  const scripts = [
    {
      id: 1,
      title: "Script 1: Premier contact (Chaud)",
      context: "Quand un client clique sur 'Commander' depuis le site et envoie le message prérempli.",
      content: "Bonjour [Nom] ! 👋 Merci de l'intérêt pour [Produit].\n\nExcellent choix, c'est l'un de nos best-sellers.\nIl est bien disponible actuellement au prix de [Prix] FCFA.\n\nSouhaites-tu que l'on procède à la réservation ? Je peux organiser une livraison pour [Aujourd'hui/Demain] sur Niamey."
    },
    {
      id: 2,
      title: "Script 2: Relance et Upsell",
      context: "1h après validation de la première commande (avant la livraison).",
      content: "Super [Nom], ta commande pour le [Produit] est confirmée et en préparation ! 🚀\n\nAu fait, vu que tu as pris ce produit, beaucoup de nos clients recommandent de l'associer avec notre [Produit Complémentaire] pour [Bénéfice majeur].\n\nSi ça t'intéresse, je peux l'ajouter sans frais de livraison supplémentaires. Dis-moi si tu veux voir quelques photos !"
    },
    {
      id: 3,
      title: "Script 3: Suivi post-livraison",
      context: "3 jours après la livraison pour fidéliser et demander un avis.",
      content: "Salut [Nom] ! 👋 J'espère que tu vas bien.\n\nJe venais simplement aux nouvelles : comment se passe ton expérience avec le [Produit] ?\n\nSi tu es satisfait(e), n'hésite pas à partager une photo dans ta story en nous mentionnant @aclubbyabdouls, ça nous aide énormément ! 🙏"
    }
  ];

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold text-black mb-2">Scripts WhatsApp</h1>
        <p className="text-neutral-500 text-sm">Templates de messages pour maximiser les conversions et fidéliser vos clients.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scripts.map((script) => (
          <div key={script.id} className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50">
              <h2 className="text-base font-semibold text-black mb-1">{script.title}</h2>
              <p className="text-sm text-neutral-500 font-medium leading-relaxed">{script.context}</p>
            </div>
            
            <div className="p-6 bg-neutral-50/50 flex-1 relative">
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => handleCopy(script.content, script.id)}
                  className="p-2 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors shadow-sm text-neutral-600"
                  title="Copier le script"
                >
                  {copied === script.id ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <pre className="text-sm text-black font-sans whitespace-pre-wrap leading-relaxed pr-10">
                {script.content}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
