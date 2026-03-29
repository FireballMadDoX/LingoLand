import React from 'react';
import { motion } from 'framer-motion';
import { shadows } from '../../design/tokens';

type Variant = 'grape' | 'coral' | 'sky' | 'lime' | 'gold' | 'ghost';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface KidButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles: Record<Variant, { bg: string; text: string; shadow: string }> = {
  grape: { bg: 'bg-violet-500 hover:bg-violet-600',    text: 'text-white',    shadow: shadows.grape },
  coral: { bg: 'bg-rose-500 hover:bg-rose-600',        text: 'text-white',    shadow: shadows.coral },
  sky:   { bg: 'bg-sky-500 hover:bg-sky-600',          text: 'text-white',    shadow: shadows.sky   },
  lime:  { bg: 'bg-emerald-500 hover:bg-emerald-600',  text: 'text-white',    shadow: shadows.lime  },
  gold:  { bg: 'bg-amber-400 hover:bg-amber-500',      text: 'text-white',    shadow: shadows.gold  },
  ghost: { bg: 'bg-white hover:bg-gray-50',            text: 'text-gray-700', shadow: shadows.ghost },
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-xl gap-1.5',
  md: 'px-6 py-3 text-base rounded-2xl gap-2',
  lg: 'px-8 py-4 text-lg rounded-2xl gap-2',
  xl: 'px-10 py-5 text-xl rounded-3xl gap-3',
};

export const KidButton: React.FC<KidButtonProps> = ({
  children, onClick, variant = 'lime', size = 'md', disabled, className = '', icon, fullWidth, type = 'button'
}) => {
  const v = variantStyles[variant];
  const s = sizeStyles[size];

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { y: -2 }}
      whileTap={disabled ? {} : { y: 6, boxShadow: 'none' }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      style={{ boxShadow: disabled ? 'none' : v.shadow }}
      className={`
        font-heading font-bold inline-flex items-center justify-center
        ${v.bg} ${v.text} ${s}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${fullWidth ? 'w-full' : ''}
        transition-colors select-none
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default KidButton;
