import React from 'react';
import { ArrowRight, ArrowLeft, Sparkles, Flame, Calendar, Clock, MapPin } from 'lucide-react';
import { FestivalConfig } from '../../config/festivalConfig';

interface GaneshDarshanProps {
  config: FestivalConfig;
  onNext: () => void;
  onBack: () => void;
}

export const GaneshDarshan: React.FC<GaneshDarshanProps> = ({
  config,
  onNext,
  onBack,
}) => {
  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center py-8 px-4">
      <div className="max-w-3xl w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-center relative overflow-hidden">
        
        {/* Decorative Top Banner Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500" />

        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-extrabold text-xs">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Ganesh Darshan</span>
        </div>

        {/* Main Heading */}
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {config.darshanHeading}
        </h2>

        {/* Large Ganesh Idol Visual */}
        <div className="relative max-w-md mx-auto rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl group bg-slate-950">
          <img
            src={config.idolImageUrl}
            alt="Unicode Estates Ganesha"
            className="w-full h-[320px] sm:h-[380px] object-cover object-center group-hover:scale-105 transition duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
          
          <div className="absolute bottom-4 left-4 right-4 text-left p-4 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800 space-y-1">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>{config.communityName} Main Mandap</span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Venue: {config.sthapana.location}
            </p>
          </div>
        </div>

        {/* Brief Content & Event Card */}
        <div className="max-w-xl mx-auto space-y-4">
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
            "{config.darshanMessage}"
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-medium">
            <div className="flex flex-col items-center">
              <Calendar className="w-4 h-4 text-orange-400 mb-1" />
              <span className="text-[10px] text-slate-400 font-bold uppercase">Ganesh Sthapana</span>
              <span className="font-bold text-white mt-0.5">{config.sthapana.date}</span>
            </div>
            <div className="flex flex-col items-center border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0">
              <Clock className="w-4 h-4 text-amber-400 mb-1" />
              <span className="text-[10px] text-slate-400 font-bold uppercase">Time</span>
              <span className="font-mono font-bold text-orange-400 mt-0.5">{config.sthapana.time}</span>
            </div>
            <div className="flex flex-col items-center border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0">
              <MapPin className="w-4 h-4 text-amber-400 mb-1" />
              <span className="text-[10px] text-slate-400 font-bold uppercase">Venue</span>
              <span className="font-bold text-white mt-0.5">{config.sthapana.location}</span>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm flex items-center space-x-2 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 active:scale-95 text-white font-extrabold text-sm shadow-lg shadow-orange-500/30 flex items-center space-x-2 transition"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
