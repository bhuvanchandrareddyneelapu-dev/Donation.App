import React from 'react';
import { Sparkles, Heart, ArrowRight, Flame } from 'lucide-react';
import { FestivalConfig } from '../../config/festivalConfig';

interface GaneshWelcomeProps {
  config: FestivalConfig;
  onNext: () => void;
  onJumpToDonation: () => void;
}

export const GaneshWelcome: React.FC<GaneshWelcomeProps> = ({
  config,
  onNext,
  onJumpToDonation,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-140px)] flex flex-col items-center justify-center py-12 px-4 overflow-hidden">
      
      {/* Background Decorative Lighting & Rangoli Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-orange-600/20 via-amber-500/20 to-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main Hero Card Container */}
      <div className="relative z-10 max-w-4xl w-full text-center space-y-8 bg-slate-900/90 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-6 sm:p-12 shadow-2xl shadow-orange-950/40">
        
        {/* Festive Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/15 via-amber-500/20 to-orange-500/15 border border-orange-500/30 text-amber-300 text-xs font-black uppercase tracking-widest shadow-md backdrop-blur-md">
          <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
          <span>🌺 {config.communityName} Festival Experience</span>
          <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
        </div>

        {/* Headings */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">{config.communityName}</span>
          </h1>
          <h2 className="text-xl sm:text-2xl font-extrabold text-amber-400/90 tracking-wide">
            {config.tagline}
          </h2>
        </div>

        {/* Ganesh Idol Visual Frame */}
        <div className="relative max-w-xs sm:max-w-sm mx-auto group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500 rounded-3xl blur opacity-40 group-hover:opacity-75 transition duration-500" />
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border-2 border-amber-400/40 shadow-2xl bg-slate-950">
            <img
              src={config.idolImageUrl}
              alt="Lord Ganesha Idol"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-3 left-0 right-0 text-center">
              <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-extrabold text-amber-300 border border-amber-500/30">
                🕉️ Shree Ganeshay Namah
              </span>
            </div>
          </div>
        </div>

        {/* Warm Devotional Message */}
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
          "{config.welcomeMessage}"
        </p>

        {/* Diya / Marigold Accent Row */}
        <div className="flex justify-center items-center space-x-6 text-xs text-amber-400/80 pt-2 font-bold">
          <div className="flex items-center space-x-1">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Devotion</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Togetherness</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>New Beginnings</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={onNext}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:brightness-110 active:scale-95 text-white font-extrabold text-base shadow-xl shadow-orange-500/30 flex items-center justify-center space-x-3 transition group"
          >
            <span>Begin Celebration</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </button>

          <button
            type="button"
            onClick={onJumpToDonation}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-400/60 text-amber-300 font-extrabold text-sm flex items-center justify-center space-x-2 transition"
          >
            <Heart className="w-4 h-4 text-orange-400 fill-orange-400" />
            <span>Quick Support</span>
          </button>
        </div>

      </div>
    </div>
  );
};
