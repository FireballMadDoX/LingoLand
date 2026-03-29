import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ArrowLeft, Trophy } from 'lucide-react';
import Lottie from 'lottie-react';

import beeData from './assets/Flying Bee.json';

// --- Constants ---
const GAME_SPEED = 3;
const GRAVITY = 0.4;
const JUMP_STRENGTH = -6;
const MAX_FALL_SPEED = 6;
const PIPE_SPACING = 300;
const PIPE_WIDTH = 60;
const BEE_SIZE = 40;
const GAP_SIZE = 200;

interface Pipe {
    id: number;
    x: number;
    topHeight: number;
    passed: boolean;
}

interface FlappyBeeProps {
    onExit: () => void;
    onGameOver?: () => void;
}

const FlappyBee: React.FC<FlappyBeeProps> = ({ onExit, onGameOver }) => {
    const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    const beeY = useRef(250);
    const velocity = useRef(0);
    const pipes = useRef<Pipe[]>([]);
    const requestRef = useRef<number | null>(null);
    const lastTime = useRef<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [tick, setTick] = useState(0);

    const spawnPipe = (startX: number) => {
        const topHeight = Math.floor(Math.random() * (300 - 100 + 1)) + 100;
        return { id: Date.now() + Math.random(), x: startX, topHeight, passed: false };
    };

    const resetGame = () => {
        beeY.current = 250;
        velocity.current = 0;
        pipes.current = [spawnPipe(500), spawnPipe(800)];
        setScore(0);
        setGameState('playing');
        lastTime.current = performance.now();
        loop();
    };

    const gameOver = () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        setGameState('gameover');
        if (score > highScore) setHighScore(score);
        if (onGameOver) onGameOver();
    };

    const loop = () => {
        if (gameState !== 'playing') return;
        velocity.current = Math.min(velocity.current + GRAVITY, MAX_FALL_SPEED);
        beeY.current += velocity.current;

        pipes.current.forEach(p => { p.x -= GAME_SPEED; });
        if (pipes.current.length > 0 && pipes.current[0].x < -PIPE_WIDTH) pipes.current.shift();
        const lastPipe = pipes.current[pipes.current.length - 1];
        if (lastPipe && lastPipe.x < 500) pipes.current.push(spawnPipe(lastPipe.x + PIPE_SPACING));

        const containerHeight = containerRef.current?.clientHeight || 500;
        if (beeY.current > containerHeight - BEE_SIZE || beeY.current < 0) { gameOver(); return; }

        pipes.current.forEach(pipe => {
            const beeLeft = 100, beeRight = 100 + BEE_SIZE;
            if (beeRight > pipe.x && beeLeft < pipe.x + PIPE_WIDTH) {
                if (beeY.current < pipe.topHeight || beeY.current + BEE_SIZE > pipe.topHeight + GAP_SIZE) {
                    gameOver(); return;
                }
            }
            if (!pipe.passed && pipe.x + PIPE_WIDTH < 100) { pipe.passed = true; setScore(prev => prev + 1); }
        });

        if (gameState === 'playing') {
            requestRef.current = requestAnimationFrame(loop);
            setTick(prev => prev + 1);
        }
    };

    const flap = () => {
        if (gameState === 'playing') {
            velocity.current = JUMP_STRENGTH;
        } else if (gameState === 'start' || gameState === 'gameover') {
            resetGame();
        }
    };

    useEffect(() => {
        if (gameState === 'playing') requestRef.current = requestAnimationFrame(loop);
        return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
    }, [gameState, tick]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); flap(); }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState]);

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div
            className="flex flex-col items-center justify-center w-full min-h-[90vh] relative select-none py-6 px-4"
            style={{ background: 'linear-gradient(160deg, #1E1B4B 0%, #2D1B69 50%, #1E1B4B 100%)' }}
        >
            {/* Decorative blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: '#7C3AED' }} />
            <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: '#4F46E5' }} />

            {/* HUD */}
            <div className="relative z-10 w-full max-w-[95%] flex justify-between items-center mb-4">
                <button
                    onClick={onExit}
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
                    <div className="text-4xl font-black text-white font-heading drop-shadow-lg">{score}</div>
                </div>
            </div>

            {/* Game Canvas */}
            <div
                ref={containerRef}
                onClick={flap}
                className="relative w-full max-w-[95%] h-[460px] overflow-hidden cursor-pointer rounded-3xl"
                style={{
                    border: '10px solid #5D4037',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                }}
            >
                {/* Sky backdrop */}
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-300 to-blue-200">
                    <Cloud size={100} x="10%" y="10%" speed={20} />
                    <Cloud size={60}  x="60%" y="30%" speed={35} />
                    <Cloud size={120} x="80%" y="15%" speed={25} />
                </div>

                {/* Pipes — honeycomb amber instead of plain green */}
                {pipes.current.map(pipe => (
                    <React.Fragment key={pipe.id}>
                        {/* Top pipe */}
                        <div
                            className="absolute top-0 rounded-b-xl"
                            style={{
                                left: pipe.x, width: PIPE_WIDTH, height: pipe.topHeight,
                                background: 'linear-gradient(135deg, #FBBF24, #D97706)',
                                borderBottom: '4px solid #92400E',
                                borderLeft: '2px solid rgba(255,255,255,0.2)',
                            }}
                        >
                            <div className="absolute bottom-0 left-[-4px] right-[-4px] h-6 rounded-sm" style={{ background: '#D97706', border: '3px solid #92400E' }} />
                        </div>
                        {/* Bottom pipe */}
                        <div
                            className="absolute bottom-0 rounded-t-xl"
                            style={{
                                left: pipe.x, width: PIPE_WIDTH, height: 500 - pipe.topHeight - GAP_SIZE,
                                background: 'linear-gradient(135deg, #FBBF24, #D97706)',
                                borderTop: '4px solid #92400E',
                                borderLeft: '2px solid rgba(255,255,255,0.2)',
                            }}
                        >
                            <div className="absolute top-0 left-[-4px] right-[-4px] h-6 rounded-sm" style={{ background: '#D97706', border: '3px solid #92400E' }} />
                        </div>
                    </React.Fragment>
                ))}

                {/* Bee */}
                <div
                    className="absolute left-[100px] z-20"
                    style={{
                        top: beeY.current, width: BEE_SIZE, height: BEE_SIZE,
                        transform: `rotate(${Math.min(30, Math.max(-30, velocity.current * 3))}deg)`,
                    }}
                >
                    <div className="w-[80px] h-[80px] -ml-[20px] -mt-[20px]">
                        <Lottie animationData={beeData} loop={true} />
                    </div>
                </div>

                {/* Ground */}
                <div className="absolute bottom-0 w-full h-8 border-t-4 z-30" style={{ background: '#81C784', borderColor: '#4CAF50' }} />

                {/* Start screen */}
                {gameState === 'start' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm z-40 text-white">
                        <motion.div
                            animate={{ y: [0, -12, 0] }}
                            transition={{ repeat: Infinity, duration: 1.4 }}
                            className="text-6xl font-heading font-black drop-shadow-xl mb-3"
                        >
                            TAP TO FLY! 🐝
                        </motion.div>
                        <p className="text-purple-200 font-bold text-lg">Avoid the honey pipes!</p>
                    </div>
                )}

                {/* Game over overlay */}
                {gameState === 'gameover' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
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
                                <Trophy className="text-white" size={32} fill="currentColor" />
                            </div>
                            <h2 className="text-4xl font-black text-white mt-6 mb-1 font-heading">Bzzt! 😵</h2>
                            <p className="text-purple-300 font-bold text-lg mb-6">Score: <span className="text-white text-3xl">{score}</span></p>
                            <button
                                onClick={resetGame}
                                className="w-full text-white font-heading font-black text-xl py-3 px-6 rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                                style={{ background: 'linear-gradient(135deg, #FBBF24, #D97706)', boxShadow: '0 6px 20px rgba(251,191,36,0.4)' }}
                            >
                                <RotateCcw size={22} /> Try Again
                            </button>
                        </motion.div>
                    </div>
                )}
            </div>

            {/* Footer hint */}
            <div className="relative z-10 w-full max-w-[95%] mt-4 flex justify-center">
                <p className="text-purple-400 font-body font-bold text-sm">Spacebar or Click to Fly 🐝</p>
            </div>
        </div>
    );
};

const Cloud = ({ size, x, y, speed }: { size: number; x: string; y: string; speed: number }) => (
    <motion.div
        animate={{ x: [0, -100] }}
        transition={{ repeat: Infinity, duration: speed, ease: 'linear' }}
        className="absolute text-white/60"
        style={{ left: x, top: y }}
    >
        <svg width={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M5.5 12C3.567 12 2 13.567 2 15.5C2 17.433 3.567 19 5.5 19H18.5C20.985 19 23 16.985 23 14.5C23 12.015 20.985 10 18.5 10C18.36 10 18.221 10.009 18.085 10.026C17.65 6.643 14.757 4 11.25 4C7.355 4 4.197 7.155 4.197 11.05C4.197 11.385 4.223 11.713 4.273 12.033C4.652 12.011 5.064 12 5.5 12Z" />
        </svg>
    </motion.div>
);

export default FlappyBee;
