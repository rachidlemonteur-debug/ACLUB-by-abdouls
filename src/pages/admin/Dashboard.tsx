import React from 'react';
import { useApp } from '../../store/AppContext';
import { MousePointerClick, Eye, TrendingUp, Package } from 'lucide-react';

export function Dashboard() {
  const { stats, products } = useApp();

  const statCards = [
    { title: "Vues Totales", value: stats.totalViews, icon: Eye, trend: "+12%" },
    { title: "Clics WhatsApp", value: stats.whatsappClicks, icon: MousePointerClick, trend: "+8%" },
    { title: "Produits en Ligne", value: products.length, icon: Package, trend: null },
    { title: "Taux de Clic", value: `${Math.round((stats.whatsappClicks / Math.max(1, stats.totalViews)) * 100)}%`, icon: TrendingUp, trend: null }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold text-black mb-2">Tableau de Bord</h1>
        <p className="text-neutral-500 text-sm">Aperçu rapide des performances de AClub by Abdouls.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-neutral-50 rounded-lg">
                  <Icon className="w-5 h-5 text-black" />
                </div>
                {stat.trend && (
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    {stat.trend}
                  </span>
                )}
              </div>
              <p className="text-neutral-500 text-sm font-medium mb-1">{stat.title}</p>
              <p className="text-2xl font-semibold text-black">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-200">
          <h2 className="text-base font-semibold text-black">Produits les plus populaires (MVP)</h2>
        </div>
        <div className="divide-y divide-neutral-100">
          {stats.topProducts.map((product, idx) => (
            <div key={idx} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-400">
                  {idx + 1}
                </div>
                <p className="text-sm font-medium text-black">{product.name}</p>
              </div>
              <div className="text-sm text-neutral-500">
                {product.views} vues
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
