/**
 * LessonPlayer — Claude UI Experiment
 * UI shell only — all interactivity is mock/demo state.
 * No real speech recognition or backend logic here.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import KidButton from '../components/KidButton';

interface LessonPlayerProps {
  language: 'en' | 'es' | 'zh';
  onExit: () => void;
}

type LangCode = 'en' | 'es' | 'zh';

const langMeta: Record<LangCode, { name: string; flag: string; gradient: string; color: string }> = {
  en: { name: 'English',  flag: '🇺🇸', gradient: 'linear-gradient(135deg, #1D4ED8, #0EA5E9)', color: '#0EA5E9' },
  es: { name: 'Spanish',  flag: '🇪🇸', gradient: 'linear-gradient(135deg, #DC2626, #F59E0B)', color: '#F97316' },
  zh: { name: 'Mandarin', flag: '🇨🇳', gradient: 'linear-gradient(135deg, #991B1B, #F97316)', color: '#F43F5E' },
};

const mockSteps = [
  { id: 'listen',       label: 'Listen & Learn',   emoji: '👂', color: '#7C3AED', desc: 'Tap each card to hear the word!' },
  { id: 'vocab',        label: 'Match the Sounds',  emoji: '🔗', color: '#0EA5E9', desc: 'Match what you hear to the right word.' },
  { id: 'pronounce',    label: 'Say It!',            emoji: '🎤', color: '#F43F5E', desc: 'Use your voice to say each phrase.' },
  { id: 'build',        label: 'Build Sentences',    emoji: '🧩', color: '#F59E0B', desc: 'Arrange tiles to form the sentence.' },
  { id: 'conversation', label: 'Real Conversation',  emoji: '💬', color: '#10B981', desc: 'Have a chat with LingoBot!' },
  { id: 'fillblank',    label: 'Fill the Blanks',    emoji: '🎯', color: '#8B5CF6', desc: 'Match words to the correct sentence.' },
  { id: 'assessment',   label: 'Final Challenge',    emoji: '🏆', color: '#F97316', desc: "Show what you've learned!" },
];

const mascotMessages: Record<string, string> = {
  listen:       "Listen carefully! Tap each card to hear the word. 🎵",
  vocab:        "Now match what you hear to the right word! You got this! 💪",
  pronounce:    "Your turn to speak! Don't be shy — just try! 🎤",
  build:        "Rearrange the tiles to build the sentence. Think like a puzzle! 🧩",
  conversation: "Pretend you're talking to a new friend! 😊",
  fillblank:    "Almost there! Match the words to fill in the blanks. 🎯",
  assessment:   "This is your moment to shine! Show me what you learned! 🌟",
};

const listenCards = [
  { text: 'Hello!',            subtext: 'A friendly greeting' },
  { text: 'My name is...',     subtext: 'How to introduce yourself' },
  { text: "What's your name?", subtext: "Asking someone's name" },
  { text: 'Nice to meet you!', subtext: 'A polite response' },
];

export const LessonPlayer: React.FC<LessonPlayerProps> = ({ language, onExit }) => {
  const [stepIndex, setStepIndex]     = useState(0);
  const [heardCards, setHeardCards]   = useState<Set<number>>(new Set([1]));
  const [xp, setXp]                   = useState(120);
  const [showComplete, setShowComplete] = useState(false);

  const lang     = langMeta[language];
  const step     = mockSteps[stepIndex];
  const isFirst  = stepIndex === 0;
  const isLast   = stepIndex === mockSteps.length - 1;
  const progress = ((stepIndex + 1) / mockSteps.length) * 100;

  const handleNext = () => {
    if (isLast) { setShowComplete(true); return; }
    setXp(x => x + 30);
    setStepIndex(i => i + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (!isFirst) setStepIndex(i => i - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleCard = (idx: number) => {
    setHeardCards(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  // ── Completion screen ───────────────────────────────────────────────────────
  if (showComplete) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0533 0%, #2d1065 50%, #1a0f5e 100%)' }}
      >
        {/* Confetti particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width:  8 + Math.random() * 8,
              height: 8 + Math.random() * 8,
              left:  `${Math.random() * 100}%`,
              top:   `${Math.random() * 100}%`,
              background: ['#FCD34D', '#F43F5E', '#34D399', '#60A5FA', '#A78BFA'][Math.floor(Math.random() * 5)],
            }}
            animate={{ y: [0, -300], opacity: [1, 0], rotate: [0, 360] }}
            transition={{ duration: 2 + Math.random() * 2, delay: Math.random(), ease: 'easeOut' }}
          />
        ))}

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="bg-white rounded-[3rem] p-12 text-center max-w-md w-full relative z-10"
          style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.3)' }}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            className="text-8xl mb-6"
          >
            🏆
          </motion.div>
          <h1 className="font-heading font-bold text-4xl text-violet-900 mb-3">Lesson Complete!</h1>
          <p className="font-body text-gray-500 mb-6">
            You earned <span className="text-amber-500 font-bold">{xp} XP</span> and finished Lesson 1 in {lang.name}!
          </p>

          <div className="bg-violet-50 rounded-2xl p-4 mb-8 flex items-center justify-around">
            {[
              { v: '7',    l: 'Steps Done', e: '✅' },
              { v: `${xp}`, l: 'XP Earned', e: '⭐' },
              { v: 'A+',  l: 'Grade',       e: '🎯' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-xl">{s.e}</div>
                <div className="font-heading font-bold text-violet-900 text-xl">{s.v}</div>
                <div className="font-body text-gray-500 text-xs">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <KidButton variant="ghost" size="md" onClick={() => { setShowComplete(false); setStepIndex(0); }} fullWidth>
              Review
            </KidButton>
            <KidButton variant="grape" size="md" onClick={onExit} icon={<span>🗺️</span>} fullWidth>
              Back to Map
            </KidButton>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Main lesson shell ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #F5F3FF 0%, #FFF7ED 80%, #FDF4FF 100%)' }}>

      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-violet-100/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={onExit}
            className="font-heading font-bold text-gray-400 hover:text-violet-600 transition-colors flex-shrink-0 text-lg"
            title="Exit lesson"
          >
            ✕
          </button>

          {/* Progress bar */}
          <div className="flex-1 relative h-4 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${lang.color}, ${lang.color}BB)` }}
            />
          </div>

          {/* XP counter */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3 }}
            key={xp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-heading font-bold text-sm flex-shrink-0"
            style={{ background: '#FEF3C7', color: '#B45309', border: '2px solid #FCD34D' }}
          >
            ⭐ {xp} XP
          </motion.div>

          {/* Language badge */}
          <div
            className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full font-heading font-bold text-sm text-white flex-shrink-0"
            style={{ background: lang.gradient }}
          >
            {lang.flag} {lang.name}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-12 gap-8">

          {/* Sidebar step list */}
          <div className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-28">
              <div className="bg-white rounded-3xl p-5" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
                <h3 className="font-heading font-bold text-gray-800 mb-4 text-xs uppercase tracking-widest">Lesson Steps</h3>
                <div className="space-y-1">
                  {mockSteps.map((s, i) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-3 p-3 rounded-2xl transition-colors"
                      style={{
                        background: i === stepIndex ? `${s.color}15` : i < stepIndex ? '#F0FDF4' : 'transparent',
                        border: i === stepIndex ? `2px solid ${s.color}40` : '2px solid transparent',
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                        style={{
                          background: i < stepIndex ? '#10B981' : i === stepIndex ? s.color : '#E5E7EB',
                          color: i <= stepIndex ? 'white' : '#9CA3AF',
                        }}
                      >
                        {i < stepIndex ? '✓' : s.emoji}
                      </div>
                      <span
                        className="font-body font-bold text-xs leading-tight"
                        style={{ color: i === stepIndex ? s.color : i < stepIndex ? '#10B981' : '#9CA3AF' }}
                      >
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={stepIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
              >
                {/* Step header card */}
                <div
                  className="relative overflow-hidden rounded-[2rem] p-8 mb-6 text-white"
                  style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}99)` }}
                >
                  <div className="absolute right-0 top-0 text-[200px] opacity-10 select-none -mr-8 -mt-8 leading-none pointer-events-none">
                    {step.emoji}
                  </div>
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <div className="font-body text-white/70 text-sm mb-1 uppercase tracking-wider">
                        Step {stepIndex + 1} of {mockSteps.length}
                      </div>
                      <h2 className="font-heading font-bold text-4xl mb-2">{step.label}</h2>
                      <p className="font-body text-white/80">{step.desc}</p>
                    </div>
                    <div className="text-5xl ml-4 flex-shrink-0">{step.emoji}</div>
                  </div>
                  <div className="absolute top-0 left-0 right-0 h-1/3 bg-white/5 rounded-t-[2rem]" />
                </div>

                {/* Mascot coach tip */}
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: 'radial-gradient(circle at 35% 35%, #A78BFA, #7C3AED)' }}
                  >
                    🐢
                  </div>
                  <div
                    className="relative flex-1 px-5 py-3 rounded-2xl rounded-tl-sm font-body text-violet-800 text-sm"
                    style={{ background: 'white', boxShadow: '0 4px 20px rgba(124,58,237,0.1)', border: '2px solid rgba(167,139,250,0.2)' }}
                  >
                    {mascotMessages[step.id] ?? "You're doing amazing! Keep going! 🌟"}
                    <div
                      className="absolute -left-2 top-4 w-3 h-3 rotate-45 bg-white"
                      style={{ border: '2px solid rgba(167,139,250,0.2)', borderRight: 'none', borderBottom: 'none' }}
                    />
                  </div>
                </div>

                {/* Content card */}
                <div className="bg-white rounded-3xl p-6 mb-6" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>

                  {/* Listen step */}
                  {step.id === 'listen' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {listenCards.map((card, i) => {
                        const isHeard = heardCards.has(i);
                        return (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleCard(i)}
                            className="text-left p-5 rounded-2xl border-2 transition-all"
                            style={{
                              background:   isHeard ? '#F0FDF4' : '#FAFAFA',
                              borderColor:  isHeard ? '#86EFAC' : '#E5E7EB',
                            }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-heading font-bold text-2xl text-gray-800">{card.text}</span>
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                                style={{ background: isHeard ? '#DCFCE7' : '#F3F4F6' }}
                              >
                                {isHeard ? '✅' : '🔊'}
                              </div>
                            </div>
                            <p className="font-body text-gray-500 text-xs">{card.subtext}</p>
                            <div
                              className="mt-3 font-body font-bold text-xs uppercase tracking-wider"
                              style={{ color: isHeard ? '#16A34A' : '#7C3AED' }}
                            >
                              {isHeard ? 'Heard ✓' : 'Tap to listen'}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}

                  {/* Pronounce step */}
                  {step.id === 'pronounce' && (
                    <div className="space-y-4">
                      {[
                        { text: 'Hello!',              done: true  },
                        { text: "What's your name?",   done: false },
                        { text: 'Nice to meet you!',   done: false },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ x: 4 }}
                          className="flex items-center justify-between p-5 rounded-2xl border-2"
                          style={{
                            background:  item.done ? '#F0FDF4' : '#FAFAFA',
                            borderColor: item.done ? '#86EFAC' : '#E5E7EB',
                          }}
                        >
                          <div>
                            <div className="font-heading font-bold text-xl text-gray-800">{item.text}</div>
                            <div className="font-body text-xs mt-1" style={{ color: item.done ? '#16A34A' : '#9CA3AF' }}>
                              {item.done ? 'Great job! ✓' : 'Your turn to say it →'}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg hover:bg-gray-200 transition-colors">🔊</button>
                            {!item.done && (
                              <button
                                className="px-4 py-2 rounded-xl font-heading font-bold text-sm text-white flex items-center gap-1"
                                style={{ background: '#F43F5E' }}
                              >
                                🎤 Say
                              </button>
                            )}
                            {item.done && (
                              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-lg">✅</div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Build step */}
                  {step.id === 'build' && (
                    <div className="space-y-4">
                      <div className="font-body text-gray-500 text-sm mb-4">Tap the tiles in order to build the sentence you hear!</div>
                      <div className="min-h-16 bg-violet-50 rounded-2xl p-4 border-2 border-dashed border-violet-200 flex items-center gap-2 flex-wrap">
                        {['My', 'name', 'is'].map((w, i) => (
                          <span key={i} className="font-heading font-bold text-violet-400">{w}</span>
                        ))}
                        <span className="px-3 py-1 rounded-xl font-heading font-bold text-white text-sm" style={{ background: '#7C3AED' }}>Alex</span>
                        <span className="font-heading font-bold text-gray-400">.</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['My', 'name', 'is', 'Alex', '.', 'Hello', 'What', 'your'].map((tile, i) => (
                          <motion.button
                            key={i}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 rounded-xl font-heading font-bold text-sm bg-white border-2 border-gray-200 text-gray-700 hover:border-violet-300 transition-colors"
                          >
                            {tile}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Generic placeholder for other steps */}
                  {!['listen', 'pronounce', 'build'].includes(step.id) && (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">{step.emoji}</div>
                      <h3 className="font-heading font-bold text-2xl text-gray-700 mb-2">{step.label}</h3>
                      <p className="font-body text-gray-400 mb-6">Interactive content for this step.</p>
                      <div
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-body font-bold text-sm"
                        style={{ background: `${step.color}15`, color: step.color, border: `2px solid ${step.color}30` }}
                      >
                        {step.desc}
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <KidButton variant="ghost" size="lg" onClick={handlePrev} disabled={isFirst} icon={<span>←</span>}>
                    Previous
                  </KidButton>

                  {/* Dot indicators */}
                  <div className="flex gap-1.5 items-center">
                    {mockSteps.map((_, i) => (
                      <div
                        key={i}
                        className="h-2 rounded-full transition-all"
                        style={{
                          width:      i === stepIndex ? 24 : 8,
                          background: i === stepIndex ? step.color : i < stepIndex ? '#10B981' : '#E5E7EB',
                        }}
                      />
                    ))}
                  </div>

                  <KidButton
                    variant={isLast ? 'coral' : 'grape'}
                    size="lg"
                    onClick={handleNext}
                    icon={<span>{isLast ? '🏆' : '→'}</span>}
                  >
                    {isLast ? 'Complete!' : 'Next Step'}
                  </KidButton>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlayer;
