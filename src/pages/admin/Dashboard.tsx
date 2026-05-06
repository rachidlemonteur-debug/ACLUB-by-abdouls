import React, { useState, useEffect } from 'react';
import { Package, Tag, AlertTriangle } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';

export function Dashboard() {
  const [stats, setStats] = useState({ products: 0, variantsOutStock: 0, categories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const prodCount = await getCountFromServer(query(collection(db, 'products'), where('isActive', '==', true)));
        const catCount = await getCountFromServer(collection(db, 'categories'));
        const outStockCount = await getCountFromServer(query(collection(db, 'product_variants'), where('stockQuantity', '==', 0)));
        
        setStats({
          products: prodCount.data().count,
          categories: catCount.data().count,
          variantsOutStock: outStockCount.data().count
        });
      } catch (err) {
        console.error("Dashboard stats failed", err);
      }
      setLoading(false);
    }
    loadStats();
  }, []);

  const statCards = [
    { title: "Produits Actifs", value: stats.products, icon: Package },
    { title: "Catégories", value: stats.categories, icon: Tag },
    { title: "Variantes en Rupture", value: stats.variantsOutStock, icon: AlertTriangle }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold text-black mb-2">Tableau de Bord</h1>
        <p className="text-neutral-500 text-sm">Aperçu rapide du catalogue AClub by Abdouls.</p>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Chargement des statistiques...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-neutral-50 rounded-lg">
                    <Icon className="w-5 h-5 text-black" />
                  </div>
                </div>
                <p className="text-neutral-500 text-sm font-medium mb-1">{stat.title}</p>
                <p className="text-2xl font-semibold text-black">{stat.value}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}
