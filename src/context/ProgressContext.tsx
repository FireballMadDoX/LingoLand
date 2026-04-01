import React, { createContext, useContext, useState, useEffect } from 'react';

type LangCode = 'en' | 'es' | 'zh';

interface UserStats {
  stars: number;
  streak: number;
  lastActiveDate: string | null;
  weeklyActivityCount: number; // number of lessons/games done this week
}

interface ProgressContextType {
  // Lesson progress
  progressByLang: Record<LangCode, Record<string, number>>;
  completedLessons: Record<LangCode, string[]>;
  updateProgress: (lang: LangCode, lessonId: string, percent: number) => void;
  markLessonComplete: (lang: LangCode, lessonId: string) => void;
  getLessonProgress: (lang: LangCode, lessonId: string) => number;

  // Scoring system
  stars: number;
  level: number;
  streak: number;
  weeklyGoalPercent: number;
  addStars: (amount: number) => void;
  incrementActivity: () => void;
  resetAllProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const DEFAULT_PROGRESS: Record<LangCode, Record<string, number>> = { en: {}, es: {}, zh: {} };
const DEFAULT_COMPLETED: Record<LangCode, string[]> = { en: [], es: [], zh: [] };
const WEEKLY_GOAL_TARGET = 5; // 5 activities per week

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progressByLang, setProgressByLang] = useState<Record<LangCode, Record<string, number>>>(DEFAULT_PROGRESS);
  const [completedLessons, setCompletedLessons] = useState<Record<LangCode, string[]>>(DEFAULT_COMPLETED);
  const [stats, setStats] = useState<UserStats>({
    stars: 0,
    streak: 0,
    lastActiveDate: null,
    weeklyActivityCount: 0,
  });

  // Load data on mount
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('lingoProgress');
      if (savedProgress) setProgressByLang(JSON.parse(savedProgress));

      const savedLessons = localStorage.getItem('lingoCompletedLessons');
      if (savedLessons) setCompletedLessons(JSON.parse(savedLessons));

      const savedStats = localStorage.getItem('lingoUserStats');
      if (savedStats) setStats(JSON.parse(savedStats));
    } catch (e) {
      console.error('Failed to load user data', e);
    }
  }, []);

  // Full data reset triggered by specific env var or manual call
  // For the "Fresh Start" requested: 
  const resetAllProgress = () => {
    localStorage.removeItem('lingoProgress');
    localStorage.removeItem('lingoCompletedLessons');
    localStorage.removeItem('lingoUserStats');
    setProgressByLang(DEFAULT_PROGRESS);
    setCompletedLessons(DEFAULT_COMPLETED);
    setStats({
      stars: 0,
      streak: 0,
      lastActiveDate: null,
      weeklyActivityCount: 0,
    });
  };

  // Background Streak Checker: Reset streak if user hasn't active for more than 1 day
  useEffect(() => {
    if (!stats.lastActiveDate) return;
    
    const todayStr = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (stats.lastActiveDate !== todayStr && stats.lastActiveDate !== yesterdayStr) {
      if (stats.streak > 0) {
        setStats(prev => {
          const next = { ...prev, streak: 0 };
          localStorage.setItem('lingoUserStats', JSON.stringify(next));
          return next;
        });
      }
    }
  }, [stats.lastActiveDate, stats.streak]);

  const updateProgress = (lang: LangCode, lessonId: string, percent: number) => {
    setProgressByLang((prev) => {
      const currentLang = prev[lang] || {};
      const nextLang = { ...currentLang, [lessonId]: Math.max(currentLang[lessonId] || 0, percent) };
      const next = { ...prev, [lang]: nextLang };
      try { localStorage.setItem('lingoProgress', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const markLessonComplete = (lang: LangCode, lessonId: string) => {
    const alreadyComplete = (completedLessons[lang] || []).includes(lessonId);
    
    setCompletedLessons((prev) => {
      const existing = prev[lang] || [];
      if (existing.includes(lessonId)) return prev;
      const next = { ...prev, [lang]: [...existing, lessonId] };
      try { localStorage.setItem('lingoCompletedLessons', JSON.stringify(next)); } catch {}
      return next;
    });

    // Ensure it shows as 100% in progress
    updateProgress(lang, lessonId, 100);

    if (!alreadyComplete) {
      addStars(10);
      incrementActivity();
    }
  };

  const getLessonProgress = (lang: LangCode, lessonId: string): number => {
    if ((completedLessons[lang] || []).includes(lessonId)) return 100;
    return (progressByLang[lang] || {})[lessonId] || 0;
  };

  const addStars = (amount: number) => {
    setStats(prev => {
      const next = { ...prev, stars: prev.stars + amount };
      try { localStorage.setItem('lingoUserStats', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const incrementActivity = () => {
    const todayStr = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    setStats(prev => {
      if (prev.lastActiveDate === todayStr) {
        const next = { ...prev, weeklyActivityCount: prev.weeklyActivityCount + 1 };
        try { localStorage.setItem('lingoUserStats', JSON.stringify(next)); } catch {}
        return next;
      }

      let newStreak = prev.streak;
      if (prev.lastActiveDate === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }

      const next = {
        ...prev,
        streak: newStreak,
        lastActiveDate: todayStr,
        weeklyActivityCount: prev.weeklyActivityCount + 1,
      };
      try { localStorage.setItem('lingoUserStats', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const level = Math.floor(stats.stars / 100) + 1;
  const weeklyGoalPercent = Math.min(100, Math.round((stats.weeklyActivityCount / WEEKLY_GOAL_TARGET) * 100));

  return (
    <ProgressContext.Provider value={{
      progressByLang,
      completedLessons,
      updateProgress,
      markLessonComplete,
      getLessonProgress,
      stars: stats.stars,
      level,
      streak: stats.streak,
      weeklyGoalPercent,
      addStars,
      incrementActivity,
      resetAllProgress,
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) throw new Error('useProgress must be used within a ProgressProvider');
  return context;
};
