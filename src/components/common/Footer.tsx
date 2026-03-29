import React from 'react';
import { Heart, Github, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="relative pt-6 pb-4 overflow-hidden mt-12 border-t border-white/10">

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <div className="grid md:grid-cols-3 gap-4 mb-4 text-center md:text-left">
                    {/* Brand */}
                    <div>
                        <h2 className="font-heading font-bold text-xl text-white mb-1">
                            Lingo<span className="text-violet-400">Land</span>
                        </h2>
                        <p className="text-violet-200 font-medium text-sm">
                            Making language learning magical.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-heading font-bold text-lg text-white mb-2">Explore</h3>
                        <ul className="flex flex-wrap justify-center md:justify-start gap-4 text-violet-200 font-medium text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Our Mission</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Meet the ARTists</a></li>
                        </ul>
                    </div>

                    {/* Social/Community */}
                    <div>
                        <h3 className="font-heading font-bold text-xl text-white mb-4">Join the Fun</h3>
                        <div className="flex justify-center md:justify-start gap-4">
                            <a href="#" className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-all"><Twitter size={20} /></a>
                            <a href="#" className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-all"><Instagram size={20} /></a>
                            <a href="#" className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-all"><Github size={20} /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-4 flex flex-col md:flex-row items-center justify-between gap-2">
                    <p className="text-violet-300 text-sm font-medium">
                        &copy; {new Date().getFullYear()} LingoLand. All rights reserved.
                    </p>

                    <div className="flex items-center gap-2 bg-white/5 px-4 py-1 rounded-full border border-white/10">
                        <span className="text-violet-200 text-xs font-bold">Made with</span>
                        <Heart size={12} className="text-red-400 fill-red-400 animate-pulse" />
                        <span className="text-violet-200 text-xs font-bold">by</span>
                        <span className="font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-pink-300 text-base">
                            ARTists
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
