import React from 'react';
import { motion } from 'framer-motion';
import KidButton from '../components/KidButton';

interface HeroProps {
  onStart: () => void;
  onDashboard: () => void;
}

const floatingWords = [
  { word: 'Hola!',    x: '8%',  y: '22%', delay: 0,   color: '#FB923C' },
  { word: '你好!',    x: '72%', y: '14%', delay: 0.5, color: '#34D399' },
  { word: 'Hello!',   x: '80%', y: '52%', delay: 1,   color: '#60A5FA' },
  { word: '¡Gracias!',x: '4%',  y: '64%', delay: 1.5, color: '#F472B6' },
  { word: '谢谢!',    x: '68%', y: '76%', delay: 0.8, color: '#A78BFA' },
  { word: 'Amigo!',   x: '18%', y: '80%', delay: 1.2, color: '#FCD34D' },
];

const stats = [
  { value: '10K+', label: 'Young Explorers', emoji: '🌟' },
  { value: '3',    label: 'Languages',        emoji: '🌍' },
  { value: '100+', label: 'Fun Lessons',      emoji: '🎮' },
];

const orbitalBadges = [
  { emoji: '🇪🇸', label: 'Spanish',  angle: 0   },
  { emoji: '🇨🇳', label: 'Mandarin', angle: 120 },
  { emoji: '🇺🇸', label: 'English',  angle: 240 },
];

export const Hero: React.FC<HeroProps> = ({ onStart, onDashboard }) => {
  return (
    <section
      className="min-h-screen relative overflow-hidden flex flex-col"
      style={{ background: 'linear-gradient(135deg, #1a0533 0%, #2d1065 50%, #1a0f5e 100%)' }}
    >
      {/* Star field */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width:  Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top:  `${Math.random() * 70}%`,
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 3 }}
        />
      ))}

      {/* Ambient glow orbs */}
      <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: '#7C3AED' }} />
      <div className="absolute top-40 right-[5%] w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"  style={{ background: '#F43F5E' }} />
      <div className="absolute bottom-20 left-[40%] w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: '#0EA5E9' }} />

      {/* Floating word bubbles */}
      {floatingWords.map((fw, i) => (
        <motion.div
          key={i}
          className="absolute px-4 py-2 rounded-full font-heading font-bold text-white text-sm select-none pointer-events-none"
          style={{
            left: fw.x, top: fw.y,
            background: `${fw.color}25`,
            border: `2px solid ${fw.color}60`,
            backdropFilter: 'blur(8px)',
          }}
          animate={{ y: [0, -16, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: fw.delay }}
        >
          {fw.word}
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center max-w-7xl mx-auto px-6 w-full py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">

          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 font-body font-bold text-sm"
              style={{ background: 'rgba(251,191,36,0.15)', border: '2px solid rgba(251,191,36,0.4)', color: '#FCD34D' }}
            >
              <span>✨</span> Magical Language Learning for Kids
            </motion.div>

            <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-6">
              Speak New{' '}
              <span
                style={{ WebkitTextStroke: '3px #F59E0B', color: 'transparent' }}
              >
                Languages
              </span>
              {' '}with{' '}
              <span style={{ background: 'linear-gradient(90deg, #FB923C, #F43F5E, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Magic!
              </span>
            </h1>

            <p className="font-body text-purple-200 text-xl leading-relaxed mb-10 max-w-lg">
              Join thousands of young explorers learning Spanish, Mandarin, and English through exciting adventures, games, and friendly characters!
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <KidButton variant="lime" size="xl" onClick={onStart} icon={<span>🚀</span>}>
                Start Adventure
              </KidButton>
              <KidButton variant="ghost" size="xl" onClick={onDashboard} icon={<span>🗺️</span>}>
                Explore Map
              </KidButton>
            </div>

            {/* Stats row */}
            <div className="flex gap-8 flex-wrap">
              {stats.map((st, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl mb-1">{st.emoji}</div>
                  <div className="font-heading font-bold text-2xl text-white">{st.value}</div>
                  <div className="font-body text-purple-300 text-xs">{st.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Orb + orbiting language badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative flex items-center justify-center min-h-[480px]"
          >
            {/* Rotating rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[420px] h-[420px] rounded-full border-2 border-dashed opacity-20"
              style={{ borderColor: '#A78BFA' }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[340px] h-[340px] rounded-full border-2 border-dashed opacity-15"
              style={{ borderColor: '#60A5FA' }}
            />

            {/* Central glowing orb */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-72 h-72 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #A78BFA, #7C3AED, #2d1065)',
                boxShadow: '0 0 80px rgba(124,58,237,0.6), 0 0 160px rgba(124,58,237,0.3)',
              }}
            >
              <span className="text-[120px] drop-shadow-lg select-none">🐢</span>
            </motion.div>

            {/* Orbital language badges */}
            {orbitalBadges.map((badge, i) => {
              const rad = (badge.angle * Math.PI) / 180;
              const r   = 195;
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{ left: '50%', top: '50%' }}
                >
                  <div
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl font-bold text-xs font-body"
                    style={{
                      position: 'absolute',
                      left: Math.cos(rad) * r - 30,
                      top:  Math.sin(rad) * r - 24,
                      background: 'rgba(255,255,255,0.1)',
                      border: '2px solid rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(8px)',
                      color: 'white',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span className="text-xl">{badge.emoji}</span>
                    {badge.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </div>

      {/* Wave transition to next section */}
      <div className="relative -mb-1">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 40 C360 80 1080 0 1440 40 L1440 80 L0 80 Z" fill="#F5F3FF" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
