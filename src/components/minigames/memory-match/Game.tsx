import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw } from 'lucide-react';

interface MemoryMatchProps {
    onExit: () => void;
    onGameOver?: () => void;
}

const EMOJIS = ['🍎', '🍌', '🍒', '🍇', '🍉', '🍓', '🥝', '🍍'];

interface Card {
    id: number;
    emoji: string;
    isFlipped: boolean;
    isMatched: boolean;
}

const MemoryMatch: React.FC<MemoryMatchProps> = ({ onExit, onGameOver }) => {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [matches, setMatches] = useState(0);
    const [moves, setMoves] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');

    const initializeGame = () => {
        const shuffled = [...EMOJIS, ...EMOJIS]
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({
                id: index,
                emoji,
                isFlipped: false,
                isMatched: false,
            }));
        setCards(shuffled);
        setFlippedIndices([]);
        setMatches(0);
        setMoves(0);
        setGameState('playing');
        setIsLocked(false);
    };

    useEffect(() => {
        initializeGame();
    }, []);

    const handleCardClick = (index: number) => {
        if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);

        // Update card visual instantly
        setCards(prev => {
            const next = [...prev];
            next[index] = { ...next[index], isFlipped: true };
            return next;
        });

        if (newFlipped.length === 2) {
            setIsLocked(true);
            setMoves(m => m + 1);

            const [firstIndex, secondIndex] = newFlipped;
            if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
                // Match
                setCards(prev => {
                    const next = [...prev];
                    next[firstIndex] = { ...next[firstIndex], isMatched: true };
                    next[secondIndex] = { ...next[secondIndex], isMatched: true };
                    return next;
                });
                setFlippedIndices([]);
                setIsLocked(false);
                const newMatches = matches + 1;
                setMatches(newMatches);

                if (newMatches === EMOJIS.length) {
                    setTimeout(() => {
                        setGameState('gameover');
                        if (onGameOver) onGameOver();
                    }, 500);
                }
            } else {
                // No match
                setTimeout(() => {
                    setCards(prev => {
                        const next = [...prev];
                        next[firstIndex] = { ...next[firstIndex], isFlipped: false };
                        next[secondIndex] = { ...next[secondIndex], isFlipped: false };
                        return next;
                    });
                    setFlippedIndices([]);
                    setIsLocked(false);
                }, 600);
            }
        }
    };

    return (
        <div
            className="flex flex-col items-center w-full min-h-[90vh] relative select-none py-6 px-4"
            style={{ background: 'linear-gradient(160deg, #1E1B4B 0%, #2D1B69 50%, #1E1B4B 100%)' }}
        >
            {/* Decorative blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: '#60A5FA' }} />
            <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: '#2563EB' }} />

            {/* HUD */}
            <div className="relative z-10 w-full max-w-2xl flex justify-between items-center mb-8">
                <button
                    onClick={onExit}
                    className="px-4 py-2 rounded-xl text-white font-bold text-sm transition-all hover:scale-105"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                    Go Back
                </button>
                <div className="flex gap-6">
                    <div className="text-center">
                        <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">Moves</p>
                        <p className="text-2xl font-black text-white font-heading">{moves}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">Matches</p>
                        <p className="text-2xl font-black text-white font-heading">{matches} / {EMOJIS.length}</p>
                    </div>
                </div>
            </div>

            {/* Game Grid */}
            <div className="relative z-10 grid grid-cols-4 gap-3 sm:gap-4 max-w-2xl w-full">
                {cards.map((card, index) => (
                    <motion.div
                        key={card.id}
                        whileHover={!card.isFlipped && !card.isMatched && !isLocked ? { scale: 1.05 } : {}}
                        whileTap={!card.isFlipped && !card.isMatched && !isLocked ? { scale: 0.95 } : {}}
                        onClick={() => handleCardClick(index)}
                        className="relative w-full aspect-square cursor-pointer perspective-1000"
                    >
                        <motion.div
                            className="w-full h-full relative transition-transform duration-300"
                            animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Card Back (Hidden side) */}
                            <div
                                className="absolute w-full h-full rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/10"
                                style={{ 
                                    background: 'linear-gradient(135deg, #60A5FA, #2563EB)',
                                    backfaceVisibility: 'hidden',
                                    WebkitBackfaceVisibility: 'hidden',
                                    transform: 'rotateY(0deg)'
                                }}
                            >
                                <span className="text-white/30 text-3xl font-bold">?</span>
                            </div>

                            {/* Card Front (Emoji side) */}
                            <div
                                className="absolute w-full h-full rounded-2xl flex items-center justify-center shadow-lg border-2 border-blue-400/30"
                                style={{
                                    background: card.isMatched ? 'rgba(96,165,250,0.2)' : 'white',
                                    backfaceVisibility: 'hidden',
                                    WebkitBackfaceVisibility: 'hidden',
                                    transform: 'rotateY(180deg)'
                                }}
                            >
                                <span className={`text-4xl sm:text-5xl transition-opacity duration-300 ${card.isMatched ? 'opacity-50' : 'opacity-100'}`}>
                                    {card.emoji}
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
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
                            border: '1px solid rgba(96,165,250,0.4)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                        }}
                    >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #60A5FA, #2563EB)' }}>
                            <Trophy className="text-white" size={32} fill="currentColor" />
                        </div>
                        <h2 className="text-4xl font-black text-white mt-6 mb-1 font-heading">You Win! 🎉</h2>
                        <p className="text-blue-200 font-bold text-lg mb-6">Completed in <span className="text-white">{moves}</span> moves</p>
                        
                        <button
                            onClick={initializeGame}
                            className="w-full text-white font-heading font-black text-xl py-3 px-6 rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                            style={{ background: 'linear-gradient(135deg, #60A5FA, #2563EB)', boxShadow: '0 6px 20px rgba(37,99,235,0.4)' }}
                        >
                            <RotateCcw size={22} /> Play Again
                        </button>
                        <button
                            onClick={onExit}
                            className="w-full text-blue-300 font-bold hover:text-white transition-colors py-3 mt-2 text-lg"
                        >
                            Go Back
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default MemoryMatch;
