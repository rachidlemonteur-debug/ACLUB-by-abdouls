import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Testimonial, AdminStats, Category, Banner, PromoCode, Bundle, AppSettings } from '../types';

// Mock initial data
const initialCategories: Category[] = [
  { id: 'c1', name: 'Mode', icon: 'Shirt', color: '#8B9B6B', order: 1 },
  { id: 'c2', name: 'Soin', icon: 'Sparkles', color: '#8B9B6B', order: 2 },
  { id: 'c3', name: 'Accessoire', icon: 'Watch', color: '#8B9B6B', order: 3 },
  { id: 'c4', name: 'Bundle', icon: 'Package', color: '#8B9B6B', order: 4 },
];

const initialBanners: Banner[] = [
  {
    id: 'b1',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=2000',
    title: 'LA SÉLECTION QUI TE RESSEMBLE.',
    subtitle: 'Des produits bien choisis, commandés en un message.',
    ctaText: 'Commander sur WhatsApp',
    ctaLink: '#',
    isActive: true,
    order: 1
  }
];

const initialProducts: Product[] = [
  {
    id: "p1",
    name: "Baume à Lèvres Essentiel",
    slug: "baume-a-levres-essentiel",
    price: 3500,
    category: "Soin",
    description: "Formulé pour une hydratation intense et durable. Une texture non-grasse, un fini mat invisible. L'essentiel du quotidien repensé avec élégance.",
    benefits: ["Hydratation 24h", "Fini invisible, sans brillance", "Ingrédients naturels purs"],
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800"],
    isPopular: true,
    badge: "PROMO",
    stockStatus: "Disponible",
    isActive: true,
    isFeatured: true
  },
  {
    id: "p2",
    name: "Casquette Signature AClub",
    slug: "casquette-signature",
    price: 12000,
    category: "Accessoire",
    description: "Minimaliste, structurée, intemporelle. Coupe classique avec broderie ton sur ton subtile. Conçue pour s'adapter parfaitement et élever n'importe quelle tenue.",
    benefits: ["Coton brossé premium", "Visière pré-courbée parfaite", "Ajustement sur-mesure"],
    images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800"],
    variants: {
      colors: ["Noir", "Beige Sable"]
    },
    badge: "NOUVEAU",
    stockStatus: "Disponible",
    isActive: true,
    isFeatured: true
  },
  {
    id: "p3",
    name: "Boxer Premium AClub",
    slug: "boxer-premium",
    price: 8500,
    category: "Mode",
    description: "Le confort absolu sans compromis sur le style. Maintien invisible, ceinture souple sans marque, coton respirant haute densité.",
    benefits: ["Coton élasthanne respirant", "Ceinture douce anti-marque", "Coupe ergonomique"],
    images: ["https://images.unsplash.com/photo-1603525281559-0f6a27e0ac05?auto=format&fit=crop&q=80&w=800"],
    variants: {
      colors: ["Noir", "Blanc", "Gris Chine"],
      sizes: ["S", "M", "L", "XL"]
    },
    badge: "Aucun",
    stockStatus: "Disponible",
    isActive: true,
    isFeatured: true
  },
  {
    id: "p4",
    name: "AClub Essentials Kit",
    slug: "aclub-essentials-kit",
    price: 21000,
    category: "Bundle",
    description: "La trinité AClub. Tout ce dont vous avez besoin pour améliorer vos basiques au quotidien. Baume, Casquette et Boxer en un pack avantageux.",
    benefits: ["Le kit complet AClub", "Avantage sur le prix unitaire", "Cadeau idéal"],
    images: ["https://images.unsplash.com/photo-1605810731677-4c079237baf6?auto=format&fit=crop&q=80&w=800"],
    isPopular: true,
    variants: {
      sizes: ["S", "M", "L", "XL"]
    },
    badge: "Aucun",
    stockStatus: "Disponible",
    isActive: true,
    isFeatured: true
  }
];

const initialTestimonials: Testimonial[] = [
  { id: "t1", name: "Amadou S.", content: "Le baume est incroyable. J'en mets une fois le matin et c'est bon pour la journée. Qualité ouf.", productName: "Baume à Lèvres", rating: 5, date: "2024-03-12", isActive: true },
  { id: "t2", name: "Ibrahim K.", content: "Casquette commandée sur WhatsApp, reçue vite. Le fit est parfait et la matière très premium.", productName: "Casquette Signature", rating: 5, date: "2024-03-15", isActive: true },
  { id: "t3", name: "Nasser A.", content: "Enfin une marque ici qui propose des essentiels avec un vrai soin du détail. Les boxers sont top.", productName: "Boxer Premium", rating: 5, date: "2024-03-20", isActive: true },
];

const initialPromoCodes: PromoCode[] = [];
const initialBundles: Bundle[] = [];

const initialSettings: AppSettings = {
  whatsappNumber: "22700000000",
  storeName: "AClub by Abdouls",
  slogan: "Sélectionné. Livré. C'est tout.",
  instagramUrl: "https://instagram.com/aclubbyabdouls"
};

interface AppContextType {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  testimonials: Testimonial[];
  promoCodes: PromoCode[];
  bundles: Bundle[];
  settings: AppSettings;
  stats: AdminStats;
  trackWhatsAppClick: (productName: string) => void;
  trackPageView: () => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // State definitions...
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('aclub_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('aclub_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('aclub_testimonials');
    return saved ? JSON.parse(saved) : initialTestimonials;
  });
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(initialPromoCodes);
  const [bundles, setBundles] = useState<Bundle[]>(initialBundles);
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('aclub_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });
  const [stats, setStats] = useState<AdminStats>(() => {
    const saved = localStorage.getItem('aclub_stats');
    return saved ? JSON.parse(saved) : {
      totalViews: 458,
      whatsappClicks: 52,
      topProducts: [
        { name: "Baume à Lèvres Essentiel", views: 231 },
        { name: "Casquette Signature AClub", views: 184 },
        { name: "Boxer Premium AClub", views: 95 }
      ]
    };
  });

  // Effects for persistence
  useEffect(() => { localStorage.setItem('aclub_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('aclub_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('aclub_testimonials', JSON.stringify(testimonials)); }, [testimonials]);
  useEffect(() => { localStorage.setItem('aclub_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('aclub_stats', JSON.stringify(stats)); }, [stats]);

  const trackWhatsAppClick = (productName: string) => {
    setStats(prev => ({
      ...prev,
      whatsappClicks: prev.whatsappClicks + 1
    }));
    console.log(`WhatsApp click tracked for: ${productName}`);
  };

  const trackPageView = () => {
    setStats(prev => ({
      ...prev,
      totalViews: prev.totalViews + 1
    }));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: `p${Date.now()}` };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <AppContext.Provider value={{ 
      products, 
      categories,
      banners,
      testimonials, 
      promoCodes,
      bundles,
      settings,
      stats, 
      trackWhatsAppClick, 
      trackPageView,
      addProduct,
      updateProduct,
      deleteProduct,
      updateSettings
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
