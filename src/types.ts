export interface Category {
  id: string;
  name: string;
  slug?: string;
  created_at?: string;
  // added for old mock code
  icon?: string;
  color?: string;
  order?: number;
}

export interface Product {
  id: string;
  title?: string;
  slug: string;
  description: string;
  price: number;
  category_id?: string;
  is_active?: boolean;
  status_badge?: string;
  created_at?: string;
  updated_at?: string;
  
  // Associative references 
  category?: any;
  variants?: any;
  images?: ProductImage[] | string[];

  // For compatibility with mock code
  name?: string;
  isPopular?: boolean;
  badge?: string;
  materials?: string;
  careInstructions?: string;
  benefits?: string[];
  stockStatus?: string;
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  value: string;
  sku: string;
  additional_price?: number;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  variant_id?: string;
  image_url: string;
  display_order: number;
  created_at: string;
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

export interface AdminStats {
  totalViews: number;
  whatsappClicks: number;
  topProducts: { name: string; views: number }[];
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

export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  isActive: boolean;
}

export interface Bundle {
  id: string;
  name: string;
  products: string[];
}

export interface AppSettings {
  whatsappNumber: string;
  defaultWhatsappMessage?: string;
  storeName: string;
  slogan: string;
  instagramUrl: string;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export type ProductCategoryType = "Mode" | "Soin" | "Accessoire" | "Bundle";
