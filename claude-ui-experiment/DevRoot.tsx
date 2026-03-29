/**
 * ╔══════════════════════════════════════════════╗
 * ║   LingoLand — Claude UI Experiment           ║
 * ║   DevRoot.tsx — Preview Entry Point          ║
 * ╚══════════════════════════════════════════════╝
 *
 * HOW TO PREVIEW:
 *   1. Open  src/main.tsx
 *   2. Replace:
 *        import App from './App'
 *      with:
 *        import App from '../claude-ui-experiment/DevRoot'
 *   3. Run `npm run dev` and view in browser.
 *   4. Use the floating nav bar at the bottom to switch between screens.
 *
 * No real Supabase auth is used — all state is mock.
 * Restore src/main.tsx when done previewing.
 */

import React, { useState } from 'react';
import Hero           from './pages/Hero';
import Auth           from './pages/Auth';
import Dashboard      from './pages/Dashboard';
import LanguagePicker from './pages/LanguagePicker';
import LessonPlayer   from './pages/LessonPlayer';

type View     = 'hero' | 'auth' | 'dashboard' | 'languagePicker' | 'lesson';
type LangCode = 'en' | 'es' | 'zh';

// ── Floating dev navigation bar ──────────────────────────────────────────────

const DevNav: React.FC<{ view: View; onNav: (v: View) => void }> = ({ view, onNav }) => {
  const items: { label: string; icon: string; target: View }[] = [
    { label: 'Hero',     icon: '🏠', target: 'hero'           },
    { label: 'Auth',     icon: '🔑', target: 'auth'           },
    { label: 'Dashboard',icon: '🗺️', target: 'dashboard'      },
    { label: 'Language', icon: '🌍', target: 'languagePicker' },
    { label: 'Lesson',   icon: '📚', target: 'lesson'         },
  ];

  return (
    <nav
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-3 py-2 rounded-full"
      style={{
        background:     'rgba(30, 27, 75, 0.88)',
        backdropFilter: 'blur(16px)',
        boxShadow:      '0 8px 32px rgba(0,0,0,0.4)',
        border:         '1px solid rgba(167,139,250,0.3)',
      }}
    >
      {items.map((item) => (
        <button
          key={item.target}
          onClick={() => onNav(item.target)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full font-body font-bold text-xs transition-all"
          style={{
            background:  view === item.target ? 'rgba(167,139,250,0.3)' : 'transparent',
            color:       view === item.target ? '#C4B5FD' : 'rgba(196,181,253,0.45)',
            border:      view === item.target ? '1px solid rgba(167,139,250,0.4)' : '1px solid transparent',
          }}
        >
          <span>{item.icon}</span>
          <span className="hidden sm:inline">{item.label}</span>
        </button>
      ))}

      <div
        className="ml-2 px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider"
        style={{ background: 'rgba(244,63,94,0.2)', color: '#FB7185', border: '1px solid rgba(244,63,94,0.3)' }}
      >
        Experiment
      </div>
    </nav>
  );
};

// ── DevRoot ──────────────────────────────────────────────────────────────────

const DevRoot: React.FC = () => {
  const [view, setView] = useState<View>('hero');
  const [lang, setLang] = useState<LangCode>('en');

  const navigate = (v: View) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="font-body">
      {view === 'hero' && (
        <Hero
          onStart={() => navigate('auth')}
          onDashboard={() => navigate('dashboard')}
        />
      )}

      {view === 'auth' && (
        <Auth
          onBack={() => navigate('hero')}
          onSuccess={() => navigate('dashboard')}
        />
      )}

      {view === 'dashboard' && (
        <Dashboard
          onLessons={() => navigate('languagePicker')}
          onMinigames={() => navigate('languagePicker')}
        />
      )}

      {view === 'languagePicker' && (
        <LanguagePicker
          onSelect={(selected) => { setLang(selected); navigate('lesson'); }}
          onBack={() => navigate('dashboard')}
        />
      )}

      {view === 'lesson' && (
        <LessonPlayer
          language={lang}
          onExit={() => navigate('dashboard')}
        />
      )}

      <DevNav view={view} onNav={navigate} />
    </div>
  );
};

export default DevRoot;
