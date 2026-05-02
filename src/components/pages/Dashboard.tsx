import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TurtlePet from '../pet/TurtlePet';
import { usePet } from '../../context/PetContext';
import { useProgress } from '../../context/ProgressContext';
import BadgeGraphic, { BADGE_TIERS } from '../common/BadgeGraphic';

interface DashboardProps {
  onLessons?:   () => void;
  onMinigames: () => void;
}

const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: any = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
};



export const Dashboard: React.FC<DashboardProps> = ({ onLessons, onMinigames }) => {
  const { stars, coins, level, streak, weeklyGoalPercent } = useProgress();
  const stats = { coins }; // Quick shim for the stats logic below
  const { mood, message, feed, encourage, greet, sleep, wake } = usePet();
  const [pose, setPose] = useState<'front' | 'meditate'>('front');

  const quickStats = [
    { icon: '⭐', value: stars.toLocaleString(), label: 'Stars',       color: '#F59E0B' },
    { icon: '🪙', value: (stats?.coins || 0).toLocaleString(), label: 'Coins', color: '#FCD34D' },
    { icon: '🔥', value: streak.toString(),    label: 'Day Streak',  color: '#F97316' },
    { icon: '🏆', value: `Lv ${level}`,  label: 'Level',       color: '#7C3AED' },
    { icon: '🎯', value: `${weeklyGoalPercent}%`,   label: 'Weekly Goal', color: '#10B981' },
  ];

  const handleFeed = () => feed();
  const handlePlay = () => encourage();
  const handlePetClick = () => greet();

  const handleRest = () => {
    if (pose === 'meditate') {
      setPose('front');
      wake();
    } else {
      setPose('meditate');
      sleep();
    }
  };

  const todayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: '#DDD6FE' }} />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: '#FDE68A' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: '#A7F3D0' }} />

      <motion.div
        className="max-w-7xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Greeting */}
        <motion.div variants={itemVariants} className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-heading font-bold text-4xl text-amber-50">
              Welcome back, Explorer!
            </h1>
            <p className="font-body text-purple-200 mt-1">Ready to continue your language adventure?</p>
          </div>
          <div
            className="hidden md:flex items-center gap-3 px-5 py-3 rounded-2xl font-body font-bold text-sm"
            style={{ background: 'rgba(124,58,237,0.08)', border: '2px solid rgba(124,58,237,0.15)', color: '#7C3AED' }}
          >
            <span>📅</span> {todayName} — Day {streak} of streak!
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {quickStats.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white rounded-2xl p-5 flex items-center gap-4"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${stat.color}18` }}
              >
                {stat.icon}
              </div>
              <div>
                <div className="font-heading font-bold text-2xl" style={{ color: stat.color }}>{stat.value}</div>
                <div className="font-body text-gray-500 text-xs">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-12 gap-6">

          {/* Activity islands — left */}
          <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-6">

            {/* Lessons card */}
            <motion.button
              onClick={onLessons}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden rounded-[2rem] text-left p-7 focus:outline-none flex-1"
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #A855F7, #C084FC)',
                boxShadow: '0 12px 40px rgba(124,58,237,0.4)',
                minHeight: 180,
              }}
            >
              <div className="absolute top-5 right-5 px-3 py-1 rounded-full font-heading font-bold text-xs text-white" style={{ background: '#F59E0B' }}>
                NEW
              </div>
              <div className="absolute -bottom-4 -right-4 text-[120px] opacity-10 select-none pointer-events-none">📚</div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl mb-4 border border-white/20">
                  📚
                </div>
                <h3 className="font-heading font-bold text-2xl text-white mb-1">Lessons</h3>
                <p className="font-body text-white/75 text-sm">Explore Language Lessons</p>
              </div>
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/5 rounded-t-[2rem]" />
            </motion.button>

            {/* Minigames card */}
            <motion.button
              onClick={onMinigames}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden rounded-[2rem] text-left p-7 focus:outline-none flex-1"
              style={{
                background: 'linear-gradient(135deg, #0EA5E9, #38BDF8, #7DD3FC)',
                boxShadow: '0 12px 40px rgba(14,165,233,0.4)',
                minHeight: 180,
              }}
            >
              <div className="absolute top-5 right-5 px-3 py-1 rounded-full font-heading font-bold text-xs text-white" style={{ background: '#F43F5E' }}>
                HOT
              </div>
              <div className="absolute -bottom-4 -right-4 text-[120px] opacity-10 select-none pointer-events-none">🎮</div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl mb-4 border border-white/20">
                  🎮
                </div>
                <h3 className="font-heading font-bold text-2xl text-white mb-1">Mini Games</h3>
                <p className="font-body text-white/75 text-sm">Play and earn XP!</p>
              </div>
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/5 rounded-t-[2rem]" />
            </motion.button>
          </motion.div>

          {/* Pet island — center */}
          <motion.div variants={itemVariants} className="lg:col-span-5">
            <div
              className="relative rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-between"
              style={{
                background: 'linear-gradient(160deg, #EDE9FE 0%, #FDF4FF 60%, #E0F2FE 100%)',
                boxShadow: '0 20px 60px rgba(124,58,237,0.15)',
                minHeight: 420,
                border: '3px solid rgba(167,139,250,0.3)',
              }}
            >
              {/* Cloud decorations */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white/70"
                  style={{
                    width:  80 + i * 40,
                    height: 35 + i * 15,
                    left:  `${15 + i * 28}%`,
                    top:   `${8 + i * 5}%`,
                  }}
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i }}
                />
              ))}

              {/* Mood badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-8 right-8 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm flex items-center gap-2 border border-white"
              >
                <span className="text-xl">🐢</span>
                <span className="font-heading font-bold text-gray-700 text-sm">Feeling {mood}!</span>
              </motion.div>

              {/* Character */}
              <div className="flex-1 flex items-center justify-center mt-12 mb-4">
                <TurtlePet pose={pose} onPetClick={handlePetClick} />
              </div>

              {/* Interaction buttons */}
              <div className="flex gap-3 mb-8">
                <motion.button onClick={handleFeed} whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }} className="bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2 text-sm font-bold font-heading text-emerald-600">
                  🥬 Feed
                </motion.button>
                <motion.button onClick={handlePlay} whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }} className="bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2 text-sm font-bold font-heading text-rose-500">
                  🎾 Play
                </motion.button>
                <motion.button onClick={handleRest} whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }} className="bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2 text-sm font-bold font-heading text-amber-500">
                  🌙 {pose === 'meditate' ? 'Wake' : 'Rest'}
                </motion.button>
              </div>

              {/* Speech bubble */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                key={message}
                className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-white px-6 py-4 rounded-[2rem] shadow-xl border-2 border-purple-100 text-center min-w-[200px]"
              >
                <p className="font-body text-gray-800 font-bold">{message}</p>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Goals island — right */}
          <motion.div variants={itemVariants} className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Weekly Goal */}
            <div className="bg-white rounded-3xl p-6" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-gray-800">Weekly Goal</h3>
                <span className="ml-auto font-heading font-bold text-emerald-600">{weeklyGoalPercent}%</span>
              </div>
              <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${weeklyGoalPercent}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
                  className="h-full rounded-full relative overflow-hidden"
                  style={{ background: 'linear-gradient(90deg, #10B981, #34D399)' }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
              <p className="font-body text-gray-400 text-xs mt-2">{Math.round((weeklyGoalPercent / 100) * 5)} of 5 activities this week</p>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-3xl p-6 flex-1" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
              <h3 className="font-heading font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🏅</span> Recent Badges
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[...Array(3)].map((_, i) => {
                  const badgeLvl = level - i;
                  if (badgeLvl <= 0) {
                     return (
                       <motion.div key={i} className="flex flex-col items-center gap-1 opacity-40">
                         <div className="w-12 h-12 rounded-[25%] bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                           <span className="text-gray-300 font-bold">?</span>
                         </div>
                         <span className="font-body text-[10px] text-gray-400 text-center leading-tight">Locked</span>
                       </motion.div>
                     );
                  }
                  
                  const name = BADGE_TIERS[Math.min(badgeLvl - 1, BADGE_TIERS.length - 1)].name;
                  return (
                    <motion.div key={i} whileHover={{ scale: 1.1 }} className="flex flex-col items-center gap-2">
                      <BadgeGraphic level={badgeLvl} size={48} />
                      <span className="font-body text-[10px] text-gray-600 font-bold text-center leading-tight px-1">{name}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Daily challenge CTA */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onLessons}
              className="relative overflow-hidden rounded-3xl p-5 text-left w-full focus:outline-none"
              style={{
                background: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
                boxShadow: '0 8px 0 #B45309',
              }}
            >
              <div className="absolute right-0 top-0 text-7xl opacity-20 -mr-3 -mt-2 select-none pointer-events-none">⚡</div>
              <div className="relative z-10">
                <div className="font-heading font-bold text-white text-lg">Daily Challenge!</div>
                <div className="font-body text-amber-100 text-sm">Complete to earn 20 ⭐</div>
              </div>
            </motion.button>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
