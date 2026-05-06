import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Testimonial, AdminStats, Category, Banner, PromoCode, Bundle, AppSettings, CartItem } from '../types';
import { getProducts, getCategories } from '../services/firebaseService';

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

const initialProducts: Product[] = []; // Now fetching from Firebase

const initialTestimonials: Testimonial[] = [
  { id: "t1", name: "Amadou S.", content: "Le baume est incroyable. J'en mets une fois le matin et c'est bon pour la journée, même avec la chaleur de Niamey. Qualité ouf.", productName: "Baume à Lèvres", rating: 5, date: "2024-03-12", isActive: true },
  { id: "t2", name: "Ibrahim K.", content: "T-shirt commandé sur WhatsApp, reçu en 24h. Le fit boxy est parfait, on dirait une marque de LA mais pensé pour nous.", productName: "T-Shirt Boxy", rating: 5, date: "2024-03-15", isActive: true },
  { id: "t3", name: "Nasser A.", content: "Enfin un concept store ici qui propose des essentiels avec un vrai soin du détail. Je valide à 100%.", productName: "Essentials Kit", rating: 5, date: "2024-03-20", isActive: true },
];

const initialPromoCodes: PromoCode[] = [];
const initialBundles: Bundle[] = [];

const initialSettings: AppSettings = {
  whatsappNumber: "22700000000",
  defaultWhatsappMessage: "Bonjour AClub, je souhaite commander : {produit} - {variante}",
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
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartItemQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('aclub_testimonials');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0 && parsed[0].content.includes('Le baume est incroyable. J\'en mets une fois le matin et c\'est bon pour la journée. Qualité ouf.')) {
        return initialTestimonials;
      }
      return parsed;
    }
    return initialTestimonials;
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

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('aclub_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    // Load products and categories from Firebase
    const loadFirebaseData = async () => {
      try {
        const prodData = await getProducts();
        const mappedProducts: Product[] = prodData.map((p: any) => ({
          id: p.id,
          name: p.title,
          slug: p.slug,
          price: p.price,
          category: p.category?.name || 'Mode',
          description: p.description,
          materials: '',
          benefits: [],
          careInstructions: '',
          images: p.images?.length ? p.images.map((i: any) => i.image_url) : ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800'],
          isActive: p.is_active,
          badge: p.status_badge || 'Aucun',
          stockStatus: 'Disponible',
          isPopular: false,
          isFeatured: true,
          variants: {
            colors: p.variants?.filter((v:any) => v.name === 'Couleur').map((v:any) => v.value),
            sizes: p.variants?.filter((v:any) => v.name === 'Taille').map((v:any) => v.value)
          }
        }));
        setProducts(mappedProducts);

        const catsData = await getCategories();
        if (catsData.length > 0) {
          const mappedCats: Category[] = catsData.map((c: any) => ({
             id: c.id,
             name: c.name,
             icon: 'Shirt',
             color: '#8B9B6B',
             order: 1
          }));
          setCategories(mappedCats);
        }
      } catch (err) {
        console.error("Failed to load generic store data", err);
      }
    };
    loadFirebaseData();
  }, []);

  const addToCart = (item: Omit<CartItem, 'cartItemId'>) => {
    setCart(prev => {
      const existingItem = prev.find(
        i => i.productId === item.productId && i.selectedColor === item.selectedColor && i.selectedSize === item.selectedSize
      );

      if (existingItem) {
        return prev.map(i =>
          i.cartItemId === existingItem.cartItemId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }

      return [...prev, { ...item, cartItemId: Date.now().toString() }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateCartItemQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.cartItemId === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  // Effects for persistence
  useEffect(() => { localStorage.setItem('aclub_testimonials', JSON.stringify(testimonials)); }, [testimonials]);
  useEffect(() => { localStorage.setItem('aclub_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('aclub_stats', JSON.stringify(stats)); }, [stats]);
  useEffect(() => { localStorage.setItem('aclub_cart', JSON.stringify(cart)); }, [cart]);

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
      cart,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      clearCart,
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
