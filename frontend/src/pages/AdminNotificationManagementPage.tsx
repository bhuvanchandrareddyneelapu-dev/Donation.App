import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, Plus, Edit2, Trash2, Power, AlertTriangle, ShieldCheck, ArrowLeft, 
  Save, Calendar, Clock, Flame, Sparkles, RefreshCw, CheckCircle2, AlertCircle, Send, Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FestivalNotification, FestivalNotificationRequest, NotificationPriority, NotificationType, RepeatMode } from '../types/notification';
import { notificationService } from '../services/notificationService';
import { pushNotificationService } from '../services/pushNotificationService';

export const AdminNotificationManagementPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<FestivalNotification[]>([]);
  const [pushSubscribersCount, setPushSubscribersCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pushingId, setPushingId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<FestivalNotificationRequest & { sendPush?: boolean }>({
    festivalId: 1,
    title: '',
    message: '',
    notificationType: 'GENERAL_ANNOUNCEMENT',
    priority: 'NORMAL',
    eventDate: '',
    eventTime: '',
    scheduledStart: '',
    scheduledEnd: '',
    enabled: true,
    dismissible: true,
    repeatMode: 'ONCE_PER_SESSION',
    displayDurationSeconds: 10,
    actionLabel: '',
    actionUrl: '',
    sendPush: true,
  });

  const isAuthorizedAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'HEAD' || user?.role === 'FESTIVAL_ADMIN' || user?.role === 'SUPERVISOR';

  useEffect(() => {
    fetchNotifications();
    fetchPushSubscribersCount();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getAllNotificationsAdmin(1);
      setNotifications(data);
    } catch (e) {
      console.error('Failed to fetch admin notifications:', e);
      setErrorMsg('Failed to load notifications. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPushSubscribersCount = async () => {
    try {
      const res = await pushNotificationService.getAdminSubscriberCount(1);
      setPushSubscribersCount(res.activeSubscribers || 0);
    } catch (e) {
      console.warn('Could not fetch push subscriber count:', e);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      festivalId: 1,
      title: '',
      message: '',
      notificationType: 'GENERAL_ANNOUNCEMENT',
      priority: 'NORMAL',
      eventDate: new Date().toISOString().split('T')[0],
      eventTime: '18:00',
      scheduledStart: '',
      scheduledEnd: '',
      enabled: true,
      dismissible: true,
      repeatMode: 'ONCE_PER_SESSION',
      displayDurationSeconds: 10,
      actionLabel: '',
      actionUrl: '',
      sendPush: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: FestivalNotification) => {
    setEditingId(item.id);
    setFormData({
      festivalId: item.festivalId || 1,
      title: item.title,
      message: item.message,
      notificationType: item.notificationType,
      priority: item.priority,
      eventDate: item.eventDate || '',
      eventTime: item.eventTime || '',
      scheduledStart: item.scheduledStart || '',
      scheduledEnd: item.scheduledEnd || '',
      enabled: item.enabled,
      dismissible: item.dismissible,
      repeatMode: item.repeatMode,
      displayDurationSeconds: item.displayDurationSeconds || 10,
      actionLabel: item.actionLabel || '',
      actionUrl: item.actionUrl || '',
      sendPush: item.sendPush ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      if (editingId) {
        await notificationService.updateNotification(editingId, formData);
        setSuccessMsg('Notification updated successfully. Schedule and push triggers updated.');
      } else {
        await notificationService.createNotification(formData);
        setSuccessMsg('New notification created and activated.');
      }
      setIsModalOpen(false);
      fetchNotifications();
      fetchPushSubscribersCount();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to save notification.');
    } finally {
      setSaving(false);
    }
  };

  const handleManualPushBroadcast = async (id: number) => {
    setPushingId(id);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await pushNotificationService.triggerAdminManualPush(id);
      setSuccessMsg(`Web Push Broadcast triggered! Delivered to ${res.deliveredCount} active push subscribers.`);
      fetchNotifications();
    } catch (err: any) {
      console.error('Failed to trigger push broadcast:', err);
      setErrorMsg('Failed to broadcast Web Push notification.');
    } finally {
      setPushingId(null);
    }
  };

  const handleToggleStatus = async (id: number, currentEnabled: boolean) => {
    try {
      await notificationService.updateStatus(id, !currentEnabled, undefined);
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this festival notification?')) {
      try {
        await notificationService.deleteNotification(id);
        setSuccessMsg('Notification deleted.');
        fetchNotifications();
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-extrabold text-white">Access Restricted</h2>
          <p className="text-xs text-slate-400">Admin authorization required to manage live festival notifications and Web Push.</p>
          <button
            onClick={() => navigate('/admin')}
            className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs shadow-lg"
          >
            Sign In to Committee Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-extrabold">
                  <Bell className="w-3.5 h-3.5" />
                  <span>Live Schedule & Web Push</span>
                </div>
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                  <Users className="w-3.5 h-3.5" />
                  <span>Push Subscribers: {pushSubscribersCount}</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                Festival Notification Management
              </h1>
              <p className="text-xs text-slate-400">
                Publish live timing changes, priest delays, and Web Push notifications for Ganesh Chaturthi 2026.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 active:scale-95 text-white font-extrabold text-xs shadow-lg shadow-orange-500/30 flex items-center space-x-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Announcement</span>
          </button>
        </div>

        {/* Success/Error Alerts */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Notifications Table / Cards */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
            <Bell className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300">No custom notifications created yet</p>
            <p className="text-xs text-slate-500">Click "Create Announcement" to add live reminders or timing changes.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((item) => {
              const isCritical = item.priority === 'CRITICAL';
              const isHigh = item.priority === 'HIGH';

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    !item.enabled
                      ? 'bg-slate-950/60 border-slate-800 opacity-60'
                      : isCritical
                      ? 'bg-rose-950/30 border-rose-500/40'
                      : isHigh
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-slate-900/90 border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            isCritical
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : isHigh
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                          }`}
                        >
                          {item.priority}
                        </span>

                        <span className="text-[10px] font-mono text-amber-300/80 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                          {item.notificationType.replace(/_/g, ' ')}
                        </span>

                        <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {item.repeatMode}
                        </span>

                        {item.sendPush && (
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            item.pushSent 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                              : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                          }`}>
                            {item.pushSent ? '✓ Push Broadcasted' : 'Push Enabled'}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-extrabold text-white">{item.title}</h3>
                      <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-3xl">{item.message}</p>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                        {item.eventDate && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3.5 h-3.5 text-orange-400" />
                            <span>Event: {item.eventDate}</span>
                          </div>
                        )}
                        {item.eventTime && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Time: {item.eventTime}</span>
                          </div>
                        )}
                        {item.createdBy && (
                          <span className="text-[11px] text-slate-500">By: {item.createdBy}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center space-x-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        disabled={pushingId === item.id}
                        onClick={() => handleManualPushBroadcast(item.id)}
                        className="px-3 py-2 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/40 text-xs font-extrabold transition flex items-center space-x-1"
                        title="Broadcast Instant Web Push to Subscribed Devices"
                      >
                        <Send className="w-3.5 h-3.5 text-orange-400" />
                        <span>{pushingId === item.id ? 'Sending Push...' : 'Send Push'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item.id, item.enabled)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center space-x-1 ${
                          item.enabled
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                        }`}
                        title={item.enabled ? 'Enabled' : 'Disabled'}
                      >
                        <Power className="w-4 h-4" />
                        <span className="hidden sm:inline">{item.enabled ? 'Active' : 'Disabled'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(item)}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition"
                        title="Edit timing or details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Form */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-xl font-extrabold text-white">
                  {editingId ? 'Edit Announcement / Live Timing' : 'Create Festival Announcement'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Nimajjanam Timing Update"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">Message *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="e.g. 🚩 Nimajjanam timing has been updated to 7:30 PM due to procession schedule."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 mb-1">Notification Type *</label>
                    <select
                      value={formData.notificationType}
                      onChange={(e) => setFormData({ ...formData, notificationType: e.target.value as NotificationType })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                    >
                      <option value="GENERAL_ANNOUNCEMENT">GENERAL ANNOUNCEMENT</option>
                      <option value="FESTIVAL_COUNTDOWN">FESTIVAL COUNTDOWN</option>
                      <option value="PUJA_REMINDER">PUJA REMINDER</option>
                      <option value="EVENT_REMINDER">EVENT REMINDER</option>
                      <option value="EVENT_STARTED">EVENT STARTED</option>
                      <option value="DECORATION">DECORATION</option>
                      <option value="CULTURAL_PROGRAM">CULTURAL PROGRAM</option>
                      <option value="DANCE_PROGRAM">DANCE PROGRAM</option>
                      <option value="MUSIC_PROGRAM">MUSIC PROGRAM</option>
                      <option value="PRASAD">PRASAD</option>
                      <option value="VOLUNTEER_REQUEST">VOLUNTEER REQUEST</option>
                      <option value="PRIEST_DELAY">PRIEST DELAY</option>
                      <option value="EVENT_DELAY">EVENT DELAY</option>
                      <option value="NIMAJJANAM_UPDATE">NIMAJJANAM UPDATE</option>
                      <option value="IMPORTANT_NOTICE">IMPORTANT NOTICE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 mb-1">Priority *</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as NotificationPriority })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                    >
                      <option value="CRITICAL">CRITICAL (Immediate Popup + Push)</option>
                      <option value="HIGH">HIGH (Important)</option>
                      <option value="NORMAL">NORMAL (Regular)</option>
                      <option value="LOW">LOW (Informational)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 mb-1">Event Date</label>
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 mb-1">Event Time</label>
                    <input
                      type="time"
                      value={formData.eventTime}
                      onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 mb-1">Repeat Mode</label>
                    <select
                      value={formData.repeatMode}
                      onChange={(e) => setFormData({ ...formData, repeatMode: e.target.value as RepeatMode })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                    >
                      <option value="ONCE_PER_SESSION">ONCE PER SESSION</option>
                      <option value="ONCE_PER_DAY">ONCE PER DAY</option>
                      <option value="EVERY_OPEN">EVERY OPEN</option>
                      <option value="UNTIL_DISMISSED">UNTIL DISMISSED</option>
                      <option value="SCHEDULED_WINDOW">SCHEDULED WINDOW</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 mb-1">Action Button Label (Optional)</label>
                    <input
                      type="text"
                      value={formData.actionLabel}
                      onChange={(e) => setFormData({ ...formData, actionLabel: e.target.value })}
                      placeholder="e.g. View Schedule"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <label className="flex items-center space-x-2 text-xs font-extrabold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enabled}
                      onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                      className="rounded border-slate-800 bg-slate-950 text-orange-500 focus:ring-orange-500"
                    />
                    <span>Active / Enabled</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-extrabold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sendPush}
                      onChange={(e) => setFormData({ ...formData, sendPush: e.target.checked })}
                      className="rounded border-slate-800 bg-slate-950 text-orange-500 focus:ring-orange-500"
                    />
                    <span>Send as Web Push Notification</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-extrabold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.dismissible}
                      onChange={(e) => setFormData({ ...formData, dismissible: e.target.checked })}
                      className="rounded border-slate-800 bg-slate-950 text-orange-500 focus:ring-orange-500"
                    />
                    <span>User Dismissible</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{saving ? 'Saving...' : editingId ? 'Update & Broadcast' : 'Publish & Send Push'}</span>
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
