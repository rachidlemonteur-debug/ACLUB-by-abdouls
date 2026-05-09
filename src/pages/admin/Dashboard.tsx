import React, { useState, useEffect } from 'react';
import { Package, Tag, AlertTriangle, TrendingUp, Users, DollarSign, ShoppingCart, Percent } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function Dashboard() {
  const [stats, setStats] = useState({ products: 0, variantsOutStock: 0, categories: 0 });
  const [loading, setLoading] = useState(true);

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 1500000 },
    { month: 'Fév', revenue: 1800000 },
    { month: 'Mar', revenue: 1200000 },
    { month: 'Avr', revenue: 2100000 },
    { month: 'Mai', revenue: 2400000 },
    { month: 'Juin', revenue: 2800000 },
    { month: 'Juil', revenue: 3200000 },
    { month: 'Août', revenue: 2900000 },
    { month: 'Sep', revenue: 3500000 },
    { month: 'Oct', revenue: 3800000 },
    { month: 'Nov', revenue: 4500000 },
    { month: 'Déc', revenue: 5200000 },
  ];

  const topProductsData = [
    { name: 'Air Jordan 1 Retro', sales: 124 },
    { name: 'Essentials Hoodie', sales: 98 },
    { name: 'Nike Dunk Low', sales: 85 },
    { name: 'Corteiz Cargo', sales: 64 },
    { name: 'New Balance 550', sales: 52 },
  ];

  const paymentData = [
    { name: 'Cash', value: 65, color: '#0A0A0A' },
    { name: 'Mobile Money', value: 35, color: '#C9A84C' },
  ];

  const trafficData = [
    { day: 'Lun', visits: 400, conversions: 24 },
    { day: 'Mar', visits: 300, conversions: 18 },
    { day: 'Mer', visits: 550, conversions: 35 },
    { day: 'Jeu', visits: 450, conversions: 28 },
    { day: 'Ven', visits: 600, conversions: 42 },
    { day: 'Sam', visits: 800, conversions: 65 },
    { day: 'Dim', visits: 750, conversions: 58 },
  ];

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const prodCount = await getCountFromServer(query(collection(db, 'products'), where('isActive', '==', true)));
        const catCount = await getCountFromServer(collection(db, 'categories'));
        // Try/catch just for the variants collection if it doesn't exist
        let outStockCountVal = 0;
        try {
          const outStockCount = await getCountFromServer(query(collection(db, 'product_variants'), where('stockQuantity', '==', 0)));
          outStockCountVal = outStockCount.data().count;
        } catch(e) {}
        
        setStats({
          products: prodCount.data().count,
          categories: catCount.data().count,
          variantsOutStock: outStockCountVal
        });
      } catch (err) {
        console.error("Dashboard stats failed", err);
      }
      setLoading(false);
    }
    loadStats();
  }, []);

  const formatFCFA = (val: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(val).replace('XOF', 'FCFA');

  const metricCards = [
    { title: "CA du mois", value: formatFCFA(5200000), trend: "+15.5%", icon: DollarSign, color: "text-[#C9A84C]" },
    { title: "Commandes", value: "342", trend: "+12", icon: ShoppingCart, color: "text-blue-500" },
    { title: "Panier moyen", value: formatFCFA(45000), trend: "+5%", icon: TrendingUp, color: "text-green-500" },
    { title: "Taux Conversion", value: "8.4%", trend: "+1.2%", icon: Percent, color: "text-purple-500" },
    { title: "Clients actifs (30j)", value: "128", trend: "+24", icon: Users, color: "text-orange-500" },
    { title: "Stock Total (Réf)", value: stats.products.toString(), trend: "5 Ruptures", icon: Package, color: "text-red-500" },
  ];

  return (
    <div className="bg-white p-2">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-black mb-1">TABLEAU DE BORD</h1>
          <p className="text-neutral-500 text-sm">Vue d'ensemble de la boutique AClub.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm border border-neutral-300 rounded-md font-medium text-neutral-700 hover:bg-neutral-50">Exporter CSV</button>
          <button className="px-4 py-2 text-sm bg-brand-noir text-white rounded-md font-medium hover:bg-neutral-800">Rapport PDF</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {metricCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start mb-2">
                <p className="text-neutral-500 text-sm font-medium">{stat.title}</p>
                <div className={`p-2 rounded-lg bg-neutral-50 ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-black mb-2">{stat.value}</p>
              <p className="text-xs font-medium text-green-600 bg-green-50 w-max px-2 py-0.5 rounded-full">{stat.trend}</p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-noir transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Ligne : Revenus sur 12 mois */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-bold text-black mb-6 uppercase tracking-wider">Évolution du CA (12 mois)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip formatter={(value: number) => formatFCFA(value)} cursor={{ stroke: '#E5E5E5', strokeWidth: 1 }} />
                <Line type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#0A0A0A', stroke: '#C9A84C' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Camanbert : Modes de paiement */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
          <h2 className="text-sm font-bold text-black mb-6 uppercase tracking-wider">Modes de Paiement</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {paymentData.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-neutral-600 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        {/* Bar : Top 5 Produits */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
          <h2 className="text-sm font-bold text-black mb-6 uppercase tracking-wider">Top 5 Produits Ventes</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E5E5" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} width={120} />
                <Tooltip cursor={{ fill: '#F5F5F5' }} />
                <Bar dataKey="sales" fill="#0A0A0A" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area : Trafic vs Conversions */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
          <h2 className="text-sm font-bold text-black mb-6 uppercase tracking-wider">Trafic vs Conversion (7j)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A0A0A" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0A0A0A" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} />
                <Tooltip cursor={{ stroke: '#E5E5E5', strokeWidth: 1 }} />
                <Area yAxisId="left" type="monotone" dataKey="visits" name="Visites" stroke="#0A0A0A" fillOpacity={1} fill="url(#colorVisits)" />
                <Area yAxisId="right" type="monotone" dataKey="conversions" name="Clics WA" stroke="#C9A84C" fillOpacity={1} fill="url(#colorConversions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
