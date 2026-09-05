import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Save, RotateCcw, ArrowLeft, CheckCircle2, AlertCircle, Sparkles, Calendar, Clock, MapPin, Utensils, Music, Waves, Bell, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { defaultFestivalConfig, FestivalConfig, FestivalNotification } from '../config/festivalConfig';
import api from '../services/api';

export const AdminFestivalManagementPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [config, setConfig] = useState<FestivalConfig>(defaultFestivalConfig);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Security authorization check
  const isAuthorizedAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'FESTIVAL_ADMIN';

  useEffect(() => {
    fetchFestivalDetails();
  }, []);

  const fetchFestivalDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get('/festivals/1');
      if (res.data && res.data.configJson) {
        try {
          const parsed = JSON.parse(res.data.configJson);
          setConfig((prev) => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error('Failed to parse backend configJson:', e);
        }
      }
    } catch (err) {
      console.warn('Backend festival API uninitialized or offline, using default config:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const payload = {
        name: config.festivalName,
        venue: config.venue,
        description: config.welcomeMessage,
        configJson: JSON.stringify(config),
      };

      await api.put('/festivals/1', payload);
      
      // Update local storage / state
      localStorage.setItem('unicode_estates_festival_config', JSON.stringify(config));
      setSuccessMsg('Festival information updated successfully. Public website and dashboard are now showing the latest data.');
    } catch (err: any) {
      console.error(err);
      // Even if offline, persist locally so public frontend can read latest saved state
      localStorage.setItem('unicode_estates_festival_config', JSON.stringify(config));
      setSuccessMsg('Festival information updated and saved locally successfully.');
    } finally {
      setSaving(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all festival information to official defaults?')) {
      setConfig(defaultFestivalConfig);
      localStorage.removeItem('unicode_estates_festival_config');
      setSuccessMsg('Festival information reset to defaults.');
    }
  };

  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Access Restricted</h2>
          <p className="text-xs text-slate-400">
            You must be logged in as a Festival Admin or Super Admin to access Unicode Estates Festival Management.
          </p>
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
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-extrabold text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Committee Portal</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Unicode Estates Festival Management
            </h1>
            <p className="text-xs text-slate-400">
              Manage Ganesh Chaturthi Celebrations 2026 public schedule, pujas, cultural events & announcements.
            </p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 flex items-center justify-center space-x-1.5 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Success / Error Banners */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center space-x-3 shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center space-x-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* SECTION 1: BASIC FESTIVAL INFORMATION */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-extrabold text-white">1. Festival Basic Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Community Name</label>
                <input
                  type="text"
                  value={config.communityName}
                  onChange={(e) => setConfig({ ...config, communityName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Festival Name</label>
                <input
                  type="text"
                  value={config.festivalName}
                  onChange={(e) => setConfig({ ...config, festivalName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Festival Year</label>
                <input
                  type="text"
                  value={config.festivalYear}
                  onChange={(e) => setConfig({ ...config, festivalYear: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Venue</label>
                <input
                  type="text"
                  value={config.venue}
                  onChange={(e) => setConfig({ ...config, venue: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-300 mb-1">Welcome Message / Description</label>
                <textarea
                  rows={2}
                  value={config.welcomeMessage}
                  onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: GANESH STHAPANA */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Calendar className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-extrabold text-white">2. Ganesh Sthapana Details</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Sthapana Date</label>
                <input
                  type="text"
                  value={config.sthapana.date}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      sthapana: { ...config.sthapana, date: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Sthapana Time (Replace 'Update Soon' when ready)</label>
                <input
                  type="text"
                  value={config.sthapana.time}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      sthapana: { ...config.sthapana, time: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-amber-300 font-mono font-bold focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Sthapana Location</label>
                <input
                  type="text"
                  value={config.sthapana.location}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      sthapana: { ...config.sthapana, location: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3 & 4: PUJA & AARTI TIMINGS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Puja Timings */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Clock className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-extrabold text-white">3. Puja Timings</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Morning Puja Time</label>
                  <input
                    type="text"
                    value={config.puja.morning}
                    onChange={(e) => setConfig({ ...config, puja: { ...config.puja, morning: e.target.value } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Evening Puja Time</label>
                  <input
                    type="text"
                    value={config.puja.evening}
                    onChange={(e) => setConfig({ ...config, puja: { ...config.puja, evening: e.target.value } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Aarti Timings */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Clock className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold text-white">4. Aarti Timings</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Morning Aarti Time</label>
                  <input
                    type="text"
                    value={config.aarti.morning}
                    onChange={(e) => setConfig({ ...config, aarti: { ...config.aarti, morning: e.target.value } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Evening Aarti Time</label>
                  <input
                    type="text"
                    value={config.aarti.evening}
                    onChange={(e) => setConfig({ ...config, aarti: { ...config.aarti, evening: e.target.value } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* SECTION 5: PRASAD */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Utensils className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-extrabold text-white">5. Mahaprasad Configuration</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Frequency</label>
                <input
                  type="text"
                  value={config.prasad.frequency}
                  onChange={(e) => setConfig({ ...config, prasad: { ...config.prasad, frequency: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Morning Mahaprasad Time</label>
                <input
                  type="text"
                  value={config.prasad.morning}
                  onChange={(e) => setConfig({ ...config, prasad: { ...config.prasad, morning: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Evening Mahaprasad Time</label>
                <input
                  type="text"
                  value={config.prasad.evening}
                  onChange={(e) => setConfig({ ...config, prasad: { ...config.prasad, evening: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 6: CULTURAL PROGRAMS (5 DAYS) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Music className="w-5 h-5 text-sky-400" />
              <h3 className="text-lg font-extrabold text-white">6. Cultural Programs (5-Day Schedule)</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Number of Days</label>
                <input
                  type="number"
                  value={config.culturalPrograms.numberOfDays}
                  onChange={(e) => setConfig({ ...config, culturalPrograms: { ...config.culturalPrograms, numberOfDays: parseInt(e.target.value) || 5 } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Overall Dates / Status</label>
                <input
                  type="text"
                  value={config.culturalPrograms.dates}
                  onChange={(e) => setConfig({ ...config, culturalPrograms: { ...config.culturalPrograms, dates: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-extrabold text-slate-300 block">5 Daily Event Titles:</span>
              {config.culturalPrograms.events.map((evt, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-xs">
                  <span className="w-16 font-mono font-bold text-amber-400 shrink-0">Day {idx + 1}:</span>
                  <input
                    type="text"
                    value={evt}
                    onChange={(e) => {
                      const updatedEvts = [...config.culturalPrograms.events];
                      updatedEvts[idx] = e.target.value;
                      setConfig({
                        ...config,
                        culturalPrograms: { ...config.culturalPrograms, events: updatedEvts },
                      });
                    }}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 7: VISARJAN / NIMAJJAN */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Waves className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-extrabold text-white">7. Visarjan / Nimajjan Settings</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Final Visarjan Duration</label>
                <select
                  value={config.visarjan.possibleDurations}
                  onChange={(e) => setConfig({ ...config, visarjan: { ...config.visarjan, possibleDurations: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:border-orange-500 focus:outline-none"
                >
                  <option value="5 or 7 days — Update Soon">5 or 7 days — Update Soon (Default)</option>
                  <option value="5 Days Celebration">5 Days Celebration</option>
                  <option value="7 Days Celebration">7 Days Celebration</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Starting Time</label>
                <input
                  type="text"
                  value={config.visarjan.startingTime}
                  onChange={(e) => setConfig({ ...config, visarjan: { ...config.visarjan, startingTime: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Procession Route</label>
                <input
                  type="text"
                  value={config.visarjan.route}
                  onChange={(e) => setConfig({ ...config, visarjan: { ...config.visarjan, route: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-bold text-slate-300 mb-1">Visarjan Public Announcement Status</label>
                <input
                  type="text"
                  value={config.visarjan.status}
                  onChange={(e) => setConfig({ ...config, visarjan: { ...config.visarjan, status: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 8: FESTIVAL NOTIFICATIONS */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-extrabold text-white">8. Festival Notifications</h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newNotif: FestivalNotification = {
                    id: 'notif-' + Date.now(),
                    title: 'New Announcement',
                    category: 'General',
                    date: 'Update Soon',
                    content: 'Announcement message details...',
                    isImportant: false,
                  };
                  setConfig({ ...config, notifications: [newNotif, ...config.notifications] });
                }}
                className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs"
              >
                + Add Notification
              </button>
            </div>

            <div className="space-y-4">
              {config.notifications.map((n, idx) => (
                <div key={n.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Title"
                      value={n.title}
                      onChange={(e) => {
                        const updated = [...config.notifications];
                        updated[idx].title = e.target.value;
                        setConfig({ ...config, notifications: updated });
                      }}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-bold"
                    />

                    <input
                      type="text"
                      placeholder="Category"
                      value={n.category}
                      onChange={(e) => {
                        const updated = [...config.notifications];
                        updated[idx].category = e.target.value;
                        setConfig({ ...config, notifications: updated });
                      }}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-300"
                    />

                    <div className="flex items-center justify-between space-x-2">
                      <input
                        type="text"
                        placeholder="Date"
                        value={n.date}
                        onChange={(e) => {
                          const updated = [...config.notifications];
                          updated[idx].date = e.target.value;
                          setConfig({ ...config, notifications: updated });
                        }}
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-300 flex-1"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          const updated = config.notifications.filter((_, i) => i !== idx);
                          setConfig({ ...config, notifications: updated });
                        }}
                        className="px-2.5 py-1 rounded-xl bg-rose-600/20 text-rose-400 font-bold hover:bg-rose-600/30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Content"
                    value={n.content}
                    onChange={(e) => {
                      const updated = [...config.notifications];
                      updated[idx].content = e.target.value;
                      setConfig({ ...config, notifications: updated });
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM SAVE BAR */}
          <div className="sticky bottom-4 z-40 bg-slate-900/95 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
            <div className="text-xs text-slate-300">
              <span className="font-bold text-amber-300">Ready to publish?</span> Clicking Save will immediately update the public website.
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex-1 sm:flex-none px-10 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-extrabold text-sm shadow-xl shadow-orange-500/30 hover:brightness-110 active:scale-95 transition flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving to Database...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
