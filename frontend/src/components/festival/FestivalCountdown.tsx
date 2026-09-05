import React, { useState, useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';

interface FestivalCountdownProps {
  targetDateISO: string; // e.g., '2026-09-14'
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  hasArrived: boolean;
}

export const FestivalCountdown: React.FC<FestivalCountdownProps> = ({ targetDateISO }) => {
  const calculateTimeLeft = (): TimeLeft => {
    // Parse target date 14 September 2026 00:00:00
    const target = new Date(`${targetDateISO}T00:00:00`).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, hasArrived: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      hasArrived: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateISO]);

  if (timeLeft.hasArrived) {
    return (
      <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-600/20 via-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-center space-y-2 shadow-xl backdrop-blur-md">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-xs">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>Ganesh Chaturthi 2026</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Ganpati Bappa Has Arrived! 🙏
        </h3>
        <p className="text-xs text-amber-300/90 font-medium">
          Welcome Lord Ganesha with devotion & joy at Unicode Estates!
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 text-center space-y-4 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Label */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-extrabold text-xs">
        <Clock className="w-3.5 h-3.5 text-amber-400" />
        <span>Ganesh Sthapana Begins In</span>
      </div>

      <div className="text-xs text-slate-400 font-medium">
        Target Date: <span className="text-amber-300 font-bold">14 September 2026</span> (Time: Update Soon)
      </div>

      {/* Countdown Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto">
        <div className="p-3 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
          <div className="text-2xl sm:text-4xl font-black text-amber-400 font-mono">
            {String(timeLeft.days).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
            Days
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
          <div className="text-2xl sm:text-4xl font-black text-amber-400 font-mono">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
            Hours
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
          <div className="text-2xl sm:text-4xl font-black text-amber-400 font-mono">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
            Mins
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
          <div className="text-2xl sm:text-4xl font-black text-orange-400 font-mono animate-pulse">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
            Secs
          </div>
        </div>
      </div>
    </div>
  );
};
