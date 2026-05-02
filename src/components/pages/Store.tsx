import React from 'react';
import { motion } from 'framer-motion';
import { useProgress } from '../../context/ProgressContext';
import { ShoppingBag } from 'lucide-react';

interface StoreProps {
    onBack?: () => void;
}

const Store: React.FC<StoreProps> = ({ onBack }) => {
    const { coins } = useProgress();

    return (
        <div 
            className="min-h-screen pt-28 pb-12 px-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #FDF4FF 0%, #EDE9FE 100%)' }}
        >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl pointer-events-none" style={{ background: '#FDE68A' }} />
            
            <motion.div 
                className="max-w-4xl mx-auto relative z-10 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex justify-start mb-8">
                    <motion.button 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        onClick={onBack}
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-bold transition-colors"
                    >
                        <span className="text-xl">←</span> Back
                    </motion.button>
                </div>

                <div className="inline-flex items-center justify-center p-4 bg-white rounded-[2rem] shadow-sm border-2 border-purple-100 mb-8">
                    <ShoppingBag size={48} className="text-purple-500" />
                </div>
                
                <h1 className="font-heading font-black text-5xl text-gray-800 mb-4">Pet Store</h1>
                <p className="font-body text-gray-500 text-lg mb-8 max-w-lg mx-auto">
                    Spend your hard-earned coins on accessories, food, and room decorations for your pet! (Coming soon)
                </p>

                <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border-b-4 border-amber-200 mb-12">
                    <span className="text-3xl">🪙</span>
                    <span className="font-heading font-bold text-3xl text-gray-800">{coins}</span>
                    <span className="font-body font-bold text-gray-400 uppercase tracking-wider text-sm mt-1">Balance</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {/* Placeholder Items */}
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white/60 backdrop-blur-sm p-6 rounded-[2rem] border-2 border-dashed border-purple-200 flex flex-col items-center justify-center min-h-[200px] opacity-70">
                            <div className="text-4xl mb-4 grayscale opacity-50">🎁</div>
                            <div className="font-heading font-bold text-gray-400 mb-2">Mystery Item</div>
                            <div className="flex items-center gap-1 text-gray-300 font-bold">
                                <span>🪙</span> ???
                            </div>
                        </div>
                    ))}
                </div>

            </motion.div>
        </div>
    );
};

export default Store;
