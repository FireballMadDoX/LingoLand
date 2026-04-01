import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import KidButton from '../common/KidButton';
import { useProgress } from '../../context/ProgressContext';
import { LESSON_CATALOGUE } from '../lessons/lessonRegistry';

interface AdventuresProps {
  onSelectLanguage: (lang: 'en' | 'es' | 'zh') => void;
  onBack: () => void;
}

const languages = [
  {
    code: 'en' as const,
    name: 'English',
    flag: '🇺🇸',
    emoji: '🗽',
    sampleWords: ['Hello!', 'Friend', 'Adventure'],
    description: 'The most widely spoken language in the world!',
    gradient: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #0EA5E9 100%)',
    shadowColor: '#1E3A8A',
  },
  {
    code: 'es' as const,
    name: 'Spanish',
    flag: '🇪🇸',
    emoji: '💃',
    sampleWords: ['¡Hola!', 'Amigo', '¡Gracias!'],
    description: 'Spoken by 500 million people across the globe!',
    gradient: 'linear-gradient(135deg, #DC2626 0%, #EA580C 50%, #F59E0B 100%)',
    shadowColor: '#B91C1C',
  },
  {
    code: 'zh' as const,
    name: 'Mandarin',
    flag: '🇨🇳',
    emoji: '🐉',
    sampleWords: ['你好!', '谢谢', '朋友'],
    description: 'The most spoken language on Earth — how cool!',
    gradient: 'linear-gradient(135deg, #991B1B 0%, #DC2626 50%, #F97316 100%)',
    shadowColor: '#7F1D1D',
  },
];

export const Adventures: React.FC<AdventuresProps> = ({ onSelectLanguage, onBack }) => {
  const [hovered, setHovered]   = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const { completedLessons } = useProgress();

  const handleSelect = (code: 'en' | 'es' | 'zh') => {
    setSelected(code);
    setTimeout(() => onSelectLanguage(code), 350);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #F5F3FF 0%, #FFF7ED 50%, #FDF4FF 100%)' }}
    >
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none" style={{ background: '#DDD6FE' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: '#FDE68A' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 relative"
        >




          <h1 className="font-heading font-bold text-5xl md:text-6xl text-violet-900 mb-4">
            Which Language Will You{' '}
            <span style={{ background: 'linear-gradient(90deg, #7C3AED, #F43F5E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Explore?
            </span>
          </h1>
          <p className="font-body text-violet-600 text-lg max-w-lg mx-auto">
            Each language unlocks a brand new world of adventures. Pick one to start!
          </p>
        </motion.div>

        {/* Language cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {languages.map((lang, i) => {
            const isHovered  = hovered === lang.code;
            const isSelected = selected === lang.code;

            return (
              <motion.button
                key={lang.code}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, type: 'spring', stiffness: 200 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onHoverStart={() => setHovered(lang.code)}
                onHoverEnd={() => setHovered(null)}
                onClick={() => handleSelect(lang.code)}
                className="relative overflow-hidden rounded-[2rem] text-left focus:outline-none"
                style={{
                  boxShadow: isHovered
                    ? `0 24px 60px ${lang.shadowColor}40`
                    : '0 8px 32px rgba(0,0,0,0.08)',
                }}
              >
                {/* Colored top section */}
                <div
                  className="relative p-8 pb-20"
                  style={{ background: lang.gradient, minHeight: 280 }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-6xl">{lang.flag}</span>
                    <motion.span
                      className="text-5xl"
                      animate={isHovered ? { rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      {lang.emoji}
                    </motion.span>
                  </div>

                  <h2 className="font-heading font-bold text-4xl text-white mb-2">{lang.name}</h2>
                  <p className="font-body text-white/80 text-sm">{lang.description}</p>

                  {/* Sample word bubbles */}
                  <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                    {lang.sampleWords.map((word, j) => (
                      <motion.span
                        key={j}
                        animate={{ opacity: isHovered ? 1 : 0.6 }}
                        className="px-3 py-1 rounded-full font-heading font-bold text-sm"
                        style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </div>

                  {/* Top highlight */}
                  <div className="absolute top-0 left-0 right-0 h-1/3 bg-white/5 rounded-t-[2rem]" />
                </div>

                {/* White bottom section */}
                <div className="bg-white p-6 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-heading font-bold text-gray-800 text-lg">
                      {completedLessons[lang.code]?.length > 0 ? "Continue Learning" : "Start Learning"}
                    </div>
                    <div className="font-body text-gray-500 text-sm">{LESSON_CATALOGUE.length} Lessons Available</div>
                  </div>
                  
                  {/* Progress Ring logic inside card header */}
                  {(() => {
                    const { getLessonProgress } = useProgress();
                    const totalSum = LESSON_CATALOGUE.reduce((acc, lesson) => {
                      return acc + getLessonProgress(lang.code, lesson.id);
                    }, 0);
                    const percentage = Math.round(totalSum / LESSON_CATALOGUE.length);
                    
                    if (percentage === 0) return null;

                    return (
                      <div className="flex items-center gap-3 mr-3">
                        <div className="relative w-12 h-12 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" className="text-gray-100" strokeWidth="8" stroke="currentColor" fill="transparent" />
                            <circle
                              cx="50" cy="50" r="40"
                              strokeWidth="8"
                              stroke={lang.shadowColor}
                              strokeLinecap="round"
                              fill="transparent"
                              strokeDasharray="251.2 251.2"
                              strokeDashoffset={251.2 - (251.2 * percentage) / 100}
                              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold font-heading" style={{ color: lang.shadowColor }}>
                            {percentage}%
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <motion.div
                    animate={{ x: isHovered ? 5 : 0 }}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white text-lg flex-shrink-0"
                    style={{ background: lang.gradient }}
                  >
                    →
                  </motion.div>
                </div>

                {/* Selected overlay */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center rounded-[2rem]"
                      style={{ background: 'rgba(124,58,237,0.88)' }}
                    >
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="text-7xl"
                      >
                        ✅
                      </motion.span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* Bottom back link */}
        <div className="text-center mt-10">
          <KidButton variant="ghost" size="md" onClick={onBack}>
            Go Back
          </KidButton>
        </div>
      </div>
    </div>
  );
};

export default Adventures;
