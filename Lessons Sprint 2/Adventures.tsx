import React from 'react';
import { motion } from 'framer-motion';
import { Map, Star, Lock, ArrowRight, Globe, Zap, Sparkles } from 'lucide-react';

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

interface AdventuresProps {
  onStartLesson: (lessonId: LessonId) => void;
}

const Adventures: React.FC<AdventuresProps> = ({ onStartLesson }) => {
  const stage1Adventures = [
    {
      id: 'spanish-temple',
      lessonId: 'lesson-01' as LessonId,
      title: 'Level 1: Start your Adventure',
      language: 'English/Spanish/Mandarin',
      level: 1,
      description: 'Learn how to greet and introduce yourself!',
      color: 'from-orange-400 to-red-500',
      icon: Map,
      locked: false,
    },
    {
      id: 'neon-city',
      lessonId: 'lesson-02' as LessonId,
      title: 'Level 2: Mood Mission',
      language: 'English/Spanish/Mandarin',
      level: 2,
      description: 'Learn how to ask and answer: How are you?',
      color: 'from-purple-400 to-pink-500',
      icon: Zap,
      locked: false,
    },
    {
      id: 'colors-world',
      lessonId: 'lesson-03' as LessonId,
      title: 'Level 3: Color Quest',
      language: 'English/Spanish/Mandarin',
      level: 3,
      description: 'Learn common colors in three languages.',
      color: 'from-blue-400 to-indigo-500',
      icon: Globe,
      locked: false,
    },
    {
      id: 'family-world',
      lessonId: 'lesson-04' as LessonId,
      title: 'Level 4: Family Friends',
      language: 'English/Spanish/Mandarin',
      level: 4,
      description: 'Learn how to talk about family members.',
      color: 'from-emerald-400 to-teal-600',
      icon: Sparkles,
      locked: false,
    },
    {
      id: 'food-world',
      lessonId: 'lesson-05' as LessonId,
      title: 'Level 5: Food Fiesta',
      language: 'English/Spanish/Mandarin',
      level: 5,
      description: 'Practice basic food and drink vocabulary.',
      color: 'from-pink-400 to-rose-500',
      icon: Star,
      locked: false,
    },
    {
      id: 'animals-world',
      lessonId: 'lesson-06' as LessonId,
      title: 'Level 6: Animal Adventure',
      language: 'English/Spanish/Mandarin',
      level: 6,
      description: 'Learn common animal words in three languages.',
      color: 'from-amber-400 to-orange-500',
      icon: Star,
      locked: false,
    },
    {
      id: 'numbers-world',
      lessonId: 'lesson-07' as LessonId,
      title: 'Level 7: Number Quest',
      language: 'English/Spanish/Mandarin',
      level: 7,
      description: 'Practice counting and simple number words.',
      color: 'from-cyan-400 to-blue-500',
      icon: Globe,
      locked: false,
    },
    {
      id: 'school-world',
      lessonId: 'lesson-08' as LessonId,
      title: 'Level 8: School Mission',
      language: 'English/Spanish/Mandarin',
      level: 8,
      description: 'Learn common school objects and sentences.',
      color: 'from-violet-400 to-purple-500',
      icon: Sparkles,
      locked: false,
    },
    {
      id: 'weather-world',
      lessonId: 'lesson-09' as LessonId,
      title: 'Level 9: Weather Watch',
      language: 'English/Spanish/Mandarin',
      level: 9,
      description: 'Learn simple weather words and weather sentences.',
      color: 'from-sky-400 to-cyan-500',
      icon: Globe,
      locked: false,
    },
    {
      id: 'feelings2-world',
      lessonId: 'lesson-10' as LessonId,
      title: 'Level 10: Feeling Finder',
      language: 'English/Spanish/Mandarin',
      level: 10,
      description: 'Practice more feelings and emotions in three languages.',
      color: 'from-rose-400 to-pink-500',
      icon: Sparkles,
      locked: false,
    },
  ];

  const stage2Adventures = [
    {
      id: 'lesson-11-world',
      lessonId: 'lesson-11' as LessonId,
      title: 'Level 11: Greetings Plus',
      language: 'English/Spanish/Mandarin',
      level: 11,
      description: 'Build on greetings with more polite and natural phrases.',
      color: 'from-lime-400 to-green-500',
      icon: Map,
      locked: false,
    },
    {
      id: 'lesson-12-world',
      lessonId: 'lesson-12' as LessonId,
      title: 'Level 12: Feelings Plus',
      language: 'English/Spanish/Mandarin',
      level: 12,
      description: 'Learn more ways to describe how you feel.',
      color: 'from-fuchsia-400 to-purple-500',
      icon: Zap,
      locked: false,
    },
    {
      id: 'lesson-13-world',
      lessonId: 'lesson-13' as LessonId,
      title: 'Level 13: Color Quest Plus',
      language: 'English/Spanish/Mandarin',
      level: 13,
      description: 'Build on color vocabulary with new colors.',
      color: 'from-indigo-400 to-violet-500',
      icon: Globe,
      locked: false,
    },
    {
      id: 'lesson-14-world',
      lessonId: 'lesson-14' as LessonId,
      title: 'Level 14: Family Friends Plus',
      language: 'English/Spanish/Mandarin',
      level: 14,
      description: 'Expand family vocabulary with extended family.',
      color: 'from-emerald-400 to-green-600',
      icon: Sparkles,
      locked: false,
    },
    {
      id: 'lesson-15-world',
      lessonId: 'lesson-15' as LessonId,
      title: 'Level 15: Food Fiesta Plus',
      language: 'English/Spanish/Mandarin',
      level: 15,
      description: 'Add more foods and drinks to what you already know.',
      color: 'from-orange-400 to-amber-500',
      icon: Star,
      locked: false,
    },
    {
      id: 'lesson-16-world',
      lessonId: 'lesson-16' as LessonId,
      title: 'Level 16: Animal Adventure Plus',
      language: 'English/Spanish/Mandarin',
      level: 16,
      description: 'Learn new animals and extend your animal sentences.',
      color: 'from-yellow-400 to-orange-500',
      icon: Star,
      locked: false,
    },
    {
      id: 'lesson-17-world',
      lessonId: 'lesson-17' as LessonId,
      title: 'Level 17: Number Quest Plus',
      language: 'English/Spanish/Mandarin',
      level: 17,
      description: 'Continue counting with bigger numbers.',
      color: 'from-cyan-400 to-blue-500',
      icon: Globe,
      locked: false,
    },
    {
      id: 'lesson-18-world',
      lessonId: 'lesson-18' as LessonId,
      title: 'Level 18: School Mission Plus',
      language: 'English/Spanish/Mandarin',
      level: 18,
      description: 'Expand school vocabulary with more classroom words.',
      color: 'from-violet-400 to-fuchsia-500',
      icon: Sparkles,
      locked: false,
    },
    {
      id: 'lesson-19-world',
      lessonId: 'lesson-19' as LessonId,
      title: 'Level 19: Weather Watch Plus',
      language: 'English/Spanish/Mandarin',
      level: 19,
      description: 'Learn more weather words and describe the weather better.',
      color: 'from-sky-400 to-blue-500',
      icon: Globe,
      locked: false,
    },
    {
      id: 'lesson-20-world',
      lessonId: 'lesson-20' as LessonId,
      title: 'Level 20: Feeling Finder Plus',
      language: 'English/Spanish/Mandarin',
      level: 20,
      description: 'Expand emotion vocabulary and build richer feeling sentences.',
      color: 'from-pink-400 to-purple-500',
      icon: Sparkles,
      locked: false,
    },
  ];

  const renderAdventureCard = (adventure: any, index: number) => (
    <motion.div
      key={adventure.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05 }}
      className={`relative group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
        adventure.locked ? 'opacity-80 grayscale-[0.8]' : 'cursor-pointer'
      }`}
    >
      <div className={`h-40 bg-gradient-to-br ${adventure.color} p-6 relative overflow-hidden`}>
        <div className="relative z-10 flex justify-between items-start">
          <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl text-white shadow-inner">
            <adventure.icon size={32} />
          </div>

          {adventure.locked ? (
            <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white flex items-center gap-1 text-xs font-bold">
              <Lock size={12} />
              Lvl {adventure.level}
            </div>
          ) : (
            <div className="bg-white/30 backdrop-blur-md px-3 py-1 rounded-full text-white flex items-center gap-1 text-xs font-bold animate-pulse">
              <Star size={12} className="fill-current" />
              Open
            </div>
          )}
        </div>
      </div>

      <div className="p-8">
        <span className="text-xs font-extrabold uppercase py-1 px-2 rounded-md bg-gray-100 text-gray-500">
          {adventure.language}
        </span>

        <h3 className="font-heading font-bold text-2xl text-gray-800 mt-3 mb-3">
          {adventure.title}
        </h3>

        <p className="text-gray-500 font-medium mb-8 text-sm leading-relaxed">
          {adventure.description}
        </p>

        <button
          onClick={
            adventure.locked
              ? undefined
              : () => {
                  if ('lessonId' in adventure) {
                    onStartLesson(adventure.lessonId);
                  }
                }
          }
          disabled={adventure.locked}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            adventure.locked
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-primary'
          }`}
        >
          {adventure.locked ? (
            <>
              <Lock size={16} /> Locked
            </>
          ) : (
            <>
              Start Journey
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen pt-32 px-4 pb-20 bg-[#F0F4F8]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-4 px-4 py-1 bg-white rounded-full shadow-sm text-primary font-bold text-sm uppercase tracking-wide"
          >
            World Map
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading font-black text-4xl md:text-5xl text-gray-800 mb-6"
          >
            Choose Your Adventure
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Embark on magical journeys to master new languages. Pick a world and start your quest today!
          </motion.p>
        </div>

        <div className="space-y-16">
          <div>
            <div className="mb-8">
              <div className="inline-block px-6 py-3 rounded-2xl bg-green-100 text-green-800 font-black text-3xl shadow-sm">
                STAGE 1
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stage1Adventures.map((adventure, index) => renderAdventureCard(adventure, index))}
            </div>
          </div>

          <div>
            <div className="mb-8">
              <div className="inline-block px-6 py-3 rounded-2xl bg-purple-100 text-purple-800 font-black text-3xl shadow-sm">
                STAGE 2
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stage2Adventures.map((adventure, index) => renderAdventureCard(adventure, index))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adventures;
