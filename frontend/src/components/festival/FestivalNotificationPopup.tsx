import React from 'react';
import { 
  X, Bell, AlertTriangle, Calendar, Clock, Sparkles, ChevronRight, 
  ArrowRight, Heart, Info, CheckCircle2, Flame, RefreshCw 
} from 'lucide-react';
import { FestivalNotification } from '../../types/notification';

interface FestivalNotificationPopupProps {
  notification: FestivalNotification;
  totalActiveCount: number;
  currentIndex: number;
  onDismiss: () => void;
  onNext?: () => void;
  onViewAll?: () => void;
}

export const FestivalNotificationPopup: React.FC<FestivalNotificationPopupProps> = ({
  notification,
  totalActiveCount,
  currentIndex,
  onDismiss,
  onNext,
  onViewAll,
}) => {
  if (!notification) return null;

  const isCritical = notification.priority === 'CRITICAL';
  const isHigh = notification.priority === 'HIGH';

  const getTypeIcon = () => {
    switch (notification.notificationType) {
      case 'FESTIVAL_COUNTDOWN':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'PUJA_REMINDER':
        return <Sparkles className="w-5 h-5 text-orange-400" />;
      case 'NIMAJJANAM_UPDATE':
      case 'PRIEST_DELAY':
      case 'EVENT_DELAY':
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case 'CULTURAL_PROGRAM':
      case 'DANCE_PROGRAM':
      case 'MUSIC_PROGRAM':
        return <Heart className="w-5 h-5 text-amber-300" />;
      case 'VOLUNTEER_REQUEST':
        return <RefreshCw className="w-5 h-5 text-sky-400" />;
      default:
        return <Bell className="w-5 h-5 text-orange-400" />;
    }
  };

  const getPriorityBadge = () => {
    if (isCritical) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
          🚩 CRITICAL UPDATE
        </span>
      );
    }
    if (isHigh) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
          ⚡ IMPORTANT
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-orange-500/10 text-orange-400 border border-orange-500/30">
        📢 ANNOUNCEMENT
      </span>
    );
  };

  return (
    <div 
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="festival-notification-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div 
        className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl transition-all border overflow-hidden ${
          isCritical
            ? 'bg-gradient-to-b from-rose-950/90 to-slate-950/95 border-rose-500/50 shadow-rose-950/50'
            : isHigh
            ? 'bg-gradient-to-b from-slate-900/95 to-slate-950/95 border-orange-500/40 shadow-orange-950/40'
            : 'bg-slate-900/95 border-slate-800'
        }`}
      >
        {/* Subtle decorative background blur glow */}
        <div 
          className={`absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl pointer-events-none ${
            isCritical ? 'bg-rose-500/20' : 'bg-orange-500/20'
          }`} 
        />

        {/* Close Button */}
        {notification.dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Close notification"
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header Header Info */}
        <div className="flex items-center space-x-3 mb-4">
          <div 
            className={`p-3 rounded-2xl shrink-0 ${
              isCritical
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
            }`}
          >
            {getTypeIcon()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              {getPriorityBadge()}
              {totalActiveCount > 1 && (
                <span className="text-[11px] font-mono text-slate-400">
                  {currentIndex + 1} of {totalActiveCount}
                </span>
              )}
            </div>
            <h3 
              id="festival-notification-title"
              className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug"
            >
              {notification.title}
            </h3>
          </div>
        </div>

        {/* Message */}
        <div className="my-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-medium bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl">
          {notification.message}
        </div>

        {/* Dynamic Countdown / Timing badge if present */}
        {notification.countdownText && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>Ganesh Chaturthi Status</span>
            </div>
            <span className="text-xs font-black font-mono text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/40">
              {notification.countdownText}
            </span>
          </div>
        )}

        {(notification.eventDate || notification.eventTime) && (
          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
            {notification.eventDate && (
              <div className="flex items-center space-x-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                <Calendar className="w-3.5 h-3.5 text-orange-400" />
                <span>{notification.eventDate}</span>
              </div>
            )}
            {notification.eventTime && (
              <div className="flex items-center space-x-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{notification.eventTime}</span>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            {onNext && totalActiveCount > 1 && (
              <button
                type="button"
                onClick={onNext}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center space-x-1 transition"
              >
                <span>Next Announcement</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
            {onViewAll && (
              <button
                type="button"
                onClick={onViewAll}
                className="text-xs font-extrabold text-orange-400 hover:text-orange-300 transition px-2 py-1"
              >
                View All Updates
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 ml-auto">
            {notification.actionLabel && notification.actionUrl ? (
              <a
                href={notification.actionUrl}
                onClick={onDismiss}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 flex items-center space-x-1.5 transition"
              >
                <span>{notification.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                type="button"
                onClick={onDismiss}
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs shadow-md transition"
              >
                Got It
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
