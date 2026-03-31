import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { motion, AnimatePresence } from 'framer-motion';
import PetSpeechBubble from './PetSpeechBubble';

import turtleWave from '../../assets/turtle/turtle_wave.json';
import turtleTalk from '../../assets/turtle/turtle_talk.json';
import turtleMeditate from '../../assets/turtle/turtle_meditate.json';

export type TurtlePose = 'front' | 'meditate' | 'run-right' | 'run-left';
export type TurtleMood = 'idle' | 'happy' | 'excited' | 'thinking' | 'sleeping' | 'celebrating';

interface TurtlePetProps {
    mood?: TurtleMood;
    pose?: TurtlePose;
    message?: string | null;
    onPetClick?: () => void;
    showMessage?: boolean;
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

const TurtlePet: React.FC<TurtlePetProps> = ({
    mood = 'idle',
    pose = 'front',
    message = null,
    onPetClick,
    showMessage = false,
    size = 'large',
    className = '',
}) => {
    const [currentMessage, setCurrentMessage] = useState<string | null>(null);

    const sizeClasses = {
        small: 'w-32 h-32',
        medium: 'w-48 h-48',
        large: 'w-full h-full max-w-md max-h-md',
    };

    const getAnimationData = () => {
        if (pose === 'meditate') return turtleMeditate;
        if (currentMessage) return turtleTalk;
        return turtleWave;
    };

    const getMoodAnimation = () => {
        switch (mood) {
            case 'excited':
            case 'celebrating':
                return { animate: { y: [0, -20, 0], rotate: [0, -5, 5, 0] }, transition: { duration: 0.5, repeat: Infinity, repeatDelay: 0.5 } };
            case 'happy':
                return { animate: { y: [0, -10, 0] }, transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" } };
            case 'thinking':
                return { animate: { rotate: [0, 3, -3, 0] }, transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } };
            case 'sleeping':
                return { animate: { y: [0, 5, 0], scale: [1, 1.02, 1] }, transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } };
            default:
                return { animate: { y: [0, -8, 0] }, transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" } };
        }
    };

    useEffect(() => {
        setCurrentMessage(message || null);
    }, [message]);

    const moodAnimation = getMoodAnimation();

    return (
        <div className={`relative ${sizeClasses[size]} ${className} flex items-center justify-center`}>
            <AnimatePresence>
                {(showMessage || currentMessage) && currentMessage && (
                    <PetSpeechBubble message={currentMessage} />
                )}
            </AnimatePresence>
            <motion.div
                onClick={onPetClick}
                className="relative cursor-pointer"
                animate={moodAnimation.animate}
                transition={moodAnimation.transition as any}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ width: '300px', height: '400px' }}
            >
                <Lottie
                    animationData={getAnimationData()}
                    loop={true}
                    className="w-full h-full"
                    style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))' }}
                />
                {mood === 'celebrating' && (
                    <div className="absolute inset-0 pointer-events-none">
                        <motion.span className="absolute top-0 left-4 text-2xl" animate={{ y: [0, -20], opacity: [1, 0] }} transition={{ duration: 1, repeat: Infinity }}>🎉</motion.span>
                        <motion.span className="absolute top-0 right-4 text-2xl" animate={{ y: [0, -20], opacity: [1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}>⭐</motion.span>
                        <motion.span className="absolute top-1/4 right-0 text-xl" animate={{ y: [0, -15], opacity: [1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}>✨</motion.span>
                    </div>
                )}
                {mood === 'sleeping' && <motion.div className="absolute top-4 right-4 text-3xl" animate={{ opacity: [0, 1, 0], y: [0, -10, -20] }} transition={{ duration: 2, repeat: Infinity }}>💤</motion.div>}
                {mood === 'thinking' && <motion.div className="absolute top-4 right-4 text-2xl" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>🤔</motion.div>}
            </motion.div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full blur-[80px] -z-10 animate-pulse pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(45,212,191,0.3) 0%, transparent 70%)' }} />
        </div>
    );
};

export default TurtlePet;
