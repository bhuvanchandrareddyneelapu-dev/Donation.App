import React, { useState, useEffect } from 'react';
import { Bell, Sparkles, X, CheckCircle2, ShieldAlert } from 'lucide-react';
import { usePushNotifications } from '../../hooks/usePushNotifications';

const DISMISSED_PROMPT_SESSION_KEY = 'donationapp_push_prompt_dismissed_session';

export const NotificationPermissionPrompt: React.FC = () => {
  const { isSupported, permission, isSubscribed, loading, subscribeUser } = usePushNotifications();
  const [isVisible, setIsVisible] = useState(false);
  const [successState, setSuccessState] = useState(false);

  useEffect(() => {
    // Show prompt ONLY if browser supports WebPush, permission is 'default', and user hasn't dismissed in session
    if (!isSupported) return;

    const isSessionDismissed = sessionStorage.getItem(DISMISSED_PROMPT_SESSION_KEY);
    if (permission === 'default' && !isSubscribed && !isSessionDismissed) {
      // Small delay to allow initial page layout render
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isSupported, permission, isSubscribed]);

  const handleEnable = async () => {
    const success = await subscribeUser();
    if (success) {
      setSuccessState(true);
      setTimeout(() => {
        setIsVisible(false);
        setSuccessState(false);
      }, 3000);
    } else {
      sessionStorage.setItem(DISMISSED_PROMPT_SESSION_KEY, 'true');
      setIsVisible(false);
    }
  };

  const handleMaybeLater = () => {
    sessionStorage.setItem(DISMISSED_PROMPT_SESSION_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible || !isSupported || permission === 'granted' || permission === 'denied') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 z-50 max-w-md w-full bg-slate-900/95 backdrop-blur-xl border border-orange-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-orange-950/40 animate-bounce-in">
      {/* Decorative top accent */}
      <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-orange-500/10 blur-2xl pointer-events-none" />

      {successState ? (
        <div className="text-center py-3 space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-extrabold text-white">Notifications Enabled!</h4>
          <p className="text-xs text-slate-300">
            You'll receive important festival updates even when Donation.App is closed.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 shrink-0">
              <Bell className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase border border-amber-500/30">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  Live Updates
                </span>
              </div>
              <h3 className="text-base font-black text-white tracking-tight">
                Stay Connected to the Festival
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Get important updates about Puja, events, Nimajjanam, decoration and schedule changes — even when Donation.App is closed.
              </p>
            </div>

            <button
              onClick={handleMaybeLater}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handleMaybeLater}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              Maybe Later
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleEnable}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 active:scale-95 text-white font-extrabold text-xs shadow-lg shadow-orange-500/30 transition flex items-center space-x-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{loading ? 'Subscribing...' : 'Enable Notifications'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
