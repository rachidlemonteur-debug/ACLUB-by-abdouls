import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format numbers to FCFA (XOF)
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(price).replace('XOF', 'FCFA');
}

// Generate WhatsApp Link
export function getWhatsAppLink(message: string, phone: string = "22700000000"): string { // Placeholder Niger number
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
