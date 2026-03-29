import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

type LangCode = 'en' | 'es' | 'zh';

interface LessonListPageProps {
  language: LangCode;
  onSelectLesson: (lessonId: string) => void;
  onBack: () => void;
}

const LANG_META: Record<LangCode, { name: string; flag: string; gradient: string; color: string }> = {
  en: { name: 'English',  flag: '🇺🇸', gradient: 'linear-gradient(135deg, #1D4ED8, #0EA5E9)', color: '#1D4ED8' },
  es: { name: 'Spanish',  flag: '🇪🇸', gradient: 'linear-gradient(135deg, #DC2626, #F59E0B)', color: '#DC2626' },
  zh: { name: 'Mandarin', flag: '🇨🇳', gradient: 'linear-gradient(135deg, #991B1B, #F97316)', color: '#991B1B' },
};

// Lesson catalogue — only showing the actual lesson available
const LESSON_CATALOGUE = [
  {
    id: 'lesson-01',
    number: 1,
    title: 'Introductions',
    subtitle: 'Greetings & basic phrases',
    emoji: '👋',
    steps: 6,
  }
];

// Small SVG ring used for per-lesson progress
const ProgressRing = ({ percent, color, size = 48 }: { percent: number; color: string; size?: number }) => {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * percent) / 100;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute" style={{ transform: 'rotate(-90deg)', width: size, height: size }} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} stroke="#E5E7EB" strokeWidth="10" fill="transparent" />
        <circle
          cx="50" cy="50" r={r}
          stroke={color} strokeWidth="10" fill="transparent"
          strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <span className="relative font-heading font-bold text-xs" style={{ color }}>
        {percent}%
      </span>
    </div>
  );
};

const LessonListPage: React.FC<LessonListPageProps> = ({ language, onSelectLesson, onBack }) => {
  const { progressByLang, completedLessons } = useProgress();
  const meta = LANG_META[language];
  const overallPercent = Math.round(progressByLang[language] || 0);
  const completed = completedLessons[language] || [];

  return (
    <div
      className="min-h-screen px-6 pb-16 pt-6"
      style={{ background: 'linear-gradient(160deg, #1E1B4B 0%, #2D1B69 50%, #1E1B4B 100%)' }}
    >
      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: '#7C3AED' }} />
      <div className="fixed bottom-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: '#4F46E5' }} />

      <div className="relative z-10 max-w-3xl mx-auto">

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-purple-300 hover:text-white font-bold text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Adventures
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-5 mb-10"
        >
          {/* Language badge */}
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl flex-shrink-0 shadow-lg"
            style={{ background: meta.gradient }}
          >
            {meta.flag}
          </div>
          <div className="flex-1">
            <h1 className="font-heading font-black text-3xl text-white">{meta.name} Lessons</h1>
            <p className="font-body text-purple-300 mt-1 text-sm">
              {completed.length} of {LESSON_CATALOGUE.length} lessons completed
            </p>
          </div>
          {/* Overall ring */}
          <ProgressRing percent={overallPercent} color={meta.color === '#1D4ED8' ? '#60A5FA' : meta.color === '#DC2626' ? '#FCA5A5' : '#FCA5A5'} size={64} />
        </motion.div>

        {/* Lesson cards */}
        <div className="flex flex-col gap-4">
          {LESSON_CATALOGUE.map((lesson, index) => {
            const isDone = completed.includes(lesson.id);
            const isAvailable = true;
            const lessonPercent = isDone ? 100 : (index === 0 && overallPercent > 0 && overallPercent < 100) ? overallPercent : 0;

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.07, type: 'spring', stiffness: 200, damping: 22 }}
                whileHover={isAvailable ? { x: 4 } : {}}
                onClick={() => isAvailable && onSelectLesson(lesson.id)}
                className="relative overflow-hidden rounded-2xl p-5 flex items-center gap-5"
                style={{
                  background: isAvailable
                    ? isDone
                      ? 'rgba(16,185,129,0.12)'
                      : 'rgba(255,255,255,0.07)'
                    : 'rgba(255,255,255,0.03)',
                  border: isDone
                    ? '1px solid rgba(16,185,129,0.4)'
                    : isAvailable
                    ? '1px solid rgba(255,255,255,0.12)'
                    : '1px solid rgba(255,255,255,0.05)',
                  cursor: isAvailable ? 'pointer' : 'default',
                }}
              >
                {/* Lesson number badge */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow"
                  style={{
                    background: isDone ? 'rgba(16,185,129,0.2)' : meta.gradient,
                    border: isDone ? '1px solid rgba(16,185,129,0.5)' : 'none',
                  }}
                >
                  {isDone ? '✅' : lesson.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading font-bold text-white text-base">{lesson.title}</span>
                    {isDone && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold font-heading text-emerald-400" style={{ background: 'rgba(16,185,129,0.15)' }}>
                        Complete
                      </span>
                    )}
                  </div>
                  <p className="font-body text-purple-400 text-sm mt-0.5">{lesson.subtitle}</p>
                </div>

                {/* Progress ring */}
                <ProgressRing
                  percent={lessonPercent}
                  color={isDone ? '#10B981' : '#A78BFA'}
                  size={52}
                />

                {/* Arrow */}
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: index * 0.3 }}
                  className="text-purple-400 font-bold text-lg ml-1"
                >
                  →
                </motion.span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LessonListPage;
