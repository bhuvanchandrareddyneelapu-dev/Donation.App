import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FestivalNotification } from '../types/notification';
import { notificationService } from '../services/notificationService';
import { FestivalNotificationPopup } from '../components/festival/FestivalNotificationPopup';
import { FestivalNotificationCenter } from '../components/festival/FestivalNotificationCenter';
import { NotificationPermissionPrompt } from '../components/festival/NotificationPermissionPrompt';
import { NotificationSettingsModal } from '../components/festival/NotificationSettingsModal';

interface NotificationContextType {
  activeNotifications: FestivalNotification[];
  todayNotifications: FestivalNotification[];
  upcomingNotifications: FestivalNotification[];
  activePopup: FestivalNotification | null;
  currentIndex: number;
  dismissCurrentPopup: () => void;
  nextPopup: () => void;
  refreshNotifications: () => Promise<void>;
  openNotificationCenter: () => void;
  openSettingsModal: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const DISMISSED_LOCAL_KEY = 'donationapp_dismissed_notifications_v1';
const DISMISSED_SESSION_KEY = 'donationapp_session_dismissed_v1';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeNotifications, setActiveNotifications] = useState<FestivalNotification[]>([]);
  const [todayNotifications, setTodayNotifications] = useState<FestivalNotification[]>([]);
  const [upcomingNotifications, setUpcomingNotifications] = useState<FestivalNotification[]>([]);
  
  const [activePopupIndex, setActivePopupIndex] = useState<number>(-1);
  const [isCenterOpen, setIsCenterOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const getDismissedLocalMap = (): Record<string, string> => {
    try {
      return JSON.parse(localStorage.getItem(DISMISSED_LOCAL_KEY) || '{}');
    } catch {
      return {};
    }
  };

  const getDismissedSessionMap = (): Record<string, boolean> => {
    try {
      return JSON.parse(sessionStorage.getItem(DISMISSED_SESSION_KEY) || '{}');
    } catch {
      return {};
    }
  };

  const shouldShowNotification = useCallback((n: FestivalNotification): boolean => {
    if (!n.enabled) return false;

    const localMap = getDismissedLocalMap();
    const sessionMap = getDismissedSessionMap();
    const idKey = String(n.id);
    const todayStr = new Date().toISOString().split('T')[0];

    // CRITICAL priority override: if updated after last dismissal timestamp, show again
    if (n.priority === 'CRITICAL' && n.updatedAt && localMap[idKey]) {
      const dismissedAt = new Date(localMap[idKey]).getTime();
      const updatedAt = new Date(n.updatedAt).getTime();
      if (updatedAt > dismissedAt) {
        return true;
      }
    }

    switch (n.repeatMode) {
      case 'ONCE_PER_SESSION':
        return !sessionMap[idKey];
      case 'ONCE_PER_DAY':
        return localMap[idKey] !== todayStr;
      case 'UNTIL_DISMISSED':
        return !localMap[idKey];
      case 'EVERY_OPEN':
      case 'SCHEDULED_WINDOW':
      default:
        return !sessionMap[idKey];
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    try {
      const [active, today, upcoming] = await Promise.all([
        notificationService.getActiveNotifications(1).catch(() => []),
        notificationService.getTodayNotifications(1).catch(() => []),
        notificationService.getUpcomingNotifications(1).catch(() => []),
      ]);

      setActiveNotifications(active);
      setTodayNotifications(today);
      setUpcomingNotifications(upcoming);

      // Select highest priority eligible notification that hasn't been dismissed
      const eligibleIndices: number[] = [];
      active.forEach((item, index) => {
        if (shouldShowNotification(item)) {
          eligibleIndices.push(index);
        }
      });

      if (eligibleIndices.length > 0) {
        setActivePopupIndex((prevIndex) => {
          if (prevIndex >= 0 && prevIndex < active.length && shouldShowNotification(active[prevIndex])) {
            return prevIndex;
          }
          return eligibleIndices[0];
        });
      } else {
        setActivePopupIndex(-1);
      }
    } catch (e) {
      console.warn('Failed to fetch festival notifications:', e);
    }
  }, [shouldShowNotification]);

  useEffect(() => {
    refreshNotifications();
    // 60-second lightweight polling interval
    const interval = setInterval(refreshNotifications, 60000);
    return () => clearInterval(interval);
  }, [refreshNotifications]);

  const dismissCurrentPopup = () => {
    if (activePopupIndex < 0 || activePopupIndex >= activeNotifications.length) return;
    const current = activeNotifications[activePopupIndex];
    if (!current) return;

    const idKey = String(current.id);
    const todayStr = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();

    // Record local dismissal
    const localMap = getDismissedLocalMap();
    if (current.repeatMode === 'ONCE_PER_DAY') {
      localMap[idKey] = todayStr;
    } else {
      localMap[idKey] = nowIso;
    }
    localStorage.setItem(DISMISSED_LOCAL_KEY, JSON.stringify(localMap));

    // Record session dismissal
    const sessionMap = getDismissedSessionMap();
    sessionMap[idKey] = true;
    sessionStorage.setItem(DISMISSED_SESSION_KEY, JSON.stringify(sessionMap));

    // Advance to next eligible notification or hide popup
    const remainingIndices: number[] = [];
    activeNotifications.forEach((item, idx) => {
      if (idx !== activePopupIndex && shouldShowNotification(item)) {
        remainingIndices.push(idx);
      }
    });

    if (remainingIndices.length > 0) {
      setActivePopupIndex(remainingIndices[0]);
    } else {
      setActivePopupIndex(-1);
    }
  };

  const nextPopup = () => {
    if (activeNotifications.length <= 1) return;
    const nextIdx = (activePopupIndex + 1) % activeNotifications.length;
    setActivePopupIndex(nextIdx);
  };

  const openNotificationCenter = () => {
    setIsCenterOpen(true);
  };

  const openSettingsModal = () => {
    setIsSettingsOpen(true);
  };

  const activePopup = activePopupIndex >= 0 && activePopupIndex < activeNotifications.length
    ? activeNotifications[activePopupIndex]
    : null;

  return (
    <NotificationContext.Provider
      value={{
        activeNotifications,
        todayNotifications,
        upcomingNotifications,
        activePopup,
        currentIndex: activePopupIndex,
        dismissCurrentPopup,
        nextPopup,
        refreshNotifications,
        openNotificationCenter,
        openSettingsModal,
      }}
    >
      {children}

      {/* Render Smart Popup when active */}
      {activePopup && shouldShowNotification(activePopup) && (
        <FestivalNotificationPopup
          notification={activePopup}
          totalActiveCount={activeNotifications.length}
          currentIndex={activePopupIndex}
          onDismiss={dismissCurrentPopup}
          onNext={activeNotifications.length > 1 ? nextPopup : undefined}
          onViewAll={() => {
            dismissCurrentPopup();
            setIsCenterOpen(true);
          }}
        />
      )}

      {/* Web Push Permission Banner Prompt */}
      <NotificationPermissionPrompt />

      {/* Notification Center Modal */}
      <FestivalNotificationCenter
        isOpen={isCenterOpen}
        onClose={() => setIsCenterOpen(false)}
        activeNotifications={activeNotifications}
        todayNotifications={todayNotifications}
        upcomingNotifications={upcomingNotifications}
      />

      {/* Notification Settings Modal */}
      <NotificationSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
