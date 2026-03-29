import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import KidButton from '../components/KidButton';

interface AuthProps {
  onBack: () => void;
  onSuccess: () => void;
}

const floatWords = ['Hola!', '你好!', 'Hello!', '¡Amigo!', '谢谢!', 'Friend!', '¡Gracias!', '学习!'];

export const Auth: React.FC<AuthProps> = ({ onBack, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');

  return (
    <div className="min-h-screen flex">

      {/* Left illustration panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1a0533 0%, #2d1065 50%, #1a0f5e 100%)' }}
      >
        {/* Stars */}
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}

        {/* Floating language bubbles */}
        {floatWords.map((w, i) => (
          <motion.div
            key={i}
            className="absolute font-heading font-bold text-white/80 text-lg pointer-events-none select-none"
            style={{
              left: `${8 + (i % 3) * 30}%`,
              top:  `${10 + Math.floor(i / 3) * 25}%`,
              background: 'rgba(167,139,250,0.15)',
              border: '2px solid rgba(167,139,250,0.3)',
              padding: '6px 14px',
              borderRadius: 999,
            }}
            animate={{ y: [0, -12, 0], rotate: [i % 2 === 0 ? -3 : 3, i % 2 === 0 ? 3 : -3, i % 2 === 0 ? -3 : 3] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          >
            {w}
          </motion.div>
        ))}

        {/* Mascot */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 text-center"
        >
          <div
            className="w-48 h-48 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #A78BFA, #7C3AED)',
              boxShadow: '0 0 60px rgba(124,58,237,0.5)',
            }}
          >
            <span className="text-8xl">🐢</span>
          </div>
          <h2 className="font-heading text-3xl font-bold text-white mb-2">Welcome to LingoLand!</h2>
          <p className="font-body text-purple-300 text-sm max-w-xs mx-auto">
            Your magical language adventure begins here. Learn Spanish, Mandarin, and English!
          </p>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: '#F5F3FF' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Back */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 font-body font-bold text-violet-500 hover:text-violet-700 mb-8 transition-colors"
          >
            ← Back to Home
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}
            >
              <span className="text-2xl">🐢</span>
            </div>
            <span className="font-heading font-bold text-3xl text-violet-900">LingoLand</span>
          </div>

          {/* Mode toggle */}
          <div className="flex bg-white rounded-2xl p-1.5 mb-8 shadow-sm border border-violet-100">
            {(['signup', 'login'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="flex-1 py-3 rounded-xl font-heading font-bold text-sm transition-all"
                style={
                  mode === m
                    ? { background: 'linear-gradient(135deg, #7C3AED, #A855F7)', color: 'white' }
                    : { color: '#9CA3AF' }
                }
              >
                {m === 'signup' ? '✨ Sign Up' : '🔑 Log In'}
              </button>
            ))}
          </div>

          <h1 className="font-heading font-bold text-3xl text-violet-900 mb-2">
            {mode === 'signup' ? 'Create Your Account' : 'Welcome Back!'}
          </h1>
          <p className="font-body text-gray-500 mb-8 text-sm">
            {mode === 'signup' ? 'Join thousands of young language explorers!' : 'Ready to continue your adventure?'}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              {mode === 'signup' && (
                <div>
                  <label className="font-heading font-bold text-sm text-violet-800 block mb-1.5">Your Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-violet-100 font-body focus:outline-none focus:border-violet-400 bg-white text-gray-800 placeholder-gray-300 transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="font-heading font-bold text-sm text-violet-800 block mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3.5 rounded-2xl border-2 border-violet-100 font-body focus:outline-none focus:border-violet-400 bg-white text-gray-800 placeholder-gray-300 transition-colors"
                />
              </div>

              <div>
                <label className="font-heading font-bold text-sm text-violet-800 block mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 rounded-2xl border-2 border-violet-100 font-body focus:outline-none focus:border-violet-400 bg-white text-gray-800 placeholder-gray-300 transition-colors"
                />
              </div>

              <div className="pt-2">
                <KidButton
                  variant="grape"
                  size="lg"
                  fullWidth
                  onClick={onSuccess}
                  icon={<span>{mode === 'signup' ? '🚀' : '✨'}</span>}
                >
                  {mode === 'signup' ? 'Start My Adventure!' : 'Continue Adventure!'}
                </KidButton>
              </div>

              {mode === 'signup' && (
                <p className="font-body text-center text-gray-400 text-xs mt-4">
                  By signing up you agree to our Terms. Your data is always safe and private.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
