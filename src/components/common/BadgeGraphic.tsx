import React from 'react';
import { Star, Flame, Trophy, Shield, Crown, Medal, Award, Target, Zap, Rocket } from 'lucide-react';

interface BadgeGraphicProps {
  level: number;
  size?: number;
}

export const BADGE_TIERS = [
  { name: 'Novice Spark',       colors: ['#D1D5DB', '#9CA3AF'], shadow: '#6B7280', Icon: Star },      // Lv 1
  { name: 'Bronze Explorer',    colors: ['#FCD34D', '#D97706'], shadow: '#B45309', Icon: Flame },     // Lv 2
  { name: 'Silver Voyager',     colors: ['#93C5FD', '#3B82F6'], shadow: '#1D4ED8', Icon: Shield },    // Lv 3
  { name: 'Gold Pathfinder',    colors: ['#FDE047', '#EAB308'], shadow: '#A16207', Icon: Trophy },    // Lv 4
  { name: 'Ruby Pioneer',       colors: ['#FCA5A5', '#EF4444'], shadow: '#B91C1C', Icon: Target },    // Lv 5
  { name: 'Emerald Sentinel',   colors: ['#6EE7B7', '#10B981'], shadow: '#047857', Icon: Medal },     // Lv 6
  { name: 'Sapphire Knight',    colors: ['#60A5FA', '#2563EB'], shadow: '#1E3A8A', Icon: Shield },    // Lv 7
  { name: 'Amethyst Scholar',   colors: ['#D8B4FE', '#9333EA'], shadow: '#581C87', Icon: Award },     // Lv 8
  { name: 'Crystal Master',     colors: ['#67E8F9', '#06B6D4'], shadow: '#155E75', Icon: Zap },       // Lv 9
  { name: 'Obsidian Legend',    colors: ['#4B5563', '#1F2937'], shadow: '#030712', Icon: Crown },     // Lv 10
  { name: 'Platinum Hero',      colors: ['#E2E8F0', '#94A3B8'], shadow: '#475569', Icon: Medal },     // Lv 11
  { name: 'Titanium Conqueror', colors: ['#99F6E4', '#0D9488'], shadow: '#115E59', Icon: Shield },    // Lv 12
  { name: 'Solar Champion',     colors: ['#FEF08A', '#F59E0B'], shadow: '#B45309', Icon: Rocket },    // Lv 13
  { name: 'Galactic Emperor',   colors: ['#C4B5FD', '#7C3AED'], shadow: '#4C1D95', Icon: Crown },     // Lv 14
  { name: 'Cosmic Overlord',    colors: ['#FDA4AF', '#E11D48'], shadow: '#9F1239', Icon: Star },      // Lv 15
  { name: 'Astral Being',       colors: ['#7DD3FC', '#0284C7'], shadow: '#0369A1', Icon: Flame },     // Lv 16
  { name: 'Nova Guardian',      colors: ['#FDBA74', '#EA580C'], shadow: '#9A3412', Icon: Trophy },    // Lv 17
  { name: 'Nebula Sage',        colors: ['#F0ABFC', '#C026D3'], shadow: '#701A75', Icon: Award },     // Lv 18
  { name: 'Celestial Ruler',    colors: ['#A7F3D0', '#059669'], shadow: '#064E3B', Icon: Target },    // Lv 19
  { name: 'Omniversal Deity',   colors: ['#FBCFE8', '#DB2777'], shadow: '#831843', Icon: Crown },     // Lv 20
];

const BadgeGraphic: React.FC<BadgeGraphicProps> = ({ level, size = 64 }) => {
  const tierIndex = Math.max(0, Math.min(level - 1, BADGE_TIERS.length - 1));
  const tier = BADGE_TIERS[tierIndex];
  const { colors, shadow, Icon } = tier;

  return (
    <div 
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ 
        width: size, 
        height: size,
        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
        borderRadius: '25%', // Squircle look
        boxShadow: `0 ${size * 0.15}px 0 ${shadow}, 0 ${size * 0.25}px ${size * 0.3}px rgba(0,0,0,0.3)`,
        border: `2px solid rgba(255,255,255,0.4)`
      }}
    >
      <div 
        className="absolute inset-0 rounded-[25%] opacity-50"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.2) 100%)'
        }}
      />
      <Icon 
        size={size * 0.5} 
        color="#FFFFFF" 
        strokeWidth={2.5}
        className="relative z-10 filter drop-shadow-md"
      />
      <div 
        className="absolute -bottom-2 -right-2 bg-white rounded-full flex items-center justify-center font-black font-heading z-20"
        style={{
          width: size * 0.35,
          height: size * 0.35,
          fontSize: size * 0.18,
          color: shadow,
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}
      >
        {level}
      </div>
    </div>
  );
};

export default BadgeGraphic;
