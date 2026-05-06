import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Save } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function AdminSettings() {
  const { settings, updateSettings } = useApp();
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    alert('Paramètres enregistrés !');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold text-black mb-2">Configuration</h1>
        <p className="text-neutral-500 text-sm">Gérez les paramètres globaux de votre boutique AClub.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 max-w-2xl">
        <div className="space-y-6">
          
          <div>
            <h3 className="font-semibold text-black mb-4">Contact & Boutique</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Nom de la boutique
                </label>
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Numéro WhatsApp (Format International sans '+')
                </label>
                <input
                  type="text"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="Ex: 22700000000"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
                <p className="text-xs text-neutral-500 mt-1">Sera utilisé pour tous les boutons "Commander sur WhatsApp".</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Message WhatsApp par défaut
                </label>
                <textarea
                  value={formData.defaultWhatsappMessage || ''}
                  onChange={(e) => setFormData({ ...formData, defaultWhatsappMessage: e.target.value })}
                  placeholder="Ex: Bonjour AClub, je souhaite commander : {produit} - {variante}"
                  rows={2}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
                <p className="text-xs text-neutral-500 mt-1">Variables : {'{produit}'}, {'{variante}'}, {'{prix}'}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-200">
            <h3 className="font-semibold text-black mb-4">Textes d'accroche (Footer)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Slogan
                </label>
                <input
                  type="text"
                  value={formData.slogan}
                  onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-200">
            <h3 className="font-semibold text-black mb-4">Réseaux Sociaux</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Lien Instagram
                </label>
                <input
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-200 flex justify-end">
            <Button type="submit" className="bg-brand-kaki text-brand-noir hover:bg-[#7a8a5a] gap-2">
              <Save className="w-4 h-4" /> Enregistrer les modifications
            </Button>
          </div>

        </div>
      </form>
    </div>
  );
}
