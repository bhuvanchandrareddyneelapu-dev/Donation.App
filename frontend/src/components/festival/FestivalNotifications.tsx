import React from 'react';
import { Bell, ArrowRight, ArrowLeft, Info, Calendar, Sparkles, AlertCircle } from 'lucide-react';
import { FestivalConfig } from '../../config/festivalConfig';

interface FestivalNotificationsProps {
  config: FestivalConfig;
  onNext: () => void;
  onBack: () => void;
}

export const FestivalNotifications: React.FC<FestivalNotificationsProps> = ({
  config,
  onNext,
  onBack,
}) => {
  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center py-8 px-4">
      <div className="max-w-3xl w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-xs">
            <Bell className="w-4 h-4 text-orange-400 animate-bounce" />
            <span>Festival Announcements</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            🔔 {config.communityName} Notifications
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Stay informed with official festival updates and upcoming schedules for our Ganesh Chaturthi celebration.
          </p>
        </div>

        {/* Notifications Grid */}
        <div className="space-y-4">
          {config.notifications.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all ${
                item.isImportant
                  ? 'bg-orange-500/10 border-orange-500/40 shadow-lg shadow-orange-950/30'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div
                  className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    item.isImportant
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-slate-800 text-amber-400 border border-slate-700'
                  }`}
                >
                  {item.isImportant ? <AlertCircle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-extrabold text-white text-sm sm:text-base">{item.title}</h3>
                      {item.isImportant && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-orange-600/80 text-white">
                          Important
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-amber-300/80 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    {item.content}
                  </p>

                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 pt-1">
                    <Calendar className="w-3.5 h-3.5 text-orange-400" />
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note info badge */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Detailed timings & updates will be published live here prior to the festival.</span>
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
            <span>Next: Festival Schedule</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
