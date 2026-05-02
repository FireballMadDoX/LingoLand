import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type LangCode = 'en' | 'es' | 'zh';

interface UserStats {
  stars: number;
  coins: number;
  streak: number;
  lastActiveDate: string | null;
  weeklyActivityCount: number;
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
  coins: number;
  level: number;
  streak: number;
  weeklyGoalPercent: number;
  addStars: (amount: number) => void;
  addCoins: (amount: number) => void;
  incrementActivity: () => void;
  resetAllProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const DEFAULT_PROGRESS: Record<LangCode, Record<string, number>> = { en: {}, es: {}, zh: {} };
const DEFAULT_COMPLETED: Record<LangCode, string[]> = { en: [], es: [], zh: [] };
const WEEKLY_GOAL_TARGET = 5; // 5 activities per week

// Level 1 -> 20 Star Requirements
const LEVEL_THRESHOLDS = [
  0, 100, 250, 400, 550, 700, 850, 1000, 1150, 1300, 
  1450, 1600, 1750, 1900, 2050, 2200, 2400, 2600, 2800, 3000
];

function calculateLevel(stars: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (stars >= LEVEL_THRESHOLDS[i]) {
      return i + 1; // 1-indexed levels
    }
  }
  return 1;
}

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progressByLang, setProgressByLang] = useState<Record<LangCode, Record<string, number>>>(DEFAULT_PROGRESS);
  const [completedLessons, setCompletedLessons] = useState<Record<LangCode, string[]>>(DEFAULT_COMPLETED);
  const [stats, setStats] = useState<UserStats>({
    stars: 0,
    coins: 0,
    streak: 0,
    lastActiveDate: null,
    weeklyActivityCount: 0,
  });

  const [userId, setUserId] = useState<string | null>(null);

  // Sync auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Helpers for user-tied local storage
  const getStorageKey = (base: string) => userId ? `${base}_${userId}` : base;

  // Cloud Sync Helper (Best Effort)
  const syncToCloud = async (newData: any) => {
    if (!userId) return;
    try {
      // Attempt to save to cloud if user_progress table allows it
      await supabase.from('user_progress').upsert({
        user_id: userId,
        stars: newData.stats?.stars,
        streak: newData.stats?.streak,
        level: calculateLevel(newData.stats?.stars || 0),
        progress_data: newData
      }, { onConflict: 'user_id' });
    } catch (e) {
      // Silently fail if table structure isn't ready, local storage still works
    }
  };

  // Load data when user changes
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(getStorageKey('lingoProgress'));
      if (savedProgress) setProgressByLang(JSON.parse(savedProgress));
      else setProgressByLang(DEFAULT_PROGRESS);

      const savedLessons = localStorage.getItem(getStorageKey('lingoCompletedLessons'));
      if (savedLessons) setCompletedLessons(JSON.parse(savedLessons));
      else setCompletedLessons(DEFAULT_COMPLETED);

      const savedStats = localStorage.getItem(getStorageKey('lingoUserStats'));
      if (savedStats) setStats(JSON.parse(savedStats));
      else setStats({ stars: 0, coins: 0, streak: 0, lastActiveDate: null, weeklyActivityCount: 0 });
    } catch (e) {
      console.error('Failed to load user data', e);
    }
  }, [userId]);

  // Full data reset triggered by specific env var or manual call
  // For the "Fresh Start" requested: 
  const resetAllProgress = () => {
    localStorage.removeItem(getStorageKey('lingoProgress'));
    localStorage.removeItem(getStorageKey('lingoCompletedLessons'));
    localStorage.removeItem(getStorageKey('lingoUserStats'));
    setProgressByLang(DEFAULT_PROGRESS);
    setCompletedLessons(DEFAULT_COMPLETED);
    setStats({
      stars: 0,
      coins: 0,
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
          localStorage.setItem(getStorageKey('lingoUserStats'), JSON.stringify(next));
          syncToCloud({ stats: next, progressByLang, completedLessons });
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
      try { 
        localStorage.setItem(getStorageKey('lingoProgress'), JSON.stringify(next));
        syncToCloud({ stats, progressByLang: next, completedLessons });
      } catch {}
      return next;
    });
  };

  const markLessonComplete = (lang: LangCode, lessonId: string) => {
    const alreadyComplete = (completedLessons[lang] || []).includes(lessonId);
    
    setCompletedLessons((prev) => {
      const existing = prev[lang] || [];
      if (existing.includes(lessonId)) return prev;
      const next = { ...prev, [lang]: [...existing, lessonId] };
      try { 
        localStorage.setItem(getStorageKey('lingoCompletedLessons'), JSON.stringify(next));
        syncToCloud({ stats, progressByLang, completedLessons: next });
      } catch {}
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
      try { 
        localStorage.setItem(getStorageKey('lingoUserStats'), JSON.stringify(next));
        syncToCloud({ stats: next, progressByLang, completedLessons });
      } catch {}
      return next;
    });
  };

  const addCoins = (amount: number) => {
    setStats(prev => {
      const next = { ...prev, coins: (prev.coins || 0) + amount };
      try { 
        localStorage.setItem(getStorageKey('lingoUserStats'), JSON.stringify(next));
        syncToCloud({ stats: next, progressByLang, completedLessons });
      } catch {}
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
        try { 
          localStorage.setItem(getStorageKey('lingoUserStats'), JSON.stringify(next));
          syncToCloud({ stats: next, progressByLang, completedLessons });
        } catch {}
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
      try { 
        localStorage.setItem(getStorageKey('lingoUserStats'), JSON.stringify(next));
        syncToCloud({ stats: next, progressByLang, completedLessons });
      } catch {}
      return next;
    });
  };

  const level = calculateLevel(stats.stars);
  const weeklyGoalPercent = Math.min(100, Math.round((stats.weeklyActivityCount / WEEKLY_GOAL_TARGET) * 100));

  return (
    <ProgressContext.Provider value={{
      progressByLang,
      completedLessons,
      updateProgress,
      markLessonComplete,
      getLessonProgress,
      stars: stats.stars,
      coins: stats.coins || 0,
      level,
      streak: stats.streak,
      weeklyGoalPercent,
      addStars,
      addCoins,
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
