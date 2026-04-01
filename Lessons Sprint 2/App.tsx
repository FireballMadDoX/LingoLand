import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LevelPreview from './components/LevelPreview';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Adventures from './components/Adventures';
import LessonPlayer from './components/LessonPlayer';
import LanguagePicker from './components/LanguagePicker';
import lesson01Raw from './lessons/lesson-01.json';
import lesson02Raw from './lessons/lesson-02.json';
import lesson03Raw from './lessons/lesson-03.json';
import lesson04Raw from './lessons/lesson-04.json';
import lesson05Raw from './lessons/lesson-05.json';
import lesson06Raw from './lessons/lesson-06.json';
import lesson07Raw from './lessons/lesson-07.json';
import lesson08Raw from './lessons/lesson-08.json';
import lesson09Raw from './lessons/lesson-09.json';
import lesson10Raw from './lessons/lesson-10.json';
import lesson11Raw from './lessons/lesson-11.json';
import lesson12Raw from './lessons/lesson-12.json';   
import lesson13Raw from './lessons/lesson-13.json';
import lesson14Raw from './lessons/lesson-14.json';
import lesson15Raw from './lessons/lesson-15.json';     
import lesson16Raw from './lessons/lesson-16.json';
import lesson17Raw from './lessons/lesson-17.json';
import lesson18Raw from './lessons/lesson-18.json';
import lesson19Raw from './lessons/lesson-19.json';     
import lesson20Raw from './lessons/lesson-20.json'; 

const lesson01 = lesson01Raw as any;
const lesson02 = lesson02Raw as any;
const lesson03 = lesson03Raw as any;
const lesson04 = lesson04Raw as any;
const lesson05 = lesson05Raw as any;    
const lesson06 = lesson06Raw as any;
const lesson07 = lesson07Raw as any;
const lesson08 = lesson08Raw as any;    
const lesson09 = lesson09Raw as any;
const lesson10 = lesson10Raw as any;
const lesson11 = lesson11Raw as any;
const lesson12 = lesson12Raw as any;
const lesson13 = lesson13Raw as any;
const lesson14 = lesson14Raw as any;
const lesson15 = lesson15Raw as any;
const lesson16 = lesson16Raw as any;
const lesson17 = lesson17Raw as any;
const lesson18 = lesson18Raw as any;
const lesson19 = lesson19Raw as any;
const lesson20 = lesson20Raw as any;      

type View =
  | 'landing'
  | 'dashboard'
  | 'auth'
  | 'profile'
  | 'adventures'
  | 'language'
  | 'lesson';

type LangCode = 'en' | 'es' | 'zh';
type LessonId =
  | 'lesson-01'
  | 'lesson-02'
  | 'lesson-03'
  | 'lesson-04'
  | 'lesson-05'
  | 'lesson-06'
  | 'lesson-07'
  | 'lesson-08'
  | 'lesson-09'
  | 'lesson-10'
  | 'lesson-11'
  | 'lesson-12'
  | 'lesson-13'
  | 'lesson-14'
  | 'lesson-15'
  | 'lesson-16'
  | 'lesson-17'
  | 'lesson-18'
  | 'lesson-19'
  | 'lesson-20';

function App() {
  const [view, setView] = useState<View>('landing');
  const [session, setSession] = useState<any>(null);
  const [lessonLanguage, setLessonLanguage] = useState<LangCode>('en');
  const [selectedLesson, setSelectedLesson] = useState<LessonId>('lesson-01');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);

      if (event === 'SIGNED_OUT') {
        setView('landing');
        setSession(null);
      } else if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        setSession(session);
        if (event === 'SIGNED_IN') {
          setView('profile');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleStart = () => {
    if (session) {
      setView('dashboard');
    } else {
      setView('auth');
    }
    window.scrollTo(0, 0);
  };

  const handleHome = () => {
    setView('landing');
    window.scrollTo(0, 0);
  };

  const handleProfile = () => {
    setView('profile');
    window.scrollTo(0, 0);
  };

  const handleAdventures = () => {
    setView('adventures');
    window.scrollTo(0, 0);
  };

  const handleChooseLanguage = (lessonId: LessonId) => {
    setSelectedLesson(lessonId);
    setView('language');
    window.scrollTo(0, 0);
  };

  const handleSelectLanguage = (lang: LangCode) => {
    setLessonLanguage(lang);
    setView('lesson');
    window.scrollTo(0, 0);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setView('landing');
    window.scrollTo(0, 0);
  };

const lessonMap: Record<LessonId, any> = {
  'lesson-01': lesson01,
  'lesson-02': lesson02,
  'lesson-03': lesson03,
  'lesson-04': lesson04,
  'lesson-05': lesson05,
  'lesson-06': lesson06,
  'lesson-07': lesson07,
  'lesson-08': lesson08,
  'lesson-09': lesson09,
  'lesson-10': lesson10,
  'lesson-11': lesson11,
  'lesson-12': lesson12,
  'lesson-13': lesson13,
  'lesson-14': lesson14,
  'lesson-15': lesson15,
  'lesson-16': lesson16,
  'lesson-17': lesson17,
  'lesson-18': lesson18,
  'lesson-19': lesson19,
  'lesson-20': lesson20,   
};

const lessonData = lessonMap[selectedLesson];

  return (
    <div className="appContainer">
      <Navbar
        onStart={handleStart}
        onHome={handleHome}
        onLogout={handleLogout}
        onProfile={handleProfile}
        onAdventures={handleAdventures}
        session={session}
      />

      <main>
        {view === 'landing' ? (
          <>
            <Hero
              onStart={handleStart}
              onAdventures={handleAdventures}
              session={session}
            />
            <LevelPreview />
            <Footer />
          </>
        ) : view === 'auth' ? (
          <div className="min-h-screen pt-32 flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
            <Auth />
          </div>
        ) : view === 'profile' ? (
          <Profile session={session} onLogout={handleLogout} />
        ) : view === 'adventures' ? (
          <Adventures onStartLesson={handleChooseLanguage} />
        ) : view === 'language' ? (
          <LanguagePicker onSelect={handleSelectLanguage} />
        ) : view === 'lesson' ? (
          <LessonPlayer
            language={lessonLanguage}
            onExit={handleAdventures}
            lessonData={lessonData}
          />
        ) : (
          <Dashboard />
        )}
      </main>
    </div>
  );
}

export default App;