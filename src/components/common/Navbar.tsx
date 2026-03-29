import React from 'react';
import { motion } from 'framer-motion';

interface NavbarProps {
    view: string;
    session: any;
    onHome: () => void;
    onAuth: () => void;
    onDashboard: () => void;
    onAdventures: () => void;
    onProfile: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ view, session, onHome, onAuth, onDashboard, onAdventures, onProfile }) => {
    
    const isActive = (targets: string[]) => targets.includes(view);

    const items = [
        { label: 'Home',       icon: "🏠", action: onHome,         active: isActive(['landing']) },
        { label: 'Dashboard',  icon: "🗺️", action: onDashboard,    active: isActive(['dashboard', 'minigames', 'languagePicker', 'lessonPlayer']) },
        { label: 'Adventures', icon: "🚀", action: onAdventures,   active: isActive(['adventures']) },
        ...(session
            ? [{ label: 'Profile', icon: "👤", action: onProfile, active: isActive(['profile']) }]
            : [{ label: 'Login',   icon: "🔑", action: onAuth,    active: isActive(['auth']) }]
        )
    ];

    return (
        <div className="sticky top-0 z-50 flex justify-center py-3 px-4" style={{ background: 'transparent' }}>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="flex items-center gap-1 px-3 py-2 rounded-full"
                style={{
                    background:     'rgba(30, 27, 75, 0.88)',
                    backdropFilter: 'blur(16px)',
                    boxShadow:      '0 8px 32px rgba(0,0,0,0.4)',
                    border:         '1px solid rgba(167,139,250,0.3)',
                }}
            >
                {items.map((item) => (
                    <button
                        key={item.label}
                        onClick={item.action}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-full font-body font-bold text-xs transition-all"
                        style={{
                            background:  item.active ? 'rgba(167,139,250,0.3)' : 'transparent',
                            color:       item.active ? '#C4B5FD' : 'rgba(196,181,253,0.45)',
                            border:      item.active ? '1px solid rgba(167,139,250,0.4)' : '1px solid transparent',
                        }}
                    >
                        <span>{item.icon}</span>
                        <span className="hidden sm:inline">{item.label}</span>
                    </button>
                ))}
            </motion.nav>
        </div>
    );
};

export default Navbar;
