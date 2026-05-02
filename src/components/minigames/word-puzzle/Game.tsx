import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw } from 'lucide-react';
import { WORDS } from './words';

interface WordPuzzleProps {
    onExit: () => void;
    onGameOver?: (stars?: number) => void;
}

type Difficulty = 'easy' | 'medium' | 'hard' | 'legendary';

const ROUNDS: Record<Difficulty, number> = {
    easy: 3,
    medium: 5,
    hard: 10,
    legendary: 15
};

const WordPuzzle: React.FC<WordPuzzleProps> = ({ onExit, onGameOver }) => {
    const [gameState, setGameState] = useState<'select' | 'playing' | 'success' | 'gameover'>('select');
    const [wordList, setWordList] = useState<typeof WORDS>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [scrambled, setScrambled] = useState<{ id: string; letter: string; used: boolean }[]>([]);
    const [selected, setSelected] = useState<{ id: string; letter: string }[]>([]);
    const [score, setScore] = useState(0);
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [totalRounds, setTotalRounds] = useState(3);

    const initRound = (index: number, words: typeof WORDS, maxRounds: number) => {
        if (index >= words.length || index >= maxRounds) {
            setGameState('gameover');
            if (onGameOver) {
                const starReward = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : difficulty === 'hard' ? 10 : 15;
                onGameOver(starReward);
            }
            return;
        }

        const target = words[index].word;
        // Scramble the word, ensuring it's not exactly the same as the original
        let scrambledLetters = target.split('');
        let isSame = true;
        while (isSame && target.length > 1) {
            scrambledLetters.sort(() => Math.random() - 0.5);
            isSame = scrambledLetters.join('') === target;
        }

        setScrambled(scrambledLetters.map((l, i) => ({ id: `${i}-${l}`, letter: l, used: false })));
        setSelected([]);
        setGameState('playing');
    };

    const startGame = (diff: Difficulty) => {
        const rounds = ROUNDS[diff];
        setDifficulty(diff);
        setTotalRounds(rounds);
        
        // Shuffle and pick the required number of words
        const shuffledWords = [...WORDS].sort(() => Math.random() - 0.5).slice(0, rounds);
        setWordList(shuffledWords);
        setCurrentWordIndex(0);
        setScore(0);
        initRound(0, shuffledWords, rounds);
    };

    const handleLetterClick = (item: { id: string; letter: string; used: boolean }, index: number) => {
        if (item.used || gameState !== 'playing') return;

        // Mark as used
        setScrambled(prev => {
            const next = [...prev];
            next[index] = { ...next[index], used: true };
            return next;
        });

        const newSelected = [...selected, { id: item.id, letter: item.letter }];
        setSelected(newSelected);

        // Check word
        if (newSelected.length === wordList[currentWordIndex].word.length) {
            const formedWord = newSelected.map(s => s.letter).join('');
            if (formedWord === wordList[currentWordIndex].word) {
                // Success!
                setGameState('success');
                setScore(s => s + 100);
                setTimeout(() => {
                    setCurrentWordIndex(prev => {
                        const next = prev + 1;
                        initRound(next, wordList, totalRounds);
                        return next;
                    });
                }, 1500);
            } else {
                // Wrong! Reset selected letters visually
                setTimeout(() => {
                    setScrambled(prev => prev.map(p => ({ ...p, used: false })));
                    setSelected([]);
                }, 500);
            }
        }
    };

    const handleUndo = () => {
        if (selected.length === 0 || gameState !== 'playing') return;
        
        const lastSelected = selected[selected.length - 1];
        setSelected(prev => prev.slice(0, -1));
        
        setScrambled(prev => prev.map(p => 
            p.id === lastSelected.id ? { ...p, used: false } : p
        ));
    };

    if (gameState === 'select') {
        return (
            <div
                className="flex flex-col items-center justify-center w-full min-h-[90vh] relative select-none py-6 px-4"
                style={{ background: 'linear-gradient(160deg, #1E1B4B 0%, #2D1B69 50%, #1E1B4B 100%)' }}
            >
                {/* Decorative blobs */}
                <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: '#A78BFA' }} />
                <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: '#7C3AED' }} />

                <div className="relative z-10 w-full max-w-2xl flex justify-between items-center mb-10">
                    <button
                        onClick={onExit}
                        className="px-4 py-2 rounded-xl text-white font-bold text-sm transition-all hover:scale-105"
                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                        Go Back
                    </button>
                </div>

                <div className="relative z-10 max-w-lg w-full text-center">
                    <div className="text-6xl mb-4">🧩</div>
                    <h1 className="font-heading font-black text-5xl text-white mb-4">Word Puzzle</h1>
                    <p className="text-purple-300 font-body text-lg mb-10">Select your difficulty level!</p>

                    <div className="flex flex-col gap-4 w-full px-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => startGame('easy')}
                            className="w-full py-4 rounded-2xl font-heading font-bold text-2xl text-white border-2 border-green-400/50"
                            style={{ background: 'linear-gradient(135deg, #34D399, #059669)', boxShadow: '0 8px 25px rgba(16,185,129,0.3)' }}
                        >
                            Easy (3 Words)
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => startGame('medium')}
                            className="w-full py-4 rounded-2xl font-heading font-bold text-2xl text-white border-2 border-yellow-400/50"
                            style={{ background: 'linear-gradient(135deg, #FBBF24, #D97706)', boxShadow: '0 8px 25px rgba(245,158,11,0.3)' }}
                        >
                            Medium (5 Words)
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => startGame('hard')}
                            className="w-full py-4 rounded-2xl font-heading font-bold text-2xl text-white border-2 border-orange-400/50"
                            style={{ background: 'linear-gradient(135deg, #F97316, #C2410C)', boxShadow: '0 8px 25px rgba(234,88,12,0.3)' }}
                        >
                            Hard (10 Words)
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => startGame('legendary')}
                            className="w-full py-4 rounded-2xl font-heading font-bold text-2xl text-white border-2 border-red-400/50"
                            style={{ background: 'linear-gradient(135deg, #EF4444, #B91C1C)', boxShadow: '0 8px 25px rgba(220,38,38,0.3)' }}
                        >
                            Legendary (15 Words)
                        </motion.button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="flex flex-col items-center w-full min-h-[90vh] relative select-none py-6 px-4"
            style={{ background: 'linear-gradient(160deg, #1E1B4B 0%, #2D1B69 50%, #1E1B4B 100%)' }}
        >
            {/* Decorative blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: '#A78BFA' }} />
            <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: '#7C3AED' }} />

            {/* HUD */}
            <div className="relative z-10 w-full max-w-2xl flex justify-between items-center mb-8">
                <button
                    onClick={() => setGameState('select')}
                    className="px-4 py-2 rounded-xl text-white font-bold text-sm transition-all hover:scale-105"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                    Go Back
                </button>
                <div className="flex gap-6">
                    <div className="text-center">
                        <p className="text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">Round</p>
                        <p className="text-2xl font-black text-white font-heading">{Math.min(currentWordIndex + 1, totalRounds)} / {totalRounds}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">Score</p>
                        <p className="text-2xl font-black text-white font-heading">{score}</p>
                    </div>
                </div>
            </div>

            {/* Game Area */}
            <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
                {currentWordIndex < wordList.length && gameState !== 'gameover' && (
                    <>
                        <div className="mb-10 text-center px-2">
                            <h2 className="text-2xl sm:text-3xl font-heading font-black text-white mb-2 tracking-wide">
                                Unscramble the Word
                            </h2>
                            <p className="text-purple-200 text-lg">Hint: {wordList[currentWordIndex].hint}</p>
                        </div>

                        {/* Selected Letters (Target blanks) */}
                        <div className="flex gap-1.5 sm:gap-3 mb-12 h-14 sm:h-20 flex-wrap justify-center px-2">
                            {wordList[currentWordIndex].word.split('').map((_, i) => {
                                const sel = selected[i];
                                return (
                                    <div
                                        key={`blank-${i}`}
                                        className="w-10 h-14 sm:w-16 sm:h-20 rounded-xl flex items-center justify-center shadow-inner border-2 border-white/10"
                                        style={{ 
                                            background: 'rgba(0,0,0,0.2)',
                                            borderColor: gameState === 'success' ? '#34D399' : selected.length === wordList[currentWordIndex].word.length ? '#F87171' : 'rgba(255,255,255,0.1)'
                                        }}
                                    >
                                        <AnimatePresence>
                                            {sel && (
                                                <motion.span
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className="text-2xl sm:text-4xl font-black text-white"
                                                >
                                                    {sel.letter}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Scrambled Letters Pool */}
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 max-w-md px-2">
                            {scrambled.map((item, index) => (
                                <motion.button
                                    key={item.id}
                                    whileHover={!item.used && gameState === 'playing' ? { scale: 1.1 } : {}}
                                    whileTap={!item.used && gameState === 'playing' ? { scale: 0.9 } : {}}
                                    onClick={() => handleLetterClick(item, index)}
                                    disabled={item.used || gameState !== 'playing'}
                                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-xl sm:text-3xl font-black transition-all ${
                                        item.used 
                                            ? 'bg-white/5 border-white/5 text-white/10 shadow-none' 
                                            : 'bg-gradient-to-br from-purple-400 to-indigo-600 text-white shadow-lg border border-purple-300/30'
                                    }`}
                                >
                                    {item.letter}
                                </motion.button>
                            ))}
                        </div>

                        <div className="h-12">
                            {selected.length > 0 && gameState === 'playing' && (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={handleUndo}
                                    className="text-purple-300 font-bold hover:text-white flex items-center gap-2 px-4 py-2"
                                >
                                    <RotateCcw size={18} /> Undo Letter
                                </motion.button>
                            )}
                            
                            {gameState === 'success' && (
                                <motion.div 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="text-green-400 text-xl font-bold font-heading flex items-center gap-2"
                                >
                                    Correct! +100 ✨
                                </motion.div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Game Over Screen */}
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
                            style={{ background: 'linear-gradient(135deg, #A78BFA, #7C3AED)' }}>
                            <Trophy className="text-white" size={32} fill="currentColor" />
                        </div>
                        <h2 className="text-4xl font-black text-white mt-6 mb-1 font-heading">Great Job! 🎉</h2>
                        <p className="text-purple-200 font-bold text-lg mb-6">Final Score: <span className="text-white">{score}</span></p>
                        
                        <button
                            onClick={() => startGame(difficulty)}
                            className="w-full text-white font-heading font-black text-xl py-3 px-6 rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                            style={{ background: 'linear-gradient(135deg, #A78BFA, #7C3AED)', boxShadow: '0 6px 20px rgba(139,92,246,0.4)' }}
                        >
                            <RotateCcw size={22} /> Play Again
                        </button>
                        <button
                            onClick={() => setGameState('select')}
                            className="w-full text-purple-300 font-bold hover:text-white transition-colors py-3 mt-2 text-lg"
                        >
                            Go Back
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default WordPuzzle;
