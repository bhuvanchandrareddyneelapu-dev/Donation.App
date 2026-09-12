import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../context/NotificationProvider';
import { FestivalNotificationCenter } from './FestivalNotificationCenter';

export const NotificationBell: React.FC = () => {
  const { activeNotifications, todayNotifications, upcomingNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const count = activeNotifications.length;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Festival Announcements (${count} active)`}
        className="relative p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition flex items-center justify-center group"
      >
        <Bell className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-slate-950 shadow-md animate-pulse">
            {count}
          </span>
        )}
      </button>

      <FestivalNotificationCenter
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        activeNotifications={activeNotifications}
        todayNotifications={todayNotifications}
        upcomingNotifications={upcomingNotifications}
      />
    </>
  );
};
