// Global Types
export type ProductCategoryType = string;

export interface ProductVariants {
  colors?: string[];
  sizes?: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  materials?: string;         // added for product detailed description
  careInstructions?: string;  // added for product detailed description
  benefits: string[];
  category: ProductCategoryType;
  images: string[];
  slug: string;
  isPopular?: boolean;        // Mapped to "Nouveau" ou "Promo" badge in rendering if you want
  badge?: "Aucun" | "NOUVEAU" | "PROMO";
  variants?: ProductVariants;
  stockStatus: string;        // e.g. "Disponible" or "Épuisé" or actual number as string
  isActive: boolean;
  isFeatured: boolean;
}

export interface CartItem {
  cartItemId: string; // unique generated ID to handle multiple of same product with diff variants
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  order: number;
}

export interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  content: string;
  productName: string;
  rating: number;
  date: string;
  isActive: boolean;
}

export interface PromoCode {
  id: string;
  name: string;
  type: 'percent' | 'fixed';
  value: number;
  expiresAt: string;
  isActive: boolean;
}

export interface Bundle {
  id: string;
  name: string;
  productIds: string[];
  price: number;
  savings: string;
  duration: string;
}

export interface AdminStats {
  totalViews: number;
  whatsappClicks: number;
  topProducts: { name: string; views: number }[];
}

export interface AppSettings {
  whatsappNumber: string;
  storeName: string;
  slogan: string;
  instagramUrl: string;
}
