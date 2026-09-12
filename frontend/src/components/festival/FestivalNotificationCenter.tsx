import React, { useState } from 'react';
import { X, Bell, Calendar, Clock, AlertCircle, Info, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { FestivalNotification } from '../../types/notification';

interface FestivalNotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  activeNotifications: FestivalNotification[];
  todayNotifications: FestivalNotification[];
  upcomingNotifications: FestivalNotification[];
}

export const FestivalNotificationCenter: React.FC<FestivalNotificationCenterProps> = ({
  isOpen,
  onClose,
  activeNotifications,
  todayNotifications,
  upcomingNotifications,
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'important'>('today');

  if (!isOpen) return null;

  const importantNotifications = activeNotifications.filter(
    (n) => n.priority === 'CRITICAL' || n.priority === 'HIGH'
  );

  const getDisplayedList = () => {
    switch (activeTab) {
      case 'today':
        return todayNotifications.length > 0 ? todayNotifications : activeNotifications;
      case 'upcoming':
        return upcomingNotifications;
      case 'important':
        return importantNotifications;
      default:
        return activeNotifications;
    }
  };

  const displayedList = getDisplayedList();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Festival Updates & Announcements</h2>
              <p className="text-xs text-slate-400">Unicode Estates Ganesh Chaturthi 2026</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close updates"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('today')}
            className={`flex-1 py-2 px-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'today'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Today ({todayNotifications.length || activeNotifications.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-2 px-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'upcoming'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Upcoming ({upcomingNotifications.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('important')}
            className={`flex-1 py-2 px-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'important'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Important ({importantNotifications.length})</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {displayedList.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
              <Sparkles className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-sm font-bold text-slate-300">No announcements in this category</p>
              <p className="text-xs text-slate-500">Check back later for live updates from festival organizers.</p>
            </div>
          ) : (
            displayedList.map((item) => {
              const isCritical = item.priority === 'CRITICAL';
              const isHigh = item.priority === 'HIGH';

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCritical
                      ? 'bg-rose-950/40 border-rose-500/40'
                      : isHigh
                      ? 'bg-orange-500/10 border-orange-500/30'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        isCritical
                          ? 'bg-rose-500/20 text-rose-400'
                          : isHigh
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {isCritical || isHigh ? <AlertCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-extrabold text-white text-sm">{item.title}</h4>
                        <span className="text-[10px] font-mono text-amber-300/80 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                          {item.notificationType.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        {item.message}
                      </p>

                      <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400 pt-1">
                        {item.eventDate && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-orange-400" />
                            <span>{item.eventDate}</span>
                          </div>
                        )}
                        {item.eventTime && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>{item.eventTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 text-center text-xs text-slate-500">
          Festival Committee Live Announcements • Server Time Asia/Kolkata
        </div>

      </div>
    </div>
  );
};
