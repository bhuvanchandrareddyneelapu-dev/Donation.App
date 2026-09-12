import React from 'react';
import { X, Bell, CheckCircle2, ShieldAlert, AlertTriangle, RefreshCw, Power } from 'lucide-react';
import { usePushNotifications } from '../../hooks/usePushNotifications';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({ isOpen, onClose }) => {
  const { isSupported, permission, isSubscribed, loading, error, subscribeUser, unsubscribeUser } = usePushNotifications();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Festival Notifications</h3>
              <p className="text-xs text-slate-400">Web Push Settings</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {!isSupported ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Web Push notifications are not supported in this browser. You can still view live updates inside the app.</span>
            </div>
          ) : permission === 'denied' ? (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-2">
              <div className="flex items-center space-x-2 font-bold">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Notifications Blocked</span>
              </div>
              <p className="leading-relaxed">
                Notifications are currently blocked in your browser. You can enable them from your browser site settings icon in the address bar.
              </p>
            </div>
          ) : isSubscribed ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-extrabold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Notifications Enabled & Active</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                You are currently subscribed to receive real-time updates for Unicode Estates Ganesh Chaturthi 2026 even when the website is closed.
              </p>

              <button
                type="button"
                disabled={loading}
                onClick={unsubscribeUser}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 font-extrabold text-xs border border-slate-700 transition flex items-center justify-center space-x-2"
              >
                <Power className="w-4 h-4" />
                <span>{loading ? 'Processing...' : 'Disable Web Push Notifications'}</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Subscribe to browser notifications to get instant alerts on Puja schedule, Nimajjanam updates, and events.
              </p>

              <button
                type="button"
                disabled={loading}
                onClick={subscribeUser}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white font-extrabold text-xs shadow-lg shadow-orange-500/30 transition flex items-center justify-center space-x-2"
              >
                <Bell className="w-4 h-4" />
                <span>{loading ? 'Enabling...' : 'Enable Push Notifications'}</span>
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 text-center text-[11px] text-slate-500">
          Festival Updates • No login required
        </div>

      </div>
    </div>
  );
};
