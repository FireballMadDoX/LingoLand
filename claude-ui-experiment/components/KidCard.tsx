import React from 'react';
import { motion } from 'framer-motion';

type Accent = 'grape' | 'coral' | 'sky' | 'lime' | 'gold' | 'neutral';

interface KidCardProps {
  children: React.ReactNode;
  accent?: Accent;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const accentBorders: Record<Accent, string> = {
  grape:   'border-t-4 border-violet-400',
  coral:   'border-t-4 border-rose-400',
  sky:     'border-t-4 border-sky-400',
  lime:    'border-t-4 border-emerald-400',
  gold:    'border-t-4 border-amber-400',
  neutral: 'border-t-4 border-gray-200',
};

const pads = { sm: 'p-4', md: 'p-6', lg: 'p-8' };

export const KidCard: React.FC<KidCardProps> = ({
  children, accent = 'neutral', className = '', onClick, hoverable = false, padding = 'md',
}) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverable ? { y: -4, boxShadow: '0 24px 48px rgba(124,58,237,0.18)' } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
      className={`
        bg-white rounded-3xl overflow-hidden
        ${accentBorders[accent]}
        ${pads[padding]}
        ${hoverable ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default KidCard;
