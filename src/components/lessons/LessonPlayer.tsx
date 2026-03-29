import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, CheckCircle2, Mic, Square } from "lucide-react";
import lessonData from "./lesson_json/lesson-01.json";
import { speak } from "../../lib/tts";
import KidButton from '../common/KidButton';
import { useProgress } from '../../context/ProgressContext';

type LangCode = "en" | "es" | "zh";

type ListenItem = {
  id: string;
  text: string;
  ttsText: string;
  ttsLang: string;
  pinyin?: string;
  concept?: string;
};

type LessonStep =
  | {
      id: string;
      type: "listen" | "vocab" | "pronounce";
      title: string;
      itemsByLanguage: Record<LangCode, ListenItem[]>;
    }
  | {
      id: string;
      type: "build";
      title: string;
      templateByLanguage: Record<LangCode, { template: string; ttsLang: string }>;
      names: string[];
    }
  | {
      id: string;
      type: "conversation";
      title: string;
      scriptByLanguage: Record<
        LangCode,
        {
          app1: string;
          learner1: string;
          app2: string;
          learner2: string;
          learner3?: string;
          app3?: string;
        }
      >;
    }
  | {
      id: string;
      type: "game";
      title: string;
      pairsByLanguage: Record<LangCode, { left: string; right: string }[]>;
    }
  | {
      id: string;
      type: "assessment";
      title: string;
      tasksByLanguage: Record<LangCode, string[]>;
    };

interface LessonPlayerProps {
  lessonId: string;
  language: LangCode;
  onExit: () => void;
}

type SayStatus = "idle" | "listening" | "correct" | "wrong" | "skipped";

/* ---------------- helper functions ---------------- */

function languageToTTS(language: LangCode) {
  if (language === "en") return "en-US";
  if (language === "es") return "es-ES";
  return "zh-CN";
}

function stopSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalizeForCompare(s: string) {
  let out = (s ?? "")
    .toLowerCase()
    .replaceAll("’", "'")
    .replaceAll("…", "")
    .replaceAll("\u00A0", " ")
    .trim();

  out = out.replace(/[^a-z0-9\u4e00-\u9fff\s']/gi, "");
  out = out.replace(/\s+/g, " ").trim();
  return out;
}

function levenshtein(a: string, b: string) {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function similarity(a: string, b: string) {
  const A = a.trim();
  const B = b.trim();
  const maxLen = Math.max(A.length, B.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(A, B) / maxLen;
}

function isGoodMatch(transcriptRaw: string, expectedRaw: string, lang: LangCode) {
  const t = normalizeForCompare(transcriptRaw);
  const e = normalizeForCompare(expectedRaw);
  if (!t || !e) return false;
  if (t === e) return true;
  if (e.length >= 10 && t.includes(e)) return true;
  if (t.length >= 10 && e.includes(t)) return true;

  const score = similarity(t, e);
  return lang === "zh" ? score >= 0.6 : score >= 0.72;
}

function syllableHint(text: string) {
  const cleaned = (text ?? "").replaceAll("’", "'").replaceAll("…", "").trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  return words
    .map((w) => {
      const parts = w
        .toLowerCase()
        .replace(/[^a-z']/g, "")
        .match(/[bcdfghjklmnpqrstvwxyz]*[aeiouy]+(?:[^aeiouy]+)?/g);
      if (!parts || parts.length === 0) return w;
      return parts.join(" • ");
    })
    .join("   ");
}

function spacedCharacters(text: string) {
  return (text ?? "").trim().split("").join(" ");
}

function dedupe(arr: string[]) {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const x of arr) {
    const k = String(x);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(k);
    }
  }
  return out;
}

function ensureAtLeast(base: string[], min: number, filler: string[]) {
  const out = [...base];
  let i = 0;
  while (out.length < min && i < filler.length) {
    const candidate = filler[i++];
    if (!out.includes(candidate)) out.push(candidate);
  }
  return out;
}

function languageFallbackDistractors(language: LangCode): string[] {
  if (language === "en")
    return ["Hello", "Hi", "name", "is", "My", "your", "What's", "Nice", "to", "meet", "you", "you.", "name?", "Hello!", "Hi!"];
  if (language === "es")
    return ["Hola", "¡Hola!", "Hi", "Me", "llamo", "¿Cómo", "te", "llamas?", "Mucho", "gusto."];
  return ["你", "我叫", "你好！", "嗨！", "叫什么", "名字？", "很高兴", "认识", "你。"];
}

/* ---------------- main ---------------- */

const getStepMeta = (type: string) => {
  switch (type) {
    case 'listen': return { emoji: '👂', color: '#7C3AED', desc: 'Tap each card to hear the word!' };
    case 'vocab': return { emoji: '🔗', color: '#0EA5E9', desc: 'Match what you hear to the right word.' };
    case 'pronounce': return { emoji: '🎤', color: '#F43F5E', desc: 'Use your voice to say each phrase.' };
    case 'build': return { emoji: '🧩', color: '#F59E0B', desc: 'Arrange tiles to form the sentence.' };
    case 'conversation': return { emoji: '💬', color: '#10B981', desc: 'Have a chat!' };
    case 'game': return { emoji: '🎯', color: '#8B5CF6', desc: 'Match words to the correct sentence.' };
    case 'assessment': return { emoji: '🏆', color: '#F97316', desc: "Show what you've learned!" };
    default: return { emoji: '✨', color: '#9CA3AF', desc: 'Learn something new!' };
  }
};

const getMascotMessage = (type: string) => {
  switch (type) {
    case 'listen': return "Listen carefully! Tap each card to hear the word. 🎵";
    case 'vocab': return "Now match what you hear to the right word! You got this! 💪";
    case 'pronounce': return "Your turn to speak! Don't be shy — just try! 🎤";
    case 'build': return "Rearrange the tiles to build the sentence. Think like a puzzle! 🧩";
    case 'conversation': return "Pretend you're talking to a new friend! 😊";
    case 'game': return "Almost there! Match the words to fill in the blanks. 🎯";
    case 'assessment': return "This is your moment to shine! Show me what you learned! 🌟";
    default: return "You're doing amazing! Keep going! 🌟";
  }
};

const LessonPlayer: React.FC<LessonPlayerProps> = ({ lessonId, language, onExit }) => {
  const lesson = lessonData as { id: string; title: string; steps: LessonStep[] };
  const { updateProgress, markLessonComplete, addStars, incrementActivity } = useProgress();

  const [stepIndex, setStepIndex] = useState(0);
  const [name, setName] = useState("Alex");
  const [sessionStars, setSessionStars] = useState(0);

  // Completion screen
  const [showComplete, setShowComplete] = useState(false);

  // Progress / gating state
  const [heardIds, setHeardIds] = useState<string[]>([]);
  const [matchedCountStep2, setMatchedCountStep2] = useState(0);
  const [sayItCorrectIds, setSayItCorrectIds] = useState<string[]>([]);
  const [sayItSkippedIds, setSayItSkippedIds] = useState<string[]>([]);
  const [buildDoneCount, setBuildDoneCount] = useState(0);
  const [buildTotalCount, setBuildTotalCount] = useState(5);
  const [convCorrectKeys, setConvCorrectKeys] = useState<string[]>([]);
  const [convSkippedKeys, setConvSkippedKeys] = useState<string[]>([]);
  const [matchedCountStep6, setMatchedCountStep6] = useState(0);

  const step = lesson.steps[stepIndex];

  useEffect(() => {
    // reset global progress ONLY when the lesson/language changes
    setHeardIds([]);
    setMatchedCountStep2(0);
    setSayItCorrectIds([]);
    setSayItSkippedIds([]);
    setBuildDoneCount(0);
    setBuildTotalCount(5);
    setConvCorrectKeys([]);
    setConvSkippedKeys([]);
    setMatchedCountStep6(0);
    setSessionStars(0);
    setStepIndex(0);
    setShowComplete(false);
    stopSpeech();
  }, [language]);

  useEffect(() => {
    // Silence any running speech engine when bouncing between steps
    stopSpeech();
  }, [stepIndex]);

  // Step 1 gating
  const isStep1Listen = stepIndex === 0 && step?.type === "listen";
  const step1Total = isStep1Listen ? (step as { itemsByLanguage: Record<LangCode, ListenItem[]> }).itemsByLanguage[language].length : 0;
  const step1AllHeard = !isStep1Listen ? true : heardIds.length >= step1Total;

  // Step 2 gating
  const isStep2Match = stepIndex === 1 && step?.type === "vocab";
  const step2Total = isStep2Match ? (step as { itemsByLanguage: Record<LangCode, ListenItem[]> }).itemsByLanguage[language].length : 0;
  const step2AllMatched = !isStep2Match ? true : matchedCountStep2 >= step2Total;

  // Step 3 gating
  const isStep3SayIt = stepIndex === 2 && step?.type === "pronounce";
  const step3Total = isStep3SayIt ? (step as { itemsByLanguage: Record<LangCode, ListenItem[]> }).itemsByLanguage[language].length : 0;
  const step3CanProceed = !isStep3SayIt ? true : (sayItCorrectIds.length + sayItSkippedIds.length) >= step3Total;

  // Step 4 gating
  const isStep4Build = stepIndex === 3 && step?.type === "build";
  const step4AllCorrect = !isStep4Build ? true : buildDoneCount >= buildTotalCount;

  // Step 5 gating
  const isStep5Conversation = stepIndex === 4 && step?.type === "conversation";
  const step5RequiredLearnerLines = useMemo(() => {
    if (!isStep5Conversation) return 0;
    const s = (step as { scriptByLanguage: Record<LangCode, any> }).scriptByLanguage[language];
    let count = 0;
    if ((s.learner1 ?? "").trim()) count++;
    if ((s.learner2 ?? "").trim()) count++;
    if ((s.learner3 ?? "").trim()) count++;
    return count;
  }, [isStep5Conversation, step, language]);

  const step5CanProceed = !isStep5Conversation ? true : (convCorrectKeys.length + convSkippedKeys.length) >= step5RequiredLearnerLines;

  // Step 6 gating
  const isStep6FillBlank = stepIndex === 5 && step?.type === "game";
  const step6Total = isStep6FillBlank ? (step as { pairsByLanguage: Record<LangCode, any[]> }).pairsByLanguage[language].length : 0;
  const step6AllMatched = !isStep6FillBlank ? true : matchedCountStep6 >= step6Total;

  const canPrev = stepIndex > 0;
  const canNextBase = stepIndex < lesson.steps.length - 1;

  const canNext =
    canNextBase &&
    step1AllHeard &&
    step2AllMatched &&
    step3CanProceed &&
    step4AllCorrect &&
    step5CanProceed &&
    step6AllMatched;

  const isLastStep = stepIndex === lesson.steps.length - 1;

  // Review & Completion Mechanics
  const step3Global = lesson.steps.findIndex((s) => s.type === "pronounce");
  const step3TotalGlobal = step3Global >= 0 ? (lesson.steps[step3Global] as any).itemsByLanguage[language].length : 0;
  const hasIncompleteStep3 = step3Global >= 0 && sayItCorrectIds.length < step3TotalGlobal;

  const step5Global = lesson.steps.findIndex((s) => s.type === "conversation");
  const step5RequiredGlobal = step5Global >= 0 ? (() => {
    const s = (lesson.steps[step5Global] as any).scriptByLanguage[language];
    let count = 0;
    if ((s.learner1 ?? "").trim()) count++;
    if ((s.learner2 ?? "").trim()) count++;
    if ((s.learner3 ?? "").trim()) count++;
    return count;
  })() : 0;
  const hasIncompleteStep5 = step5Global >= 0 && convCorrectKeys.length < step5RequiredGlobal;

  const canComplete =
    isLastStep &&
    !hasIncompleteStep3 &&
    !hasIncompleteStep5 &&
    step1AllHeard &&
    step2AllMatched &&
    step4AllCorrect &&
    step6AllMatched;

  const next = () => {
    if (!canNext) return;
    stopSpeech();
    addStars(2);
    incrementActivity();
    setSessionStars((s) => s + 2);
    setStepIndex((i) => Math.min(i + 1, lesson.steps.length - 1));
    window.scrollTo(0, 0);
  };

  const prev = () => {
    stopSpeech();
    setStepIndex((i) => Math.max(i - 1, 0));
    window.scrollTo(0, 0);
  };


  const markHeard = (id: string) => setHeardIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  const markSayItCorrect = (id: string) => setSayItCorrectIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  const markSayItSkipped = (id: string) => setSayItSkippedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  const markConvCorrect = (key: string) => setConvCorrectKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
  const markConvSkipped = (key: string) => setConvSkippedKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));

  if (!step) {
    return (
      <div className="min-h-screen pt-28 px-4 bg-[#F0F4F8]">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">
          <div className="font-bold text-red-600">Error: step not found.</div>
        </div>
      </div>
    );
  }

  if (showComplete) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden"
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
            You earned <span className="text-amber-500 font-bold">{sessionStars} Stars</span> and finished Lesson 1!
          </p>

          <div className="bg-violet-50 rounded-2xl p-4 mb-8 flex items-center justify-around">
            {[
              { v: lesson.steps.length.toString(), l: 'Steps Done', e: '✅' },
              { v: `${sessionStars}`, l: 'Stars Earned', e: '⭐' },
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

  const langData = {
    name: language === 'en' ? 'English' : language === 'es' ? 'Spanish' : 'Mandarin',
    flag: language === 'en' ? '🇺🇸' : language === 'es' ? '🇪🇸' : '🇨🇳',
    gradient: language === 'en' ? 'linear-gradient(135deg, #1D4ED8, #0EA5E9)' : language === 'es' ? 'linear-gradient(135deg, #DC2626, #F59E0B)' : 'linear-gradient(135deg, #991B1B, #F97316)',
    color: language === 'en' ? '#0EA5E9' : language === 'es' ? '#F97316' : '#F43F5E'
  };

  const stepMeta = step ? getStepMeta(step.type) : getStepMeta('');
  const mascotText = step ? getMascotMessage(step.type) : getMascotMessage('');
  const progress = ((stepIndex + 1) / lesson.steps.length) * 100;

  useEffect(() => {
    updateProgress(language, Math.round(progress));
  }, [progress, language, updateProgress]);

  return (
    <div className="min-h-screen">

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar step list */}
          <div className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-28 relative">
              {/* Exit button — absolute, just left of the card, doesn't steal width */}
              <button
                onClick={onExit}
                className="absolute -left-10 top-1 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center font-bold text-sm transition-colors shadow-md z-10"
                title="Exit lesson"
              >
                ✕
              </button>
              <div className="bg-white rounded-3xl p-5" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
                  <h3 className="font-heading font-bold text-gray-800 mb-4 text-xs uppercase tracking-widest">Lesson Steps</h3>
                  <div className="space-y-1">
                    {lesson.steps.map((s, i) => {
                      const sm = getStepMeta(s.type);
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-2xl transition-colors"
                          style={{
                            background: i === stepIndex ? `${sm.color}15` : i < stepIndex ? '#F0FDF4' : 'transparent',
                            border: i === stepIndex ? `2px solid ${sm.color}40` : '2px solid transparent',
                          }}
                        >
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                            style={{
                              background: i < stepIndex ? '#10B981' : i === stepIndex ? sm.color : '#E5E7EB',
                              color: i <= stepIndex ? 'white' : '#9CA3AF',
                            }}
                          >
                            {i < stepIndex ? '✓' : sm.emoji}
                          </div>
                          <span
                            className="font-body font-bold text-xs leading-tight"
                            style={{ color: i === stepIndex ? sm.color : i < stepIndex ? '#10B981' : '#9CA3AF' }}
                          >
                            {sm.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>{/* end white card */}

              {/* Status Ring & Info */}
              <div className="bg-white rounded-3xl p-6 mt-6 flex flex-col items-center justify-center gap-6" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
                {/* Ring */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" className="text-gray-100" strokeWidth="8" stroke="currentColor" fill="transparent" />
                    <motion.circle
                      cx="50" cy="50" r="40"
                      strokeWidth="8"
                      stroke={langData.color}
                      strokeLinecap="round"
                      fill="transparent"
                      initial={{ strokeDasharray: "251.2 251.2", strokeDashoffset: 251.2 }}
                      animate={{ strokeDashoffset: 251.2 - (251.2 * progress) / 100 }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-heading font-bold text-3xl" style={{ color: langData.color }}>{Math.round(progress)}%</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-col gap-3 w-full">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.3 }}
                    key={sessionStars}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-heading font-bold text-base"
                    style={{ background: '#FEF3C7', color: '#B45309', border: '2px solid #FCD34D' }}
                  >
                    ⭐ {sessionStars} Stars Earned
                  </motion.div>

                  <div
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-heading font-bold text-base text-white shadow-sm"
                    style={{ background: langData.gradient }}
                  >
                    {langData.flag} {langData.name}
                  </div>
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
                  style={{ background: `linear-gradient(135deg, ${stepMeta.color}, ${stepMeta.color}99)` }}
                >
                  <div className="absolute right-0 top-0 text-[200px] opacity-10 select-none -mr-8 -mt-8 leading-none pointer-events-none">
                    {stepMeta.emoji}
                  </div>
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <div className="font-body text-white/70 text-sm mb-1 uppercase tracking-wider">
                        Step {stepIndex + 1} of {lesson.steps.length}
                      </div>
                      <h2 className="font-heading font-bold text-4xl mb-2">{step.title}</h2>
                      <p className="font-body text-white/80">{stepMeta.desc}</p>
                    </div>
                    <div className="text-5xl ml-4 flex-shrink-0">{stepMeta.emoji}</div>
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
                    {mascotText}
                    <div
                      className="absolute -left-2 top-4 w-3 h-3 rotate-45 bg-white"
                      style={{ border: '2px solid rgba(167,139,250,0.2)', borderRight: 'none', borderBottom: 'none' }}
                    />
                  </div>
                </div>

                {/* Content card */}
                <div className="bg-white rounded-3xl p-6 mb-6" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
                  {step.type === "listen" && isStep1Listen ? (
                    <StepListenCards step={step as Extract<LessonStep, { type: "listen" }>} language={language} heardIds={heardIds} onHeard={markHeard} />
                  ) : step.type === "vocab" && isStep2Match ? (
                    <Step2AudioMatch step={step as Extract<LessonStep, { type: "vocab" }>} language={language} onProgress={setMatchedCountStep2} />
                  ) : step.type === "pronounce" && isStep3SayIt ? (
                    <Step3SayIt step={step as Extract<LessonStep, { type: "pronounce" }>} language={language} correctIds={sayItCorrectIds} skippedIds={sayItSkippedIds} onCorrect={markSayItCorrect} onSkip={markSayItSkipped} />
                  ) : step.type === "build" && isStep4Build ? (
                    <Step4BuildMulti
                      step={step as Extract<LessonStep, { type: "build" }>}
                      language={language}
                      name={name}
                      setName={setName}
                      onProgress={(done, total) => {
                        setBuildDoneCount(done);
                        setBuildTotalCount(total);
                      }}
                    />
                  ) : step.type === "conversation" && isStep5Conversation ? (
                    <Step5ConversationPronounce step={step as Extract<LessonStep, { type: "conversation" }>} language={language} name={name} correctKeys={convCorrectKeys} skippedKeys={convSkippedKeys} onCorrect={markConvCorrect} onSkip={markConvSkipped} />
                  ) : step.type === "game" && isStep6FillBlank ? (
                    <Step6FillBlank step={step as Extract<LessonStep, { type: "game" }>} language={language} onProgress={setMatchedCountStep6} />
                  ) : step.type === "assessment" ? (
                    <StepAssessment step={step as Extract<LessonStep, { type: "assessment" }>} language={language} name={name} />
                  ) : (
                    <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-200 text-yellow-900 font-bold">
                      This step type/index isn’t wired in this file. (stepIndex={stepIndex}, type={step.type})
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <KidButton variant="ghost" size="lg" onClick={prev} disabled={!canPrev} icon={<span>←</span>}>
                    Previous
                  </KidButton>

                  <div className="flex gap-1.5 items-center">
                    {lesson.steps.map((_, i) => (
                      <div
                        key={i}
                        className="h-2 rounded-full transition-all"
                        style={{
                          width:      i === stepIndex ? 24 : 8,
                          background: i === stepIndex ? stepMeta.color : i < stepIndex ? '#10B981' : '#E5E7EB',
                        }}
                      />
                    ))}
                  </div>

                  {isLastStep ? (
                    hasIncompleteStep3 || hasIncompleteStep5 ? (
                      <KidButton
                        variant="coral"
                        size="lg"
                        onClick={() => {
                          if (hasIncompleteStep3) setStepIndex(step3Global);
                          else if (hasIncompleteStep5) setStepIndex(step5Global);
                          window.scrollTo(0, 0);
                        }}
                        icon={<span>⚠️</span>}
                      >
                        Review Skipped
                      </KidButton>
                    ) : (
                      <KidButton
                        variant="coral"
                        size="lg"
                        onClick={() => {
                          if (!canComplete) return;
                          stopSpeech();
                          setShowComplete(true);
                          markLessonComplete(language, lessonId);
                          window.scrollTo(0, 0);
                        }}
                        disabled={!canComplete}
                        icon={<span>🏆</span>}
                      >
                        Complete Lesson!
                      </KidButton>
                    )
                  ) : (
                    <KidButton
                      variant="grape"
                      size="lg"
                      onClick={next}
                      disabled={!canNext}
                      icon={<span>→</span>}
                    >
                      Next Step
                    </KidButton>
                  )}
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

/* ---------------- Step 1: Listen ---------------- */

function StepListenCards({
  step,
  language,
  heardIds,
  onHeard
}: {
  step: { itemsByLanguage: Record<LangCode, ListenItem[]> };
  language: LangCode;
  heardIds: string[];
  onHeard: (id: string) => void;
}) {
  const items = step.itemsByLanguage[language];
  const heardSet = useMemo(() => new Set(heardIds), [heardIds]);

  const handleClick = (item: ListenItem) => {
    speak((item.ttsText ?? item.text).trim(), (item.ttsLang ?? languageToTTS(language)).trim());
    onHeard(item.id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {items.map((item) => {
        const isHeard = heardSet.has(item.id);
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item)}
            className={[
              "text-left transition-colors rounded-2xl p-5 border shadow-sm",
              isHeard ? "bg-green-50 border-green-200 hover:bg-green-100" : "bg-[#F7FAFF] border-blue-100 hover:bg-[#EEF4FF]"
            ].join(" ")}
          >
            <div className="flex items-center justify-between">
              <div className="font-heading font-extrabold text-2xl text-gray-800">{item.text}</div>
              <div className={`p-2 rounded-xl bg-white border ${isHeard ? "border-green-100" : "border-gray-100"}`}>
                <Volume2 size={18} className="text-gray-700" />
              </div>
            </div>

            {item.pinyin ? <div className="mt-2 text-sm font-bold text-gray-600">Pinyin: {item.pinyin}</div> : null}

            <div className={`mt-3 text-xs font-extrabold uppercase tracking-wide ${isHeard ? "text-green-700" : "text-primary"}`}>
              {isHeard ? "Completed ✓" : "Tap to hear"}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- Step 2: Audio Match ---------------- */

type Step2LeftCard = { id: string; correctRightId: string; ttsText: string; ttsLang: string };
type Step2RightCard = { id: string; text: string; ttsText: string; ttsLang: string; pinyin?: string };

function Step2AudioMatch({
  step,
  language,
  onProgress
}: {
  step: { itemsByLanguage: Record<LangCode, ListenItem[]> };
  language: LangCode;
  onProgress: (count: number) => void;
}) {
  const baseItems = step.itemsByLanguage[language];

  const leftCards: Step2LeftCard[] = useMemo(
    () =>
      baseItems.map((it) => ({
        id: `L-${it.id}`,
        correctRightId: it.id,
        ttsText: it.ttsText,
        ttsLang: it.ttsLang
      })),
    [baseItems]
  );

  const rightCards: Step2RightCard[] = useMemo(
    () =>
      baseItems.map((it) => ({
        id: it.id,
        text: it.text,
        ttsText: it.ttsText,
        ttsLang: it.ttsLang,
        pinyin: it.pinyin
      })),
    [baseItems]
  );

  const shuffledLeft = useMemo(() => shuffle(leftCards), [leftCards]);
  const shuffledRight = useMemo(() => shuffle(rightCards), [rightCards]);

  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [wrongPair, setWrongPair] = useState<{ leftId: string; rightId: string } | null>(null);

  useEffect(() => {
    onProgress(Object.keys(matches).length);
  }, [matches, onProgress]);

  const isMatchedLeft = (leftId: string) => matches[leftId] != null;
  const isMatchedRight = (rightId: string) => Object.values(matches).includes(rightId);

  const clickLeft = (card: Step2LeftCard) => {
    if (isMatchedLeft(card.id)) return;
    setSelectedLeftId(card.id);
    speak(card.ttsText, card.ttsLang);
  };

  const clickRight = (card: Step2RightCard) => {
    speak(card.ttsText, card.ttsLang);
    if (!selectedLeftId) return;
    if (isMatchedRight(card.id)) return;

    const leftCard = leftCards.find((c) => c.id === selectedLeftId);
    if (!leftCard) return;

    if (leftCard.correctRightId === card.id) {
      setMatches((prev) => ({ ...prev, [selectedLeftId]: card.id }));
      setSelectedLeftId(null);
      setWrongPair(null);
      return;
    }

    const lp = { leftId: selectedLeftId, rightId: card.id };
    setWrongPair(lp);
    window.setTimeout(() => {
      setWrongPair((curr) => (curr && curr.leftId === lp.leftId && curr.rightId === lp.rightId ? null : curr));
    }, 900);
  };

  const leftStatusClass = (leftId: string) => {
    const matched = isMatchedLeft(leftId);
    const selected = selectedLeftId === leftId;
    const wrong = wrongPair?.leftId === leftId;
    if (matched) return "bg-green-50 border-green-200 hover:bg-green-100";
    if (wrong) return "bg-red-50 border-red-200";
    if (selected) return "bg-purple-50 border-purple-200";
    return "bg-[#F7FAFF] border-blue-100 hover:bg-[#EEF4FF]";
  };

  const rightStatusClass = (rightId: string) => {
    const matched = isMatchedRight(rightId);
    const wrong = wrongPair?.rightId === rightId;
    if (matched) return "bg-green-50 border-green-200 hover:bg-green-100";
    if (wrong) return "bg-red-50 border-red-200";
    return "bg-white border-gray-200 hover:bg-gray-50";
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-bold text-gray-600">1) Tap a left box to hear. 2) Match it to the word on the right.</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-3">
          <div className="text-xs font-extrabold text-gray-500 uppercase tracking-wide">Tap to hear</div>
          {shuffledLeft.map((c) => (
            <button
              key={c.id}
              onClick={() => clickLeft(c)}
              disabled={isMatchedLeft(c.id)}
              className={["w-full text-left rounded-2xl p-5 border shadow-sm transition-colors", leftStatusClass(c.id)].join(" ")}
            >
              <div className="flex items-center justify-between">
                <div className="font-heading font-extrabold text-xl text-gray-800">Tap to hear</div>
                <div className="p-2 rounded-xl bg-white border border-gray-100">
                  <Volume2 size={18} className="text-gray-700" />
                </div>
              </div>
              <div className="mt-3 text-xs font-extrabold uppercase tracking-wide text-gray-500">
                {isMatchedLeft(c.id) ? "Matched ✓" : selectedLeftId === c.id ? "Now pick the match →" : " "}
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div className="text-xs font-extrabold text-gray-500 uppercase tracking-wide">Match the word</div>
          {shuffledRight.map((c) => (
            <button
              key={c.id}
              onClick={() => clickRight(c)}
              disabled={isMatchedRight(c.id)}
              className={["w-full text-left rounded-2xl p-5 border shadow-sm transition-colors", rightStatusClass(c.id)].join(" ")}
            >
              <div className="flex items-center justify-between">
                <div className="font-heading font-extrabold text-xl text-gray-800">{c.text}</div>
                <div className="p-2 rounded-xl bg-white border border-gray-100">
                  <Volume2 size={18} className="text-gray-700" />
                </div>
              </div>
              {c.pinyin ? <div className="mt-2 text-sm font-bold text-gray-600">Pinyin: {c.pinyin}</div> : null}
              <div className="mt-3 text-xs font-extrabold uppercase tracking-wide text-gray-500">
                {isMatchedRight(c.id) ? "Matched ✓" : "Tap to hear"}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Step 3: Say It ---------------- */

function Step3SayIt({
  step,
  language,
  correctIds,
  skippedIds,
  onCorrect,
  onSkip
}: {
  step: { itemsByLanguage: Record<LangCode, ListenItem[]> };
  language: LangCode;
  correctIds: string[];
  skippedIds: string[];
  onCorrect: (id: string) => void;
  onSkip: (id: string) => void;
}) {
  const items = step.itemsByLanguage[language];
  const correctSet = useMemo(() => new Set(correctIds), [correctIds]);
  const skippedSet = useMemo(() => new Set(skippedIds), [skippedIds]);

  const [statusById, setStatusById] = useState<Record<string, SayStatus>>({});
  const [heardTextById, setHeardTextById] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isSupported =
    typeof window !== "undefined" && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop?.();
      } catch {}
    };
  }, []);

  const startListening = (item: ListenItem) => {
    setErrorMsg(null);
    if (!isSupported) {
      setErrorMsg("Speech recognition is not supported in this browser. Try Chrome on desktop.");
      return;
    }

    stopSpeech();
    try {
      recognitionRef.current?.stop?.();
    } catch {}

    let rec: any;
    try {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      rec = new SR();
    } catch (e) {
      setErrorMsg("Failed to initialize speech recognition. Your browser might block it.");
      return;
    }
    recognitionRef.current = rec;

    rec.lang = (item.ttsLang ?? languageToTTS(language)).trim();
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 3;

    setActiveId(item.id);
    setStatusById((p) => ({ ...p, [item.id]: "listening" }));

    rec.onresult = (event: any) => {
      const transcript = String(event.results?.[0]?.[0]?.transcript ?? "").trim();
      setHeardTextById((p) => ({ ...p, [item.id]: transcript }));

      const expected = (item.ttsText ?? item.text ?? "").trim();
      const ok = isGoodMatch(transcript, expected, language);

      if (ok) {
        setStatusById((p) => ({ ...p, [item.id]: "correct" }));
        onCorrect(item.id);
      } else {
        setStatusById((p) => ({ ...p, [item.id]: "wrong" }));
        window.setTimeout(() => {
          setStatusById((p) => (p[item.id] !== "wrong" ? p : { ...p, [item.id]: "idle" }));
        }, 1200);
      }

      setActiveId(null);
      try {
        rec.stop();
      } catch {}
    };

    rec.onerror = (e: any) => {
      setActiveId(null);
      setStatusById((p) => ({ ...p, [item.id]: "idle" }));

      const code = e?.error ? String(e.error) : "unknown";
      if (code === "not-allowed" || code === "service-not-allowed") {
        setErrorMsg("Microphone permission blocked. Allow mic access in your browser settings.");
      } else if (code === "no-speech") {
        setErrorMsg("I didn't hear anything. Try again and speak louder.");
      } else {
        if (code === "network") {
          setErrorMsg("Speech recognition network error: Please turn off your ad blocker or VPN to use the microphone.");
        } else {
          setErrorMsg(`Speech recognition error: ${code} - ${e.message || "Unknown error"}`);
        }
        console.error("Speech Recognition Error:", e);
      }

      try {
        rec.stop();
      } catch {}
    };

    rec.onend = () => {
      setStatusById((p) => (p[item.id] === "listening" ? { ...p, [item.id]: "idle" } : p));
      setActiveId(null);
    };

    try {
      rec.start();
    } catch {
      setErrorMsg("Could not start microphone. Try refreshing the page.");
      setStatusById((p) => ({ ...p, [item.id]: "idle" }));
      setActiveId(null);
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop?.();
    } catch {}
    setActiveId(null);
  };

  const playExample = (item: ListenItem) => {
    speak((item.ttsText ?? item.text).trim(), (item.ttsLang ?? languageToTTS(language)).trim());
  };

  const cardClass = (id: string) => {
    const st = statusById[id] ?? "idle";
    const isCorrect = correctSet.has(id) || st === "correct";
    const isSkipped = skippedSet.has(id) || st === "skipped";
    
    if (isCorrect) return "bg-green-50 border-green-200 hover:bg-green-100";
    if (st === "wrong") return "bg-red-50 border-red-200";
    if (st === "listening") return "bg-purple-50 border-purple-200";
    if (isSkipped && !isCorrect) return "bg-yellow-50 border-yellow-200";
    return "bg-[#F7FAFF] border-blue-100 hover:bg-[#EEF4FF]";
  };

  return (
    <div className="space-y-4">
      {!isSupported ? (
        <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-200 text-yellow-900 font-bold">
          Speech recognition isn’t available in this browser. Try Chrome (desktop/laptop).
        </div>
      ) : null}

      {errorMsg ? <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 font-bold">{errorMsg}</div> : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((item) => {
          const st = statusById[item.id] ?? "idle";
          const isCorrect = correctSet.has(item.id) || st === "correct";
          const lastHeard = heardTextById[item.id];

          const hint =
            language === "zh"
              ? item.pinyin
                ? item.pinyin
                : spacedCharacters(item.text)
              : syllableHint(item.ttsText ?? item.text);

          return (
            <div key={item.id} className={["rounded-2xl p-5 border shadow-sm transition-colors", cardClass(item.id)].join(" ")}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-heading font-extrabold text-2xl text-gray-800">{item.text}</div>
                  {item.pinyin ? <div className="mt-1 text-sm font-bold text-gray-600">Pinyin: {item.pinyin}</div> : null}
                </div>

                <button onClick={() => playExample(item)} className="p-3 rounded-xl bg-white border border-gray-100 hover:bg-gray-50" title="Hear it">
                  <Volume2 size={18} className="text-gray-700" />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {!isCorrect ? (
                  <>
                    <button
                      onClick={() => startListening(item)}
                      disabled={activeId !== null && activeId !== item.id}
                      className={`px-4 py-2 rounded-xl font-extrabold flex items-center gap-2 ${
                        st === "listening" ? "bg-purple-600 text-white" : "bg-primary text-white hover:bg-primary/90"
                      }`}
                    >
                      <Mic size={16} />
                      {st === "listening" ? "Listening..." : "Start"}
                    </button>

                    <button
                      onClick={stopListening}
                      disabled={st !== "listening"}
                      className={`px-4 py-2 rounded-xl font-extrabold flex items-center gap-2 ${
                        st === "listening" ? "bg-gray-100 text-gray-800 hover:bg-gray-200" : "bg-gray-50 text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      <Square size={16} />
                      Stop
                    </button>
                    {st !== "skipped" && !skippedSet.has(item.id) && (
                      <button
                        onClick={() => {
                          setStatusById((p) => ({ ...p, [item.id]: "skipped" }));
                          onSkip(item.id);
                        }}
                        className="px-4 py-2 rounded-xl font-extrabold flex items-center gap-2 bg-gray-100 text-gray-600 hover:bg-gray-200"
                        title="Skip speaking"
                      >
                        Skip
                      </button>
                    )}
                  </>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-green-100 text-green-700 font-extrabold">
                    <CheckCircle2 className="text-green-500" size={18} />
                    Correct
                  </div>
                )}
              </div>

              {lastHeard ? (
                <div className="mt-3 text-sm font-bold text-gray-700">
                  You said: <span className="text-gray-900">“{lastHeard}”</span>
                </div>
              ) : null}

              {st === "wrong" ? (
                <div className="mt-3 p-3 rounded-xl bg-white border border-red-100">
                  <div className="text-sm font-extrabold text-red-700">Try again 👇</div>
                  <div className="mt-1 text-sm font-bold text-gray-700">{hint}</div>
                </div>
              ) : null}

              {(st === "skipped" || skippedSet.has(item.id)) && !isCorrect ? (
                <div className="mt-3 p-3 rounded-xl bg-white border border-yellow-100">
                  <div className="text-sm font-extrabold text-yellow-800">⚠️ Skipped</div>
                  <div className="mt-1 text-xs font-bold text-gray-600">You must try this again to pass the lesson!</div>
                </div>
              ) : null}

              <div className="mt-3 text-xs font-extrabold uppercase tracking-wide text-gray-500">{isCorrect ? "Completed ✓" : "Listen → then say it"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Step 4: Build (hear only) ---------------- */

type BuildSentence = {
  key: string;
  tts: string;
  ttsLang: string;
  tilesCorrect: string[];
  distractors?: string[];
};

function Step4BuildMulti({
  step,
  language,
  name,
  setName,
  onProgress
}: {
  step: {
    templateByLanguage: Record<LangCode, { template: string; ttsLang: string }>;
    names: string[];
  };
  language: LangCode;
  name: string;
  setName: (v: string) => void;
  onProgress: (done: number, total: number) => void;
}) {
  const ttsLang = step.templateByLanguage[language].ttsLang;

  const zhPinyin: Record<string, string> = {
    "我叫": "Wǒ jiào",
    "你好！": "Nǐ hǎo!",
    "你好": "Nǐ hǎo",
    "嗨！": "Hāi!",
    "嗨": "Hāi",
    "你": "Nǐ",
    "叫什么": "jiào shénme",
    "名字？": "míngzì?",
    "名字": "míngzì",
    "很高兴": "Hěn gāoxìng",
    "认识": "rènshi",
    "你。": "nǐ."
  };

  const sentences: BuildSentence[] = useMemo(() => {
    if (language === "en") {
      return [
        { key: "en-1", tts: `My name is ${name}.`, ttsLang, tilesCorrect: ["My", "name", "is", `${name}.`], distractors: ["Hello!", "Hi!", "your", "What's", "meet", "you."] },
        { key: "en-2", tts: "Hello!", ttsLang, tilesCorrect: ["Hello!"], distractors: ["Hi!", "name", "is", "My", "your", "What's", "Hello", "you."] },
        { key: "en-3", tts: "Hi!", ttsLang, tilesCorrect: ["Hi!"], distractors: ["Hello!", "My", "name", "is", "your", "What's", "Hi", "meet"] },
        { key: "en-4", tts: "What's your name?", ttsLang, tilesCorrect: ["What's", "your", "name?"], distractors: ["My", "name", "is", "Hello!", "Hi!", "meet", "you."] },
        { key: "en-5", tts: "Nice to meet you.", ttsLang, tilesCorrect: ["Nice", "to", "meet", "you."], distractors: ["Hello!", "Hi!", "What's", "your", "name?", "My", "is"] }
      ];
    }

    if (language === "es") {
      return [
        { key: "es-1", tts: `Me llamo ${name}.`, ttsLang, tilesCorrect: ["Me", "llamo", `${name}.`], distractors: ["Hola", "Hi", "¿Cómo", "te", "llamas?", "gusto."] },
        { key: "es-2", tts: "¡Hola!", ttsLang, tilesCorrect: ["¡Hola!"], distractors: ["Hola", "Hi", "Me", "llamo", "¿Cómo", "te", "gusto", "llamas?"] },
        { key: "es-3", tts: "Hi", ttsLang, tilesCorrect: ["Hi"], distractors: ["¡Hola!", "Hola", "Me", "llamo", "¿Cómo", "te", "llamas?", "gusto."] },
        { key: "es-4", tts: "¿Cómo te llamas?", ttsLang, tilesCorrect: ["¿Cómo", "te", "llamas?"], distractors: ["Me", "llamo", "¡Hola!", "Hola", "gusto.", "Hi", `${name}.`] },
        { key: "es-5", tts: "Mucho gusto.", ttsLang, tilesCorrect: ["Mucho", "gusto."], distractors: ["Me", "llamo", "¡Hola!", "Hola", "¿Cómo", "te", "llamas?", "Hi"] }
      ];
    }

    return [
      { key: "zh-1", tts: `我叫 ${name}。`, ttsLang, tilesCorrect: ["我叫", `${name}。`], distractors: ["你好！", "嗨！", "你", "叫什么", "名字？", "很高兴", "认识"] },
      { key: "zh-2", tts: "你好！", ttsLang, tilesCorrect: ["你好！"], distractors: ["嗨！", "我叫", "你", "名字？", "叫什么", "很高兴", "认识", "你。"] },
      { key: "zh-3", tts: "嗨！", ttsLang, tilesCorrect: ["嗨！"], distractors: ["你好！", "我叫", "你", "叫什么", "名字？", "很高兴", "认识", "你。"] },
      { key: "zh-4", tts: "你叫什么名字？", ttsLang, tilesCorrect: ["你", "叫什么", "名字？"], distractors: ["你好！", "嗨！", "我叫", `${name}。`, "很高兴", "认识", "你。"] },
      { key: "zh-5", tts: "很高兴认识你。", ttsLang, tilesCorrect: ["很高兴", "认识", "你。"], distractors: ["你好！", "嗨！", "你", "叫什么", "名字？", "我叫", `${name}。`] }
    ];
  }, [language, name, ttsLang]);

  const [builtByKey, setBuiltByKey] = useState<Record<string, string[]>>({});
  const [doneKeys, setDoneKeys] = useState<string[]>([]);

  useEffect(() => {
    setBuiltByKey({});
    setDoneKeys([]);
  }, [language, name]);

  useEffect(() => {
    onProgress(doneKeys.length, sentences.length);
  }, [doneKeys, sentences.length, onProgress]);

  const doneSet = useMemo(() => new Set(doneKeys), [doneKeys]);

  const tileBankByKey = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const s of sentences) {
      const distractors = (s.distractors ?? []).filter(Boolean);
      const pool = dedupe([...s.tilesCorrect, ...distractors]);
      const minOptions = s.tilesCorrect.length === 1 ? 8 : 10;
      map[s.key] = shuffle(ensureAtLeast(pool, minOptions, languageFallbackDistractors(language)));
    }
    return map;
  }, [sentences, language]);

  const isComplete = (key: string, correctTiles: string[]) => {
    const built = builtByKey[key] ?? [];
    return built.join(" ") === correctTiles.join(" ");
  };

  const clickTile = (sentenceKey: string, tile: string) => {
    if (doneSet.has(sentenceKey)) return;

    setBuiltByKey((prev) => {
      const curr = prev[sentenceKey] ?? [];
      const bank = tileBankByKey[sentenceKey] ?? [];

      const countInCurr = curr.filter((x) => x === tile).length;
      const countInBank = bank.filter((x) => x === tile).length;
      if (countInCurr >= countInBank) return prev;

      return { ...prev, [sentenceKey]: [...curr, tile] };
    });
  };

  const resetOne = (sentenceKey: string) => {
    if (doneSet.has(sentenceKey)) return;
    setBuiltByKey((prev) => ({ ...prev, [sentenceKey]: [] }));
  };

  useEffect(() => {
    const newlyDone: string[] = [];
    for (const s of sentences) {
      if (doneSet.has(s.key)) continue;
      if (isComplete(s.key, s.tilesCorrect)) newlyDone.push(s.key);
    }
    if (newlyDone.length) setDoneKeys((prev) => [...prev, ...newlyDone]);
  }, [builtByKey]);

  return (
    <div className="space-y-6">
      <div className="bg-[#F7FAFF] border border-blue-100 rounded-2xl p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-extrabold text-gray-500 uppercase tracking-wide">Choose a name</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {step.names.map((n) => (
                <button
                  key={n}
                  onClick={() => setName(n)}
                  className={`px-4 py-2 rounded-xl font-bold ${
                    n === name ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="text-sm font-bold text-gray-600">
            Listen 🎧 then build all <span className="text-gray-900">5</span> to unlock Next ✅
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {sentences.map((s, idx) => {
          const built = builtByKey[s.key] ?? [];
          const done = doneSet.has(s.key);
          const completeNow = done || built.join(" ") === s.tilesCorrect.join(" ");

          return (
            <div
              key={s.key}
              className={[
                "rounded-2xl p-5 border shadow-sm transition-colors",
                completeNow ? "bg-green-50 border-green-200 shadow-[0_0_0_3px_rgba(34,197,94,0.25)]" : "bg-white border-gray-100"
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-extrabold text-gray-500 uppercase tracking-wide">Sentence {idx + 1}</div>
                  <div className="mt-1 text-sm font-bold text-gray-600">Tap “Hear it” and build what you hear.</div>
                </div>

                <button
                  onClick={() => speak(s.tts, s.ttsLang)}
                  className="px-4 py-3 rounded-xl bg-white border border-gray-200 font-extrabold flex items-center gap-2 hover:bg-gray-50"
                >
                  <Volume2 size={18} />
                  Hear it
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(tileBankByKey[s.key] ?? []).map((t, i) => {
                  const py = language === "zh" ? zhPinyin[t] : undefined;
                  return (
                    <button
                      key={`${s.key}-${t}-${i}`}
                      onClick={() => clickTile(s.key, t)}
                      disabled={done}
                      className={`px-4 py-2 rounded-xl font-bold ${
                        done ? "bg-gray-50 text-gray-300 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                      }`}
                    >
                      <span>{t}</span>
                      {py ? <span className="ml-2 text-xs font-extrabold text-gray-500">({py})</span> : null}
                    </button>
                  );
                })}
              </div>

              <div
                className={[
                  "mt-5 p-4 rounded-xl border min-h-[56px] font-heading font-extrabold text-xl flex items-center justify-between",
                  completeNow ? "bg-green-50 border-green-200 text-green-800" : "bg-[#F7FAFF] border-blue-100 text-gray-800"
                ].join(" ")}
              >
                <span>{built.join(" ") || "Tap words above…"}</span>
                {completeNow ? <CheckCircle2 className="text-green-500" /> : null}
              </div>

              {language === "zh" ? (
                <div className="mt-2 text-xs font-bold text-gray-600">
                  (
                  {built
                    .map((tok) => zhPinyin[tok] ?? tok)
                    .join(" ")}
                  )
                </div>
              ) : null}

              <div className="mt-4 flex items-center gap-3">
                {!done ? (
                  <button onClick={() => resetOne(s.key)} className="px-4 py-2 rounded-xl bg-gray-100 font-bold text-gray-700 hover:bg-gray-200">
                    Reset
                  </button>
                ) : (
                  <div className="text-sm font-extrabold text-green-700">Completed ✓</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Step 5: Conversation + Pronunciation ---------------- */

function Step5ConversationPronounce({
  step,
  language,
  name,
  correctKeys,
  skippedKeys,
  onCorrect,
  onSkip
}: {
  step: {
    scriptByLanguage: Record<
      LangCode,
      {
        app1: string;
        learner1: string;
        app2: string;
        learner2: string;
        learner3?: string;
        app3?: string;
      }
    >;
  };
  language: LangCode;
  name: string;
  correctKeys: string[];
  skippedKeys: string[];
  onCorrect: (key: string) => void;
  onSkip: (key: string) => void;
}) {
  const s = step.scriptByLanguage[language];

  const app1 = s.app1 ?? "";
  const learner1 = (s.learner1 ?? "").replace("{name}", name);
  const app2 = s.app2 ?? "";
  const learner2 = (s.learner2 ?? "").replace("{name}", name);

  const learner3 = (s.learner3 ?? "").replace("{name}", name);
  const app3 = (s.app3 ?? "").replace("{name}", name);

  const zhPinyinLine: Record<string, string> = {
    "你好！": "Nǐ hǎo!",
    "你好": "Nǐ hǎo",
    "嗨！": "Hāi!",
    "嗨": "Hāi",
    "你叫什么名字？": "Nǐ jiào shénme míngzì?",
    "你叫什么名字": "Nǐ jiào shénme míngzì?",
    "我叫 {name}，你呢？": "Wǒ jiào {name}, nǐ ne?",
    "我叫 {name}，你呢?": "Wǒ jiào {name}, nǐ ne?",
    "我叫 Luke。": "Wǒ jiào Luke.",
    "我叫 Luke": "Wǒ jiào Luke."
  };

  const pinyinForLine = (txt: string) => {
    if (language !== "zh") return "";
    const raw = (txt ?? "").trim();
    if (!raw) return "";
    const hit = zhPinyinLine[raw];
    if (!hit) return "";
    return hit.replace("{name}", name);
  };

  const correctSet = useMemo(() => new Set(correctKeys), [correctKeys]);
  const skippedSet = useMemo(() => new Set(skippedKeys), [skippedKeys]);

  const [statusByKey, setStatusByKey] = useState<Record<string, SayStatus>>({});
  const [heardByKey, setHeardByKey] = useState<Record<string, string>>({});
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isSupported =
    typeof window !== "undefined" && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop?.();
      } catch {}
    };
  }, []);

  const startListening = (key: string, expectedText: string) => {
    setErrorMsg(null);
    if (!isSupported) {
      setErrorMsg("Speech recognition is not supported in this browser. Try Chrome on desktop.");
      return;
    }

    stopSpeech();

    try {
      recognitionRef.current?.stop?.();
    } catch {}

    let rec: any;
    try {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      rec = new SR();
    } catch (e) {
      setErrorMsg("Failed to initialize speech recognition. Your browser might block it.");
      return;
    }
    recognitionRef.current = rec;

    rec.lang = languageToTTS(language);
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 3;

    setActiveKey(key);
    setStatusByKey((p) => ({ ...p, [key]: "listening" }));

    rec.onresult = (event: any) => {
      const transcript = String(event.results?.[0]?.[0]?.transcript ?? "").trim();
      setHeardByKey((p) => ({ ...p, [key]: transcript }));

      const ok = isGoodMatch(transcript, expectedText, language);

      if (ok) {
        setStatusByKey((p) => ({ ...p, [key]: "correct" }));
        onCorrect(key);
      } else {
        setStatusByKey((p) => ({ ...p, [key]: "wrong" }));
        window.setTimeout(() => {
          setStatusByKey((p) => (p[key] !== "wrong" ? p : { ...p, [key]: "idle" }));
        }, 1200);
      }

      setActiveKey(null);
      try {
        rec.stop();
      } catch {}
    };

    rec.onerror = (e: any) => {
      setActiveKey(null);
      setStatusByKey((p) => ({ ...p, [key]: "idle" }));

      const code = e?.error ? String(e.error) : "unknown";
      if (code === "not-allowed" || code === "service-not-allowed") {
        setErrorMsg("Microphone permission blocked. Allow mic access in your browser settings.");
      } else if (code === "no-speech") {
        setErrorMsg("I didn't hear anything. Try again and speak louder.");
      } else {
        if (code === "network") {
          setErrorMsg("Speech recognition network error: Please turn off your ad blocker or VPN to use the microphone.");
        } else {
          setErrorMsg(`Speech recognition error: ${code} - ${e.message || "Unknown error"}`);
        }
        console.error("Speech Recognition Error:", e);
      }

      try {
        rec.stop();
      } catch {}
    };

    rec.onend = () => {
      setStatusByKey((p) => (p[key] === "listening" ? { ...p, [key]: "idle" } : p));
      setActiveKey(null);
    };

    try {
      rec.start();
    } catch {
      setErrorMsg("Could not start microphone. Try refreshing.");
      setStatusByKey((p) => ({ ...p, [key]: "idle" }));
      setActiveKey(null);
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop?.();
    } catch {}
    setActiveKey(null);
  };

  const bubbleClass = (who: "app" | "learner", key?: string) => {
    if (who === "app") return "bg-white border border-gray-100";
    const st = key ? statusByKey[key] ?? "idle" : "idle";
    const done = key ? correctSet.has(key) || st === "correct" : false;
    const skipped = key ? skippedSet.has(key) || st === "skipped" : false;
    
    if (done) return "bg-green-600 text-white";
    if (st === "wrong") return "bg-red-600 text-white";
    if (st === "listening") return "bg-purple-600 text-white";
    if (skipped && !done) return "bg-yellow-600 text-white";
    return "bg-primary text-white";
  };

  const lineHint = (txt: string) => (language === "zh" ? spacedCharacters(txt) : syllableHint(txt));

  return (
    <div className="space-y-4">
      {!isSupported ? (
        <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-200 text-yellow-900 font-bold">
          Speech recognition isn’t available in this browser. Try Chrome (desktop/laptop).
        </div>
      ) : null}

      {errorMsg ? <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 font-bold">{errorMsg}</div> : null}

      <div className="text-sm font-bold text-gray-600">
        White bubbles: tap 🔊 to hear. Blue bubbles: you must say it correctly ✅
      </div>

      <div className="space-y-3">
        <ChatBubble
          who="App"
          bgClass={bubbleClass("app")}
          text={app1}
          subtext={pinyinForLine(app1)}
          onSpeak={() => speak(app1, languageToTTS(language))}
        />

        <LearnerSpeakBubble
          bubbleClass={bubbleClass("learner", "learner1")}
          text={learner1}
          subtext={pinyinForLine(learner1)}
          status={statusByKey["learner1"] ?? "idle"}
          isDone={correctSet.has("learner1")}
          isSkipped={skippedSet.has("learner1")}
          activeKey={activeKey}
          myKey="learner1"
          onHear={() => speak(learner1, languageToTTS(language))}
          onStart={() => startListening("learner1", learner1)}
          onStop={stopListening}
          onSkip={() => { setStatusByKey((p) => ({ ...p, ["learner1"]: "skipped" })); onSkip("learner1"); }}
          heardText={heardByKey["learner1"]}
          hint={lineHint(learner1)}
        />

        <ChatBubble
          who="App"
          bgClass={bubbleClass("app")}
          text={app2}
          subtext={pinyinForLine(app2)}
          onSpeak={() => speak(app2, languageToTTS(language))}
        />

        <LearnerSpeakBubble
          bubbleClass={bubbleClass("learner", "learner2")}
          text={learner2}
          subtext={pinyinForLine(learner2)}
          status={statusByKey["learner2"] ?? "idle"}
          isDone={correctSet.has("learner2")}
          isSkipped={skippedSet.has("learner2")}
          activeKey={activeKey}
          myKey="learner2"
          onHear={() => speak(learner2, languageToTTS(language))}
          onStart={() => startListening("learner2", learner2)}
          onStop={stopListening}
          onSkip={() => { setStatusByKey((p) => ({ ...p, ["learner2"]: "skipped" })); onSkip("learner2"); }}
          heardText={heardByKey["learner2"]}
          hint={lineHint(learner2)}
        />

        {learner3 ? (
          <LearnerSpeakBubble
            bubbleClass={bubbleClass("learner", "learner3")}
            text={learner3}
            subtext={pinyinForLine(learner3)}
            status={statusByKey["learner3"] ?? "idle"}
            isDone={correctSet.has("learner3")}
            isSkipped={skippedSet.has("learner3")}
            activeKey={activeKey}
            myKey="learner3"
            onHear={() => speak(learner3, languageToTTS(language))}
            onStart={() => startListening("learner3", learner3)}
            onStop={stopListening}
            onSkip={() => { setStatusByKey((p) => ({ ...p, ["learner3"]: "skipped" })); onSkip("learner3"); }}
            heardText={heardByKey["learner3"]}
            hint={lineHint(learner3)}
          />
        ) : null}

        {app3 ? (
          <ChatBubble
            who="App"
            bgClass={bubbleClass("app")}
            text={app3}
            subtext={pinyinForLine(app3)}
            onSpeak={() => speak(app3, languageToTTS(language))}
          />
        ) : null}
      </div>
    </div>
  );
}

function ChatBubble({
  who,
  text,
  subtext,
  onSpeak,
  bgClass
}: {
  who: string;
  text: string;
  subtext?: string;
  onSpeak: () => void;
  bgClass: string;
}) {
  const isApp = who === "App";
  return (
    <div className={`flex ${isApp ? "justify-start" : "justify-end"}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${bgClass}`}>
        <div className="flex items-center justify-between gap-3">
          <div className={`font-extrabold ${isApp ? "text-gray-800" : ""}`}>{text}</div>
          <button onClick={onSpeak} className={`p-2 rounded-xl ${isApp ? "bg-gray-100" : "bg-white/20"}`} title="Hear it">
            <Volume2 size={16} />
          </button>
        </div>

        {(subtext ?? "").trim() ? (
          <div className={`mt-1 text-xs font-bold ${isApp ? "text-gray-500" : "text-white/80"}`}>
            ({subtext})
          </div>
        ) : null}

        <div className="mt-2 text-xs font-extrabold uppercase tracking-wide text-gray-400">Tap to hear</div>
      </div>
    </div>
  );
}

function LearnerSpeakBubble({
  bubbleClass,
  text,
  subtext,
  status,
  isDone,
  isSkipped,
  activeKey,
  myKey,
  onHear,
  onStart,
  onStop,
  onSkip,
  heardText,
  hint
}: {
  bubbleClass: string;
  text: string;
  subtext?: string;
  status: SayStatus;
  isDone: boolean;
  isSkipped?: boolean;
  activeKey: string | null;
  myKey: string;
  onHear: () => void;
  onStart: () => void;
  onStop: () => void;
  onSkip: () => void;
  heardText?: string;
  hint: string;
}) {
  const isListening = status === "listening";
  const isWrong = status === "wrong";
  const canStart = activeKey === null || activeKey === myKey;

  return (
    <div className="flex justify-end">
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${bubbleClass}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="font-extrabold">{text}</div>

          <div className="flex items-center gap-2">
            <button onClick={onHear} className="p-2 rounded-xl bg-white/20" title="Hear it">
              <Volume2 size={16} />
            </button>

            {!isDone ? (
              <>
                <button
                  onClick={onStart}
                  disabled={!canStart}
                  className={`px-3 py-2 rounded-xl font-extrabold flex items-center gap-2 ${
                    isListening ? "bg-white/20" : "bg-white/20"
                  } ${!canStart ? "opacity-60 cursor-not-allowed" : ""}`}
                  title="Start speaking"
                >
                  <Mic size={16} />
                  {isListening ? "Listening..." : "Say"}
                </button>

                <button
                  onClick={onStop}
                  disabled={!isListening}
                  className={`px-3 py-2 rounded-xl font-extrabold flex items-center gap-2 ${
                    isListening ? "bg-white/20" : "bg-white/10 opacity-60 cursor-not-allowed"
                  }`}
                  title="Stop"
                >
                  <Square size={16} />
                </button>
                {status !== "skipped" && !isSkipped && (
                  <button
                    onClick={onSkip}
                    className="px-3 py-2 rounded-xl font-extrabold flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white"
                    title="Skip speaking if having mic issues"
                  >
                    Skip
                  </button>
                )}
              </>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/20 font-extrabold">
                <CheckCircle2 size={18} />
                Correct
              </div>
            )}
          </div>
        </div>

        {(subtext ?? "").trim() ? (
          <div className="mt-1 text-xs font-bold text-white/80">({subtext})</div>
        ) : null}

        {heardText ? <div className="mt-2 text-xs font-extrabold text-white/90">You said: “{heardText}”</div> : null}

        {isWrong ? (
          <div className="mt-2 p-2 rounded-xl bg-white/15">
            <div className="text-xs font-extrabold uppercase tracking-wide text-white/90">Try again</div>
            <div className="text-sm font-bold text-white">{hint}</div>
          </div>
        ) : null}

        {(status === "skipped" || isSkipped) && !isDone ? (
          <div className="mt-2 p-2 rounded-xl bg-white/15 border border-yellow-400">
            <div className="text-xs font-extrabold uppercase tracking-wide text-yellow-200">⚠️ Skipped</div>
            <div className="text-xs font-bold text-white">Retry required to advance</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ---------------- Step 6: Fill Blank ---------------- */

function Step6FillBlank({
  step,
  language,
  onProgress
}: {
  step: { pairsByLanguage: Record<LangCode, { left: string; right: string }[]> };
  language: LangCode;
  onProgress: (count: number) => void;
}) {
  const pairs = step.pairsByLanguage[language] ?? [];

  type LeftCard = { id: string; word: string; correctRightId: string };
  type RightCard = { id: string; sentence: string; correctWord: string };

  const zhPinyinWord: Record<string, string> = {
    "你好": "Nǐ hǎo",
    "嗨": "Hāi",
    "我叫": "Wǒ jiào",
    "你": "Nǐ",
    "叫什么": "jiào shénme",
    "名字": "míngzì",
    "很高兴": "Hěn gāoxìng",
    "认识": "rènshi"
  };

  const pinyinForWord = (w: string) => {
    if (language !== "zh") return "";
    return zhPinyinWord[(w ?? "").trim()] ?? "";
  };

  const pinyinForSentence = (sentence: string) => {
    if (language !== "zh") return "";
    const raw = (sentence ?? "").trim();
    if (!raw) return "";

    const cleaned = raw.replace("____", "").replaceAll("！", "").replaceAll("。", "").replaceAll("？", "").trim();
    const parts = cleaned.split(/\s+/).filter(Boolean);

    const mapped = parts.map((tok) => zhPinyinWord[tok] ?? "");
    const joined = mapped.filter(Boolean).join(" ");
    return joined;
  };

  const leftCards: LeftCard[] = useMemo(
    () =>
      pairs.map((p, idx) => ({
        id: `L-${idx}`,
        word: p.left,
        correctRightId: `R-${idx}`
      })),
    [pairs]
  );

  const rightCards: RightCard[] = useMemo(
    () =>
      pairs.map((p, idx) => ({
        id: `R-${idx}`,
        sentence: p.right,
        correctWord: p.left
      })),
    [pairs]
  );

  const shuffledLeft = useMemo(() => shuffle(leftCards), [leftCards]);
  const shuffledRight = useMemo(() => shuffle(rightCards), [rightCards]);

  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [wrongFlash, setWrongFlash] = useState<{ leftId: string; rightId: string } | null>(null);

  useEffect(() => {
    onProgress(Object.keys(matches).length);
  }, [matches, onProgress]);

  const isLeftMatched = (leftId: string) => matches[leftId] != null;
  const isRightMatched = (rightId: string) => Object.values(matches).includes(rightId);

  const leftById = useMemo(() => {
    const m = new Map<string, LeftCard>();
    leftCards.forEach((c) => m.set(c.id, c));
    return m;
  }, [leftCards]);

  const speakWord = (word: string) => speak(word, languageToTTS(language));

  const speakBlankSentence = (right: RightCard) => {
    const spoken = right.sentence.includes("____") ? right.sentence.replace("____", right.correctWord) : right.sentence;
    speak(spoken, languageToTTS(language));
  };

  const clickLeft = (left: LeftCard) => {
    if (isLeftMatched(left.id)) return;
    setSelectedLeftId(left.id);
  };

  const clickRight = (right: RightCard) => {
    if (!selectedLeftId) return;
    if (isRightMatched(right.id)) return;

    const left = leftById.get(selectedLeftId);
    if (!left) return;

    if (left.correctRightId === right.id) {
      setMatches((prev) => ({ ...prev, [left.id]: right.id }));
      setSelectedLeftId(null);
      setWrongFlash(null);
      return;
    }

    const flash = { leftId: left.id, rightId: right.id };
    setWrongFlash(flash);
    setSelectedLeftId(null);

    window.setTimeout(() => {
      setWrongFlash((curr) => (curr && curr.leftId === flash.leftId && curr.rightId === flash.rightId ? null : curr));
    }, 900);
  };

  const leftClass = (leftId: string) => {
    if (isLeftMatched(leftId)) return "bg-green-50 border-green-200";
    if (wrongFlash?.leftId === leftId) return "bg-red-50 border-red-200";
    if (selectedLeftId === leftId) return "bg-purple-50 border-purple-200";
    return "bg-white border-gray-200 hover:bg-gray-50";
  };

  const rightClass = (rightId: string) => {
    if (isRightMatched(rightId)) return "bg-green-50 border-green-200";
    if (wrongFlash?.rightId === rightId) return "bg-red-50 border-red-200";
    return "bg-[#F7FAFF] border-blue-100 hover:bg-[#EEF4FF]";
  };

  const renderBlank = (sentence: string) => sentence.replace("____", "_____");

  return (
    <div className="space-y-4">
      <div className="text-sm font-bold text-gray-600">
        Tap a <span className="text-gray-900">word</span> on the left, then tap the sentence on the right where it belongs.
        <br />✅ Green = correct, ❌ Red = try again. 🔊 optional.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-3">
          <div className="text-xs font-extrabold text-gray-500 uppercase tracking-wide">Words</div>
          {shuffledLeft.map((c: LeftCard) => {
            const py = pinyinForWord(c.word);
            return (
              <div
                key={c.id}
                className={[
                  "w-full rounded-2xl p-4 border shadow-sm transition-colors flex items-center justify-between gap-3",
                  leftClass(c.id)
                ].join(" ")}
              >
                <button
                  onClick={() => clickLeft(c)}
                  disabled={isLeftMatched(c.id)}
                  className="flex-1 text-left"
                >
                  <div className="font-heading font-extrabold text-xl text-gray-800">{c.word}</div>
                  {py ? <div className="mt-1 text-xs font-bold text-gray-500">({py})</div> : null}
                </button>

                <button onClick={() => speakWord(c.word)} className="p-2 rounded-xl bg-white border border-gray-100 hover:bg-gray-50" title="Hear word">
                  <Volume2 size={18} className="text-gray-700" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          <div className="text-xs font-extrabold text-gray-500 uppercase tracking-wide">Sentences</div>
          {shuffledRight.map((c: RightCard) => {
            const py = pinyinForSentence(c.sentence);
            return (
              <div
                key={c.id}
                className={[
                  "w-full rounded-2xl p-4 border shadow-sm transition-colors flex items-center justify-between gap-3",
                  rightClass(c.id)
                ].join(" ")}
              >
                <button
                  onClick={() => clickRight(c)}
                  disabled={isRightMatched(c.id)}
                  className="flex-1 text-left"
                >
                  <div className="font-bold text-gray-800">{renderBlank(c.sentence)}</div>
                  {py ? <div className="mt-1 text-xs font-bold text-gray-500">({py})</div> : null}
                </button>

                <button onClick={() => speakBlankSentence(c)} className="p-2 rounded-xl bg-white border border-gray-100 hover:bg-gray-50" title="Hear sentence">
                  <Volume2 size={18} className="text-gray-700" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-sm font-extrabold text-gray-700">
        Matched: {Object.keys(matches).length}/{pairs.length}
      </div>
    </div>
  );
}

/* ---------------- Step 7: Assessment ---------------- */

function StepAssessment({
  step,
  language,
  name
}: {
  step: { tasksByLanguage: Record<LangCode, string[]> };
  language: LangCode;
  name: string;
}) {
  const tasks = step.tasksByLanguage[language].map((t) => t.replace("{name}", name));
  return (
    <div className="space-y-5">
      <div className="bg-[#F7FAFF] border border-blue-100 rounded-2xl p-6">
        <div className="text-sm font-extrabold text-gray-500 uppercase tracking-wide">Tasks</div>
        <ul className="mt-4 space-y-3">
          {tasks.map((t, i) => (
            <li key={i} className="flex items-center justify-between gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3">
              <span className="font-bold text-gray-800">{t}</span>
              <button onClick={() => speak(t.replace("Say: ", ""), languageToTTS(language))} className="p-2 rounded-xl bg-gray-100" title="Hear it">
                <Volume2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center font-heading font-black text-2xl text-gray-800">Great job! 🎉</div>
    </div>
  );
}
