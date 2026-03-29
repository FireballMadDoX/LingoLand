// LingoLand Design Tokens — Claude UI Experiment

export const palette = {
  grape:      '#7C3AED',
  grapeLight: '#EDE9FE',
  coral:      '#F43F5E',
  coralLight: '#FFF1F2',
  sky:        '#0EA5E9',
  skyLight:   '#E0F2FE',
  lime:       '#16A34A',
  limeLight:  '#DCFCE7',
  gold:       '#F59E0B',
  goldLight:  '#FEF3C7',
  navy:       '#1E1B4B',
  dark:       '#0F0A1E',
  cream:      '#FFFBEB',
  white:      '#FFFFFF',
} as const;

export const gradients = {
  heroSky:     'linear-gradient(135deg, #1a0533 0%, #2d1065 50%, #1a0f5e 100%)',
  cardGrape:   'linear-gradient(135deg, #7C3AED, #A855F7)',
  cardCoral:   'linear-gradient(135deg, #F43F5E, #FB7185)',
  cardSky:     'linear-gradient(135deg, #0EA5E9, #38BDF8)',
  cardLime:    'linear-gradient(135deg, #16A34A, #22C55E)',
  cardGold:    'linear-gradient(135deg, #F59E0B, #FCD34D)',
  cardNeutral: 'linear-gradient(135deg, #E0E7FF, #F5F3FF)',
  dashboard:   'linear-gradient(160deg, #F5F3FF 0%, #FFF7ED 50%, #FDF4FF 100%)',
} as const;

export const shadows = {
  grape:  '0 8px 0 #5B21B6',
  coral:  '0 8px 0 #BE123C',
  sky:    '0 8px 0 #0284C7',
  lime:   '0 8px 0 #15803D',
  gold:   '0 8px 0 #B45309',
  ghost:  '0 6px 0 #D1D5DB',
  card:   '0 20px 60px rgba(124, 58, 237, 0.12)',
} as const;
