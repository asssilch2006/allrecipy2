import React from 'react';

export interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'cta' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export const PillButton: React.FC<PillButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  ...props
}) => {
  // Size classes conforming to 8pt grid
  const sizeClasses = {
    sm: 'text-xs py-1.5 px-4 gap-1.5 min-h-[32px]',
    md: 'text-sm py-2.5 px-6 gap-2 min-h-[40px]',
    lg: 'text-base py-3 px-8 gap-2.5 min-h-[48px]',
  }[size];

  // Variant styling matching design system tokens
  const variantClasses = {
    // Primary Sage Green (#8A9A5B)
    primary:
      'bg-[#8A9A5B] hover:bg-[#77864B] text-white font-bold shadow-xs hover:shadow-md border border-transparent',
    // Warm Terracotta (#E2725B) for high-conversion CTAs
    cta:
      'bg-[#E2725B] hover:bg-[#D05E47] text-white font-bold shadow-sm hover:shadow-lg shadow-[#E2725B]/25 border border-transparent',
    // Soft Sage Tinted Secondary
    secondary:
      'bg-[#F4F6F0] hover:bg-[#E8ECE0] text-[#2D4534] font-bold border border-[#8A9A5B]/30 hover:border-[#8A9A5B]',
    // Clean Outline on Crisp White
    outline:
      'bg-white hover:bg-[#F4F6F0] text-[#1A202C] hover:text-[#2D4534] font-bold border border-stone-300 hover:border-[#8A9A5B]',
    // Ghost
    ghost:
      'bg-transparent hover:bg-stone-100 text-[#1A202C] hover:text-[#2D4534] font-bold border border-transparent',
  }[variant];

  return (
    <button
      disabled={disabled}
      className={`rounded-full inline-flex items-center justify-center transition-all duration-200 cursor-pointer select-none
        hover:-translate-y-0.5 active:translate-y-0 active:scale-98 disabled:opacity-50 disabled:pointer-events-none disabled:hover:translate-y-0 disabled:hover:shadow-none
        ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
