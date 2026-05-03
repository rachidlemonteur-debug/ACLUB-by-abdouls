import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg' | 'full';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    
    const variants = {
      primary: "bg-brand-kaki text-brand-noir hover:bg-[#7a8a5a] border border-brand-kaki",
      secondary: "bg-brand-blanc text-brand-noir hover:bg-[#e5e2dd] border border-brand-blanc",
      outline: "border border-brand-kaki text-brand-kaki hover:bg-brand-kaki hover:text-brand-noir",
      ghost: "text-brand-gris hover:text-brand-blanc hover:bg-brand-anthracite",
      whatsapp: "bg-brand-blanc text-brand-noir hover:bg-[#e5e2dd] border border-brand-blanc"
    };

    const sizes = {
      sm: "h-9 px-4 text-xs font-bold uppercase tracking-widest",
      md: "h-12 px-6 text-sm font-bold uppercase tracking-widest",
      lg: "h-14 px-8 text-base font-bold uppercase tracking-widest",
      full: "h-14 w-full text-sm font-bold uppercase tracking-widest"
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-none transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
        {!isLoading && children}
      </button>
    );
  }
);

Button.displayName = 'Button';
