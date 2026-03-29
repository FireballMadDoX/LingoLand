import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft } from 'lucide-react';
import DinoRun from './dino-run/Game';
import FlappyBee from './flappy-bee/Game';
import { useProgress } from '../../context/ProgressContext';

interface MiniGamesHubProps {
    onBack: () => void;
}

type GameType = 'dino' | 'bee' | 'memory' | 'puzzle' | 'drawing' | null;

const games = [
    {
        id: 'dino',
        name: 'Dino Run',
        description: 'Run and jump over obstacles!',
        gradient: 'linear-gradient(135deg, #34D399, #059669)',
        glow: 'rgba(52,211,153,0.35)',
        icon: '🦖',
        locked: false,
    },
    {
        id: 'bee',
        name: 'Flappy Bee',
        description: 'Buzz through the honey pipes!',
        gradient: 'linear-gradient(135deg, #FBBF24, #D97706)',
        glow: 'rgba(251,191,36,0.35)',
        icon: '🐝',
        locked: false,
    },
    {
        id: 'memory',
        name: 'Memory Match',
        description: 'Find matching pairs of cards.',
        gradient: 'linear-gradient(135deg, #60A5FA, #2563EB)',
        glow: 'rgba(96,165,250,0.25)',
        icon: '🎴',
        locked: true,
    },
    {
        id: 'puzzle',
        name: 'Word Puzzle',
        description: 'Find the hidden words.',
        gradient: 'linear-gradient(135deg, #A78BFA, #7C3AED)',
        glow: 'rgba(167,139,250,0.25)',
        icon: '🧩',
        locked: true,
    },
    {
        id: 'drawing',
        name: 'Magic Paint',
        description: 'Draw your own masterpiece.',
        gradient: 'linear-gradient(135deg, #F472B6, #DB2777)',
        glow: 'rgba(244,114,182,0.25)',
        icon: '🎨',
        locked: true,
    },
];

const MiniGamesHub: React.FC<MiniGamesHubProps> = ({ onBack }) => {
    const [activeGame, setActiveGame] = useState<GameType>(null);
    const { addStars, incrementActivity } = useProgress();

    const handleGameOver = () => {
        addStars(10); // Games award 10 stars (half of a lesson)
        incrementActivity();
    };

    if (activeGame === 'dino') return <DinoRun onExit={() => setActiveGame(null)} onGameOver={handleGameOver} />;
    if (activeGame === 'bee')  return <FlappyBee onExit={() => setActiveGame(null)} onGameOver={handleGameOver} />;

    return (
        <div
            className="min-h-screen px-6 pb-16 pt-8"
            style={{ background: 'linear-gradient(160deg, #1E1B4B 0%, #2D1B69 50%, #1E1B4B 100%)' }}
        >
            {/* Background blobs */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: '#7C3AED' }} />
            <div className="fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: '#4F46E5' }} />

            <div className="relative z-10 max-w-4xl mx-auto">

                {/* Back button */}
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={onBack}
                    className="flex items-center gap-2 text-purple-300 hover:text-white font-bold text-sm mb-6 transition-colors"
                >
                    <ArrowLeft size={18} /> Back to Dashboard
                </motion.button>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="text-5xl mb-3">🕹️</div>
                    <h1 className="font-heading font-black text-4xl text-white tracking-tight">Game Arcade</h1>
                    <p className="text-purple-300 font-body mt-2 text-base">Play games and earn XP points!</p>
                </motion.div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {games.map((game, index) => (
                        <motion.div
                            key={game.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08, type: 'spring', stiffness: 200, damping: 20 }}
                            whileHover={!game.locked ? { scale: 1.04, y: -4 } : {}}
                            whileTap={!game.locked ? { scale: 0.97 } : {}}
                            onClick={() => !game.locked && setActiveGame(game.id as GameType)}
                            className="relative overflow-hidden rounded-3xl cursor-pointer"
                            style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                backdropFilter: 'blur(12px)',
                                boxShadow: game.locked ? 'none' : `0 8px 32px ${game.glow}`,
                                opacity: game.locked ? 0.6 : 1,
                            }}
                        >
                            {/* Gradient accent bar at top */}
                            <div className="h-1 w-full" style={{ background: game.gradient }} />

                            <div className="p-6">
                                {/* Lock badge */}
                                {game.locked && (
                                    <div className="absolute top-5 right-5 bg-white/10 p-1.5 rounded-full">
                                        <Lock size={14} className="text-white/50" />
                                    </div>
                                )}

                                {/* Icon */}
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg"
                                    style={{ background: game.gradient }}
                                >
                                    {game.icon}
                                </div>

                                {/* Text */}
                                <h3 className="font-heading font-bold text-white text-xl mb-1">{game.name}</h3>
                                <p className="font-body text-purple-300 text-sm leading-snug">{game.description}</p>

                                {/* Play button */}
                                {!game.locked && (
                                    <div
                                        className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl font-heading font-bold text-sm text-white"
                                        style={{ background: game.gradient, boxShadow: `0 4px 16px ${game.glow}` }}
                                    >
                                        ▶ Play Now
                                    </div>
                                )}

                                {game.locked && (
                                    <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl font-heading font-bold text-sm text-white/30 border border-white/10">
                                        🔒 Coming Soon
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MiniGamesHub;
