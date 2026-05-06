import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Product, ProductVariant } from "../types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price).replace('XOF', 'FCFA');
}

export function getWhatsAppLink(product: Product, quantity: number, selectedVariant?: ProductVariant, phoneNumber?: string): string {
  let message = `Bonjour AClub, je souhaite commander : ${product.title || product.name}`;
  if (selectedVariant) {
    message += ` - ${selectedVariant.name}: ${selectedVariant.value}`;
  }
  message += ` (Quantité: ${quantity}).`;
  
  const num = phoneNumber || import.meta.env.VITE_WHATSAPP_NUMBER || "22700000000";
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}
