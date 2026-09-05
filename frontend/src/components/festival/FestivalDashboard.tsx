import React from 'react';
import { Sparkles, Heart, Bell, Calendar, Flame, Waves, Clock, MapPin, CheckCircle2, ArrowRight, ShieldCheck, Utensils, Music, Megaphone, Flower2 } from 'lucide-react';
import { FestivalConfig } from '../../config/festivalConfig';
import { FestivalCountdown } from './FestivalCountdown';

interface FestivalDashboardProps {
  config: FestivalConfig;
  onNavigateTo: (section: 'welcome' | 'darshan' | 'notifications' | 'updates' | 'donate' | 'visarjan') => void;
  onOpenNimajjan: () => void;
}

export const FestivalDashboard: React.FC<FestivalDashboardProps> = ({
  config,
  onNavigateTo,
  onOpenNimajjan,
}) => {
  const ganeshImg = config.images?.ganeshIdol || config.idolImageUrl;
  const latestNotifications = config.notifications.slice(0, 3);

  // Status card calculator based on date
  const getFestivalStatus = () => {
    const today = new Date();
    const sthapanaDate = new Date(`${config.sthapanaDateISO || '2026-09-14'}T00:00:00`);

    if (today < sthapanaDate) {
      return {
        badge: '🪔 Festival Preparation',
        title: `Ganesh Sthapana — ${config.sthapana.date}`,
        color: 'from-orange-500/20 via-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-300',
      };
    }
    return {
      badge: '🙏 Ganpati Bappa Has Arrived!',
      title: '🎉 Unicode Estates Ganesh Chaturthi Celebrations',
      color: 'from-emerald-500/20 via-amber-500/20 to-orange-500/20 border-emerald-500/40 text-emerald-300',
    };
  };

  const status = getFestivalStatus();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* 1. HERO BANNER & FESTIVAL DIGITAL HOME CARD */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-amber-500/30 shadow-2xl">
        <div className="relative h-[280px] sm:h-[380px] w-full">
          <img
            src={ganeshImg}
            alt="Ganesh idol of Unicode Estates Ganesh Chaturthi Celebrations 2026"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />

          <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end">
            <div className="max-w-2xl space-y-3">
              <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border text-xs font-black uppercase tracking-wider ${status.color}`}>
                <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                <span>{status.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight drop-shadow-md">
                {config.communityName}
                <span className="block text-2xl sm:text-4xl text-amber-300 font-extrabold mt-1">
                  {config.festivalName}
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-200 font-medium line-clamp-2">
                "{config.welcomeMessage}"
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1 font-semibold">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-orange-400" />
                  <span>{config.sthapana.location}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Sthapana: {config.sthapana.date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. LIVE COUNTDOWN TIMER */}
      <FestivalCountdown targetDateISO={config.sthapanaDateISO || '2026-09-14'} />

      {/* 3. QUICK ACTIONS MOBILE-FRIENDLY GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white font-extrabold text-lg">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2>Quick Actions</h2>
          </div>
          <span className="text-xs text-slate-400">Select section to navigate</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            type="button"
            onClick={() => onNavigateTo('darshan')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 hover:bg-slate-800/80 transition text-center space-y-2 group shadow-lg active:scale-95"
          >
            <div className="text-2xl group-hover:scale-110 transition">🛕</div>
            <div className="text-xs font-extrabold text-white group-hover:text-orange-400 transition">
              Ganesh Darshan
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTo('notifications')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 transition text-center space-y-2 group shadow-lg active:scale-95"
          >
            <div className="text-2xl group-hover:scale-110 transition">🔔</div>
            <div className="text-xs font-extrabold text-white group-hover:text-amber-400 transition">
              Notifications
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTo('updates')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800/80 transition text-center space-y-2 group shadow-lg active:scale-95"
          >
            <div className="text-2xl group-hover:scale-110 transition">📅</div>
            <div className="text-xs font-extrabold text-white group-hover:text-sky-400 transition">
              Festival Updates
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTo('donate')}
            className="p-4 rounded-2xl bg-gradient-to-br from-orange-600/30 to-amber-600/20 border border-orange-500/40 hover:border-orange-400 transition text-center space-y-2 group shadow-lg active:scale-95"
          >
            <div className="text-2xl group-hover:scale-110 transition">❤️</div>
            <div className="text-xs font-black text-amber-300">
              Donate Now
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTo('visarjan')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/80 transition text-center space-y-2 group shadow-lg active:scale-95"
          >
            <div className="text-2xl group-hover:scale-110 transition">🌊</div>
            <div className="text-xs font-extrabold text-white group-hover:text-blue-400 transition">
              Visarjan Info
            </div>
          </button>

          <button
            type="button"
            onClick={onOpenNimajjan}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400 hover:bg-slate-800/80 transition text-center space-y-2 group shadow-lg active:scale-95"
          >
            <div className="text-2xl group-hover:scale-110 transition">📣</div>
            <div className="text-xs font-extrabold text-amber-300">
              Nimajjan Chants
            </div>
          </button>
        </div>
      </div>

      {/* 4. FESTIVAL HIGHLIGHTS (CONFIRMED INFO ONLY) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-orange-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Confirmed Festival Overview</span>
            </div>
            <h3 className="text-xl font-extrabold text-white mt-0.5">Festival Highlights</h3>
          </div>
          <span className="text-xs text-slate-400 italic">Centralized in festivalConfig.ts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-orange-400 font-bold">
              <Calendar className="w-4 h-4" />
              <span>Ganesh Sthapana</span>
            </div>
            <div className="font-extrabold text-white text-sm">{config.sthapana.date}</div>
            <div className="text-slate-400">{config.sthapana.location}</div>
            <div className="text-orange-400 font-mono font-semibold">Time: {config.sthapana.time}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <Utensils className="w-4 h-4" />
              <span>Daily Prasad</span>
            </div>
            <div className="font-extrabold text-white text-sm">Available Daily</div>
            <div className="text-slate-400">Morning: {config.prasad.morning}</div>
            <div className="text-slate-400">Evening: {config.prasad.evening}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-sky-400 font-bold">
              <Music className="w-4 h-4" />
              <span>Cultural Programs</span>
            </div>
            <div className="font-extrabold text-white text-sm">{config.culturalPrograms.numberOfDays} Days Planned</div>
            <div className="text-slate-400">Dates: {config.culturalPrograms.dates}</div>
            <div className="text-slate-400">Details: {config.culturalPrograms.times}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-blue-400 font-bold">
              <Waves className="w-4 h-4" />
              <span>Visarjan Utsav</span>
            </div>
            <div className="font-extrabold text-white text-sm">Start: {config.visarjan.startingTime}</div>
            <div className="text-slate-400">Duration: {config.visarjan.possibleDurations} — Update Soon</div>
            <div className="text-slate-400">Route: {config.visarjan.route}</div>
          </div>

        </div>
      </div>

      {/* 5. TWO-COLUMN FEATURED CARDS (GANESH DARSHAN & NIMAJJAN) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Ganesh Darshan Featured Card */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xs font-extrabold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Ganesh Darshan</span>
            </div>

            <div className="relative h-48 rounded-2xl overflow-hidden border border-amber-500/30 bg-slate-950">
              <img
                src={ganeshImg}
                alt="Ganesh idol of Unicode Estates Ganesh Chaturthi Celebrations 2026"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-amber-300 font-black text-sm drop-shadow-md">
                Ganpati Bappa Morya! 🙏
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              "{config.darshanMessage}"
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTo('darshan')}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-orange-500/20 hover:brightness-110 transition flex items-center justify-center space-x-2"
          >
            <span>View Darshan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Nimajjan Utsav Featured Card */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xs font-extrabold text-orange-400 uppercase tracking-wider">
              <Waves className="w-4 h-4" />
              <span>Ganesh Nimajjan Utsav</span>
            </div>

            <h3 className="text-2xl font-black text-white">
              {config.nimajjan.title}
            </h3>

            <p className="text-xs text-amber-300/90 font-medium italic">
              "{config.nimajjan.subheading}"
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Starting Time:</span>
                <span className="font-bold text-white">{config.nimajjan.startingTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration:</span>
                <span className="font-bold text-white">{config.nimajjan.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Route:</span>
                <span className="font-bold text-white">{config.nimajjan.route}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenNimajjan}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 transition flex items-center justify-center space-x-2"
          >
            <span>View Nimajjan Chants →</span>
          </button>
        </div>

      </div>

      {/* 6. NOTIFICATIONS PREVIEW */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-extrabold text-white">Latest Notifications</h3>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTo('notifications')}
            className="text-xs font-extrabold text-amber-400 hover:text-amber-300 transition flex items-center space-x-1"
          >
            <span>View All Notifications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {latestNotifications.map((n) => (
            <div key={n.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold text-[10px]">
                  {n.category}
                </span>
                <span className="text-[10px] text-slate-400">{n.date}</span>
              </div>
              <h4 className="font-extrabold text-white text-xs">{n.title}</h4>
              <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">{n.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 7. FESTIVAL SCHEDULE UPDATES PREVIEW */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-orange-400" />
            <h3 className="text-xl font-extrabold text-white">Festival Updates Preview</h3>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTo('updates')}
            className="text-xs font-extrabold text-orange-400 hover:text-orange-300 transition flex items-center space-x-1"
          >
            <span>View Festival Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-center">
            <div className="text-xl">🪔</div>
            <div className="font-bold text-white">Puja</div>
            <div className="text-[11px] text-orange-400">Timings — Update Soon</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-center">
            <div className="text-xl">🙏</div>
            <div className="font-bold text-white">Aarti</div>
            <div className="text-[11px] text-amber-400">Timings — Update Soon</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-center">
            <div className="text-xl">🍛</div>
            <div className="font-bold text-white">Prasad</div>
            <div className="text-[11px] text-emerald-400">Available Daily</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-center">
            <div className="text-xl">🎭</div>
            <div className="font-bold text-white">Cultural</div>
            <div className="text-[11px] text-sky-400">5 Days — Details Soon</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-center col-span-2 sm:col-span-1">
            <div className="text-xl">🛕</div>
            <div className="font-bold text-white">Visarjan</div>
            <div className="text-[11px] text-blue-400">5 or 7 Days — Update Soon</div>
          </div>
        </div>
      </div>

      {/* 8. PROMINENT DONATION CTA CARD */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border-2 border-orange-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-orange-500/20 text-amber-300 font-extrabold text-xs">
              <Heart className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
              <span>Community Contribution</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Support Our Ganesh Chaturthi Celebration
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Your contribution helps the Unicode Estates community celebrate Ganpati Bappa together with devotion, mahaprasadam, and cultural events.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2">
              {config.donationPurposes.map((p, idx) => (
                <div key={idx} className="flex items-center space-x-1.5 text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="line-clamp-1">{p.replace(' — Update Soon', '')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={() => onNavigateTo('donate')}
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-black text-base shadow-xl shadow-orange-500/40 hover:brightness-110 active:scale-95 transition flex items-center justify-center space-x-2"
            >
              <span>Donate Now ❤️</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
