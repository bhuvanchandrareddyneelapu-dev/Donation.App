import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck, AlertCircle, KeyRound, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const sessionExpiredNotice = location.state?.sessionExpired;

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<'REQUEST' | 'RESET'>('REQUEST');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotMaskedPhone, setForgotMaskedPhone] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const demoAccounts = [
    { role: 'SUPER_ADMIN', name: 'Super Admin', email: 'superadmin@donation.app', pass: 'admin123', bg: 'bg-purple-600' },
    { role: 'FESTIVAL_ADMIN', name: 'Festival Admin', email: 'festivaladmin@donation.app', pass: 'admin123', bg: 'bg-orange-600' },
    { role: 'TREASURER', name: 'Treasurer', email: 'treasurer@donation.app', pass: 'treasurer123', bg: 'bg-emerald-600' },
    { role: 'VOLUNTEER', name: 'Volunteer', email: 'volunteer@donation.app', pass: 'volunteer123', bg: 'bg-blue-600' },
  ];

  const [error, setError] = useState('');

  const handleQuickLogin = async (demo: typeof demoAccounts[0]) => {
    try {
      setError('');
      const res = await api.post('/auth/login', { email: demo.email, password: demo.pass });
      login({
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone,
        role: res.data.role,
        token: res.data.token,
      });
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err?.response?.status === 403) {
        setError("You are not authorized to access the committee dashboard.");
      } else {
        setError(err?.response?.data?.message || 'Authentication failed. Please try again.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      setError('');
      const res = await api.post('/auth/login', { email, password });
      login({
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone,
        role: res.data.role,
        token: res.data.token,
      });
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err?.response?.status === 403) {
        setError("You are not authorized to access the committee dashboard.");
      } else {
        setError(err?.response?.data?.message || 'Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Request Handler
  const handleRequestForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setForgotLoading(true);
      setForgotError('');
      setForgotSuccess('');
      const res = await api.post('/admin/auth/forgot-password/request-otp', { email: forgotEmail });
      setForgotMaskedPhone(res.data.maskedPhone || '');
      setForgotStep('RESET');
      setForgotSuccess(res.data.message || 'If the account is eligible, an OTP has been sent.');
    } catch (err: any) {
      setForgotError(err?.response?.data?.message || 'Failed to process request.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Forgot Password Reset Handler
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('New password and confirmation password do not match.');
      return;
    }

    try {
      setForgotLoading(true);
      setForgotError('');
      setForgotSuccess('');
      const res = await api.post('/admin/auth/forgot-password/reset', {
        email: forgotEmail,
        otp: forgotOtp,
        newPassword: forgotNewPassword,
        confirmPassword: forgotConfirmPassword,
      });
      setForgotSuccess(res.data.message || 'Password reset successfully.');
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotStep('REQUEST');
        setEmail(forgotEmail);
      }, 2000);
    } catch (err: any) {
      setForgotError(err?.response?.data?.message || 'Password reset failed. Please check OTP and details.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 py-16">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-orange-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Committee Admin Portal</h2>
          <p className="text-xs text-slate-400">For Super Admin, Festival Admin, Treasurer & Volunteers</p>
        </div>

        {sessionExpiredNotice && (
          <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-extrabold flex items-center justify-center space-x-2 animate-pulse">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Your admin session has expired. Please log in again.</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold text-center">
            {error}
          </div>
        )}

        {/* Demo Logins */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
            ⚡ Quick Single-Click Committee Logins
          </span>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.role}
                type="button"
                onClick={() => handleQuickLogin(acc)}
                className={`p-2.5 rounded-xl ${acc.bg} text-white font-bold text-xs shadow-md hover:brightness-110 transition flex items-center justify-between`}
              >
                <span>{acc.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Committee Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@donation.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-300">Password</label>
              <button
                type="button"
                onClick={() => { setShowForgotModal(true); setForgotStep('REQUEST'); setForgotError(''); setForgotSuccess(''); }}
                className="text-[11px] font-extrabold text-purple-400 hover:text-purple-300 transition"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm shadow-lg shadow-orange-600/30 transition"
          >
            {loading ? 'Authenticating...' : 'Sign In to Committee Portal'}
          </button>
        </form>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full relative shadow-2xl space-y-5">
            
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-black uppercase tracking-wider">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Super Admin Recovery</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">Reset Super Admin Password</h3>
              <p className="text-xs text-slate-400">Request OTP to registered recovery phone number.</p>
            </div>

            {forgotError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            {forgotStep === 'REQUEST' ? (
              <form onSubmit={handleRequestForgotOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Super Admin Account Email</label>
                  <input
                    type="email"
                    required
                    placeholder="superadmin@donation.app"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition flex items-center justify-center space-x-2"
                >
                  <span>{forgotLoading ? 'Requesting OTP...' : 'Send Recovery OTP'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {forgotMaskedPhone && (
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-[11px] font-bold text-purple-300 text-center">
                    OTP sent to registered phone ({forgotMaskedPhone})
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono text-center tracking-widest focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">New Password (Min 8 Chars)</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="••••••••"
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="••••••••"
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition"
                >
                  {forgotLoading ? 'Resetting Password...' : 'Reset Password & BCrypt Hash'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
