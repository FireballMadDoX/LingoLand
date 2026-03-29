import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ArrowLeft, Trophy } from 'lucide-react';
import Lottie from 'lottie-react';

// Import Assets
import dinoData from './assets/Dinosaur Running.json';
import dogData from './assets/Long Dog.json';
import camelData from './assets/Baby Camel.json';
import elephantData from './assets/Walking Elephant.json';

// --- Types & Config ---
type CharacterId = 'dino' | 'dog' | 'camel' | 'elephant';

const CHARACTERS: CharacterConfig[] = [
    { id: 'dino',     name: 'King Stompy Feet',    data: dinoData,     scale: 1.5, yOffset: -25, width: 100, flip: false },
    { id: 'dog',      name: 'Duke of Zoomies',     data: dogData,      scale: 1.5, yOffset: -15, width: 110, flip: false },
    { id: 'camel',    name: 'Prince Spits-a-Lot',  data: camelData,    scale: 1.4, yOffset: -5,  width: 100, flip: true  },
    { id: 'elephant', name: 'Empress Peanut',      data: elephantData, scale: 1.4, yOffset: -25, width: 110, flip: false },
];

interface CharacterConfig {
    id: CharacterId;
    name: string;
    data: any;
    scale: number;
    yOffset: number;
    width: number;
    flip: boolean;
}

interface DinoRunProps {
    onExit: () => void;
    onGameOver?: () => void;
}

const DinoRun: React.FC<DinoRunProps> = ({ onExit, onGameOver }) => {
    const [gameState, setGameState] = useState<'select' | 'playing' | 'gameover'>('select');
    const [selectedChar, setSelectedChar] = useState<CharacterConfig>(CHARACTERS[0]);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isJumping, setIsJumping] = useState(false);
    const [gameSpeed, setGameSpeed] = useState(2.2);

    const dinoRef = useRef<HTMLDivElement>(null);
    const obstacleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let collisionInterval: any;
        let scoreInterval: any;
        if (gameState === 'playing') {
            scoreInterval = setInterval(() => setScore(prev => prev + 1), 200);
            collisionInterval = setInterval(() => {
                const dino = dinoRef.current;
                const obstacle = obstacleRef.current;
                if (dino && obstacle) {
                    const d = dino.getBoundingClientRect();
                    const o = obstacle.getBoundingClientRect();
                    if (d.right > o.left + 10 && d.left < o.right - 10 && d.bottom > o.top + 10) {
                        handleGameOver();
                    }
                }
            }, 20);
        }
        return () => { clearInterval(scoreInterval); clearInterval(collisionInterval); };
    }, [gameState]);

    const handleGameOver = () => {
        setGameState('gameover');
        if (score > highScore) setHighScore(score);
        if (onGameOver) onGameOver();
    };

    const jump = () => {
        if (!isJumping && gameState === 'playing') {
            setIsJumping(true);
            setTimeout(() => setIsJumping(false), 300);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.code === 'Space' || e.code === 'ArrowUp') && gameState === 'playing') {
                e.preventDefault();
                jump();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState, isJumping]);

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setGameSpeed(2.2);
        setIsJumping(false);
    };

    // ── Character Select ───────────────────────────────────────────────────────
    if (gameState === 'select') {
        return (
            <div
                className="flex flex-col items-center justify-center w-full min-h-[85vh] relative select-none p-8"
                style={{ background: 'linear-gradient(160deg, #1E1B4B 0%, #2D1B69 50%, #1E1B4B 100%)' }}
            >
                {/* Decorative blobs */}
                <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: '#7C3AED' }} />
                <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: '#4F46E5' }} />

                {/* Header */}
                <div className="relative w-full max-w-5xl mb-10 px-4 flex items-center justify-center">
                    <button
                        onClick={onExit}
                        className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full text-white transition-all hover:scale-105 active:scale-95 z-50"
                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                        <div className="text-4xl mb-2">🦖</div>
                        <h2 className="font-heading text-4xl font-black text-white mb-2 tracking-tight">Choose Your Runner!</h2>
                        <p className="text-purple-300 font-body text-base">Who will set the new high score?</p>
                    </motion.div>
                </div>

                {/* Character Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-5xl px-4 relative z-10">
                    {CHARACTERS.map((char, i) => (
                        <motion.div
                            key={char.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08, type: 'spring', stiffness: 200, damping: 20 }}
                            whileHover={{ scale: 1.05, y: -6 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { setSelectedChar(char); startGame(); }}
                            className="rounded-3xl p-6 cursor-pointer flex flex-col items-center gap-4 group transition-all overflow-hidden"
                            style={{
                                background: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(12px)',
                            }}
                        >
                            <div className="w-32 h-32 flex items-center justify-center">
                                <div style={{ width: char.width, transform: char.flip ? 'scaleX(-1) scale(1.6)' : 'scale(1.6)' }}>
                                    <Lottie animationData={char.data} loop={true} />
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="font-heading font-bold text-lg text-white mb-2">{char.name}</h3>
                                <div
                                    className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                                    style={{
                                        background: 'linear-gradient(135deg, #A78BFA, #7C3AED)',
                                        color: 'white',
                                        boxShadow: '0 4px 12px rgba(167,139,250,0.4)',
                                    }}
                                >
                                    ▶ Select
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    // ── Main Game + Game Over ─────────────────────────────────────────────────
    return (
        <div
            className="flex flex-col items-center justify-center w-full min-h-[90vh] relative select-none py-6 px-4"
            style={{ background: 'linear-gradient(160deg, #1E1B4B 0%, #2D1B69 50%, #1E1B4B 100%)' }}
        >
            {/* Flash transition */}
            <motion.div
                initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-white z-50 pointer-events-none"
            />

            {/* HUD */}
            <div className="w-full max-w-[95%] flex justify-between items-center mb-4 z-10">
                <button
                    onClick={() => setGameState('select')}
                    className="p-2.5 rounded-full text-white transition-all hover:scale-105"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                    <ArrowLeft size={22} />
                </button>
                <div className="flex items-center gap-4">
                    {highScore > 0 && (
                        <div className="text-purple-300 font-bold text-sm px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                            🏆 Best: {highScore}
                        </div>
                    )}
                    <div className="text-4xl font-black text-white font-heading drop-shadow-md">{score}</div>
                </div>
            </div>

            {/* Game World */}
            <div
                className="relative w-full max-w-[95%] h-[460px] border-b-[10px] border-[#5D4037] shadow-2xl cursor-pointer rounded-3xl overflow-hidden"
                onClick={() => jump()}
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
            >
                {/* Sky background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] to-[#E0F7FA] overflow-hidden">
                    <div className="absolute top-10 right-20 w-16 h-16 bg-yellow-300 rounded-full blur-[2px] shadow-[0_0_40px_rgba(253,224,71,0.6)] animate-pulse" />
                    <div className="absolute top-5 left-0 w-[200%] h-full animate-clouds opacity-80" style={{ animationDuration: '60s' }}>
                        <Cloud size={80} x="10%" />
                        <Cloud size={50} x="50%" />
                        <Cloud size={90} x="85%" />
                    </div>
                    <div className="absolute top-20 left-0 w-[200%] h-full animate-clouds opacity-40" style={{ animationDuration: '30s' }}>
                        <Cloud size={40} x="20%" />
                        <Cloud size={60} x="60%" />
                    </div>
                    <div className="absolute bottom-0 w-[200%] h-48 bg-[#aed581] opacity-80 rounded-t-[100px] animate-hills" style={{ animationDuration: '20s' }} />
                    <div className="absolute -bottom-10 w-[200%] h-40 bg-[#c5e1a5] opacity-90 rounded-t-[150px] animate-hills" style={{ animationDuration: '15s', animationDelay: '-5s' }} />
                </div>

                {/* Character hitbox */}
                <div
                    ref={dinoRef}
                    className="absolute left-20 z-20"
                    style={{
                        bottom: isJumping ? '260px' : '0px',
                        transition: `bottom ${isJumping ? '300ms ease-out' : '300ms ease-in'}`,
                        width: '60px', height: '60px',
                    }}
                >
                    <div style={{
                        position: 'absolute', bottom: -5, left: -40, width: '180px',
                        transform: `translateY(${-selectedChar.yOffset}px) scale(1.5) ${selectedChar.flip ? 'scaleX(-1)' : 'none'}`,
                        pointerEvents: 'none',
                    }}>
                        <Lottie animationData={selectedChar.data} loop={gameState === 'playing'} />
                    </div>
                </div>

                {/* Obstacle */}
                {gameState === 'playing' && (
                    <div
                        ref={obstacleRef}
                        className="absolute bottom-0 right-[-100px] w-12 h-16 z-20 flex items-end justify-center"
                        style={{ animation: `moveObstacle ${gameSpeed}s linear infinite` }}
                    >
                        <div className="absolute bottom-0 text-7xl filter drop-shadow-md transform -scale-x-100 leading-[0.8] origin-bottom">🌵</div>
                    </div>
                )}

                {/* Game Over overlay */}
                {gameState === 'gameover' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-40">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="p-10 rounded-3xl text-center max-w-sm w-full mx-4 relative"
                            style={{
                                background: 'rgba(30,27,75,0.95)',
                                border: '1px solid rgba(167,139,250,0.4)',
                                backdropFilter: 'blur(20px)',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                            }}
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #FBBF24, #D97706)' }}>
                                <Trophy className="text-white" size={32} />
                            </div>
                            <h2 className="text-4xl font-black text-white mt-6 mb-1 font-heading">Ouch! 😵</h2>
                            <p className="text-purple-300 font-bold text-lg mb-6">Score: <span className="text-white text-3xl">{score}</span></p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={startGame}
                                    className="w-full text-white font-heading font-black text-xl py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition-transform hover:scale-105"
                                    style={{ background: 'linear-gradient(135deg, #34D399, #059669)', boxShadow: '0 6px 20px rgba(52,211,153,0.4)' }}
                                >
                                    <RotateCcw size={22} strokeWidth={3} /> Try Again
                                </button>
                                <button
                                    onClick={() => setGameState('select')}
                                    className="text-purple-400 font-bold hover:text-purple-200 transition-colors py-2 text-sm"
                                >
                                    ← Pick New Character
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>

            {/* Footer hint */}
            <div className="w-full max-w-[95%] mt-4 flex justify-between items-center px-4 py-3 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-2 text-purple-300 font-body font-bold text-sm">
                    <span className="px-2 py-0.5 rounded-md text-xs font-mono text-white" style={{ background: 'rgba(255,255,255,0.15)' }}>SPACE</span>
                    to Jump
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400 font-bold text-sm">SPEED: {Math.max(1, Math.round((2.5 - gameSpeed) * 10))}x</span>
                </div>
            </div>

            <style>{`
                @keyframes moveObstacle {
                    0% { right: -100px; }
                    100% { right: 100%; }
                }
                .animate-clouds { animation: moveClouds 20s linear infinite; }
                @keyframes moveClouds {
                    from { transform: translateX(0); }
                    to { transform: translateX(-100%); }
                }
                .animate-hills { animation: moveHills 20s linear infinite; }
                @keyframes moveHills {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
};

const Cloud = ({ size, x }: { size: number; x: string }) => (
    <div className="absolute text-white" style={{ left: x }}>
        <svg width={size} height={size * 0.6} viewBox="0 0 24 24" fill="currentColor">
            <path d="M5.5 12C3.567 12 2 13.567 2 15.5C2 17.433 3.567 19 5.5 19H18.5C20.985 19 23 16.985 23 14.5C23 12.015 20.985 10 18.5 10C18.36 10 18.221 10.009 18.085 10.026C17.65 6.643 14.757 4 11.25 4C7.355 4 4.197 7.155 4.197 11.05C4.197 11.385 4.223 11.713 4.273 12.033C4.652 12.011 5.064 12 5.5 12Z" />
        </svg>
    </div>
);

export default DinoRun;
