import React, { useState } from 'react';
import { X, ShieldCheck, KeyRound, Phone, Smartphone, Lock, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../../services/api';

interface SuperAdminSecurityModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

export const SuperAdminSecurityModal: React.FC<SuperAdminSecurityModalProps> = ({ isOpen = true, onClose }) => {
  if (!isOpen) return null;
  const [activeTab, setActiveTab] = useState<'PASSWORD' | 'PHONE'>('PASSWORD');
  
  // Change Password State
  const [pwdStep, setPwdStep] = useState<'REQUEST' | 'VERIFY'>('REQUEST');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMaskedPhone, setPwdMaskedPhone] = useState('');
  
  // Phone Change State (4-Step Dual OTP Verification)
  const [phoneStep, setPhoneStep] = useState<'REQUEST_CURRENT_OTP' | 'VERIFY_CURRENT_OTP' | 'ENTER_NEW_PHONE' | 'VERIFY_NEW_PHONE_OTP'>('REQUEST_CURRENT_OTP');
  const [currentPassword, setCurrentPassword] = useState('');
  const [currentPhoneOtp, setCurrentPhoneOtp] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPhoneOtp, setNewPhoneOtp] = useState('');
  const [phoneMaskedPhone, setPhoneMaskedPhone] = useState('');
  const [newPhoneMasked, setNewPhoneMasked] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ----------------------------------------------------
  // Password Change Handlers
  // ----------------------------------------------------
  const handleRequestPasswordOtp = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const res = await api.post('/superadmin/security/request-change-password-otp');
      setPwdMaskedPhone(res.data.maskedPhone || 'registered phone');
      setPwdStep('VERIFY');
      setSuccess(res.data.message || 'OTP sent successfully.');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to request OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation password do not match.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const res = await api.post('/superadmin/security/change-password', {
        otp,
        newPassword,
        confirmPassword,
      });
      setSuccess(res.data.message || 'Super Admin password updated successfully.');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Password change failed. Please check OTP and requirements.');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // Phone Update Handlers (2-Step Dual OTP)
  // ----------------------------------------------------
  // Step 1: Request OTP to Current Phone
  const handleRequestCurrentPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const res = await api.post('/superadmin/security/request-phone-change-otp', {
        currentPassword,
      });
      setPhoneMaskedPhone(res.data.maskedPhone || 'current registered phone');
      setPhoneStep('VERIFY_CURRENT_OTP');
      setSuccess(res.data.message || 'OTP sent to current registered phone.');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Authentication failed. Please verify current password.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Current Phone OTP
  const handleVerifyCurrentPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const res = await api.post('/superadmin/security/phone/verify-current-otp', {
        otp: currentPhoneOtp,
      });
      setPhoneStep('ENTER_NEW_PHONE');
      setSuccess(res.data.message || 'Current phone verified successfully! Now enter your new phone number.');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Verification failed. Please check OTP and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Enter New Phone & Request OTP to New Phone
  const handleRequestNewPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhone || newPhone.trim().length < 10) {
      setError('Please enter a valid 10-digit new phone number.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const res = await api.post('/superadmin/security/phone/request-new-otp', {
        newPhone: newPhone.trim(),
      });
      setNewPhoneMasked(res.data.maskedPhone || newPhone);
      setPhoneStep('VERIFY_NEW_PHONE_OTP');
      setSuccess(res.data.message || 'OTP sent to new recovery phone.');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to send OTP to new phone.');
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Verify New Phone OTP & Finalize Phone Update
  const handleVerifyNewPhoneOtpAndUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const res = await api.post('/superadmin/security/phone/verify-new-otp', {
        otp: newPhoneOtp,
        newPhone: newPhone.trim(),
      });
      setSuccess(res.data.message || 'Recovery phone updated successfully.');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update recovery phone. Check OTP and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full relative shadow-2xl space-y-6">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Super Admin Security Engine</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">Credentials & Recovery</h3>
          <p className="text-xs text-slate-400">Manage BCrypt encrypted Super Admin password & phone recovery.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex space-x-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => { setActiveTab('PASSWORD'); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'PASSWORD' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Change Password</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('PHONE'); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'PHONE' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Recovery Phone</span>
          </button>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        {/* Tab 1: Change Password Flow */}
        {activeTab === 'PASSWORD' && (
          <div>
            {pwdStep === 'REQUEST' ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
                  <p className="font-bold text-white">🔒 Two-Step OTP Password Change</p>
                  <p className="text-slate-400">
                    Clicking below dispatches a 6-digit cryptographic OTP to your registered Super Admin phone number.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRequestPasswordOtp}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition flex items-center justify-center space-x-2"
                >
                  <span>{loading ? 'Generating OTP...' : 'Send OTP to Registered Phone'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmPasswordChange} className="space-y-4">
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-[11px] font-bold text-purple-300 text-center">
                  OTP sent to {pwdMaskedPhone}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
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
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition"
                >
                  {loading ? 'Verifying & Updating...' : 'Update BCrypt Password Hash'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Change Recovery Phone Flow (Dual-OTP Verification) */}
        {activeTab === 'PHONE' && (
          <div>
            {phoneStep === 'REQUEST_CURRENT_OTP' && (
              <form onSubmit={handleRequestCurrentPhoneOtp} className="space-y-4">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                  Step 1: Authenticate with password to send OTP to your <strong className="text-white">CURRENT</strong> registered recovery phone.
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Current Super Admin Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition flex items-center justify-center space-x-2"
                >
                  <span>{loading ? 'Authenticating...' : 'Send OTP to CURRENT Phone'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {phoneStep === 'VERIFY_CURRENT_OTP' && (
              <form onSubmit={handleVerifyCurrentPhoneOtp} className="space-y-4">
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-[11px] font-bold text-purple-300 text-center">
                  Step 2: Enter 6-digit OTP sent to current phone ({phoneMaskedPhone})
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Current Phone OTP</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={currentPhoneOtp}
                    onChange={(e) => setCurrentPhoneOtp(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono text-center tracking-widest focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition"
                >
                  {loading ? 'Verifying Current Phone...' : 'Verify Current Phone OTP'}
                </button>
              </form>
            )}

            {phoneStep === 'ENTER_NEW_PHONE' && (
              <form onSubmit={handleRequestNewPhoneOtp} className="space-y-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-bold">
                  ✅ Current phone verified! Now enter your NEW recovery phone number to receive a verification OTP.
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">New Recovery Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43299"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition flex items-center justify-center space-x-2"
                >
                  <span>{loading ? 'Sending...' : 'Send Verification OTP to NEW Phone'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {phoneStep === 'VERIFY_NEW_PHONE_OTP' && (
              <form onSubmit={handleVerifyNewPhoneOtpAndUpdate} className="space-y-4">
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-[11px] font-bold text-purple-300 text-center">
                  Step 4: Enter 6-digit OTP sent to new phone ({newPhoneMasked})
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">New Phone OTP</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="654321"
                    value={newPhoneOtp}
                    onChange={(e) => setNewPhoneOtp(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono text-center tracking-widest focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition"
                >
                  {loading ? 'Verifying & Updating Database...' : 'Verify New Phone & Update Database'}
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
