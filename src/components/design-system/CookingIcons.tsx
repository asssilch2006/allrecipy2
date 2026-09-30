import React from 'react';

export interface CookingIconProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

/**
 * Minimalist Line Icon: Oven (Baking / Roasting)
 */
export const OvenIcon: React.FC<CookingIconProps> = ({
  className = 'w-4 h-4',
  size = 18,
  strokeWidth = 2,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Oven body */}
    <rect x="2" y="3" width="20" height="18" rx="2" />
    {/* Control knobs */}
    <circle cx="6" cy="6.5" r="1" fill={color} />
    <circle cx="10" cy="6.5" r="1" fill={color} />
    <line x1="14" y1="6.5" x2="18" y2="6.5" />
    {/* Divider line between control panel and glass door */}
    <line x1="2" y1="10" x2="22" y2="10" />
    {/* Glass window */}
    <rect x="5" y="12" width="14" height="6.5" rx="1" />
    {/* Oven rack line */}
    <line x1="7" y1="15" x2="17" y2="15" strokeDasharray="1.5 1.5" />
  </svg>
);

/**
 * Minimalist Line Icon: Blender (Smoothies / Purees / Sauces)
 */
export const BlenderIcon: React.FC<CookingIconProps> = ({
  className = 'w-4 h-4',
  size = 18,
  strokeWidth = 2,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Blender lid */}
    <path d="M8 2h8" />
    <path d="M10 2v2h4V2" />
    {/* Blender pitcher (tapered) */}
    <path d="M7 4h10l-1.5 11h-7L7 4z" />
    {/* Pitcher handle */}
    <path d="M17 7h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1.5" />
    {/* Motor base */}
    <rect x="6" y="16" width="12" height="6" rx="1.5" />
    {/* Dial knob */}
    <circle cx="12" cy="19" r="1" fill={color} />
  </svg>
);

/**
 * Minimalist Line Icon: Clock (Prep Time / Cooking Duration)
 */
export const ClockIcon: React.FC<CookingIconProps> = ({
  className = 'w-4 h-4',
  size = 18,
  strokeWidth = 2,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

/**
 * Minimalist Line Icon: Skillet / Stovetop
 */
export const SkilletIcon: React.FC<CookingIconProps> = ({
  className = 'w-4 h-4',
  size = 18,
  strokeWidth = 2,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Pan base */}
    <ellipse cx="10" cy="14" rx="7" ry="4" />
    {/* Pan depth */}
    <path d="M3 14v2c0 2.2 3.1 4 7 4s7-1.8 7-4v-2" />
    {/* Long handle */}
    <path d="M16 12l5.5-3.5a1 1 0 0 1 1.4.3 1 1 0 0 1-.3 1.4L17 14" />
  </svg>
);

/**
 * Minimalist Line Icon: Air Fryer
 */
export const AirFryerIcon: React.FC<CookingIconProps> = ({
  className = 'w-4 h-4',
  size = 18,
  strokeWidth = 2,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Outer rounded pod body */}
    <path d="M5 6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6z" />
    {/* Digital display */}
    <rect x="8.5" y="5.5" width="7" height="3" rx="1" />
    {/* Basket pull handle */}
    <rect x="6.5" y="11" width="11" height="7.5" rx="1.5" />
    <path d="M10.5 14h3" />
  </svg>
);
