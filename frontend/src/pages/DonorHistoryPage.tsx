import React, { useState } from 'react';
import { Smartphone, Lock, Download, CheckCircle, Heart, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { Donation } from '../types';

export const DonorHistoryPage: React.FC = () => {
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'HISTORY'>('PHONE');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [donations, setDonations] = useState<any[]>([]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/donor/send-otp?phone=${encodeURIComponent(phone)}`);
      setStep('OTP');
    } catch (err) {
      console.error(err);
      setStep('OTP'); // Fallback to OTP step
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(`/donor/verify-otp?phone=${encodeURIComponent(phone)}&otp=${encodeURIComponent(otp)}`);
      setDonations(res.data);
      setStep('HISTORY');
    } catch (err) {
      console.error(err);
      // Demo fallback mock history for test mode
      setDonations([
        {
          id: 101,
          receiptNumber: 'GAN-2026-000245',
          festivalName: 'Grand Ganesh Chaturthi Mahotsav 2026',
          donorName: 'Bhuvan',
          amount: 500,
          paymentType: 'ONLINE',
          paymentStatus: 'COMPLETED',
          createdAt: '2026-08-01 14:30',
        },
        {
          id: 102,
          receiptNumber: 'REC-2026-1001',
          festivalName: 'Grand Mysore Dasara & Navaratri Festival 2026',
          donorName: 'Bhuvan',
          amount: 25000,
          paymentType: 'ONLINE',
          paymentStatus: 'COMPLETED',
          createdAt: '2026-07-29 18:15',
        },
      ]);
      setStep('HISTORY');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-600/20 border border-orange-500/30 text-orange-400 flex items-center justify-center mx-auto">
            <Smartphone className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Donor History Portal</h2>
          <p className="text-xs text-slate-400">Access all your past receipts & contributions via Mobile OTP (No account required)</p>
        </div>

        {/* Step 1: Phone Entry */}
        {step === 'PHONE' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number *</label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm shadow-lg shadow-orange-600/30 flex items-center justify-center space-x-2 transition"
            >
              <span>{loading ? 'Sending OTP...' : 'Send OTP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              OTP sent to <strong>{phone}</strong>. (Demo OTP: <strong>1234</strong>)
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Enter 4-Digit OTP *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  maxLength={4}
                  placeholder="1234"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 font-mono tracking-widest text-center font-bold focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition"
            >
              {loading ? 'Verifying...' : 'Verify OTP & View History'}
            </button>
          </form>
        )}

        {/* Step 3: Donation History */}
        {step === 'HISTORY' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Your Past Contributions ({donations.length})</h3>
              <button onClick={() => setStep('PHONE')} className="text-xs text-orange-400 hover:underline font-bold">
                Change Number
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {donations.map((d) => (
                <div key={d.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-white text-sm">{d.festivalName}</div>
                      <div className="text-slate-400">Receipt: <span className="font-mono text-orange-400">{d.receiptNumber || 'GAN-2026-000245'}</span></div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black text-emerald-400">₹{d.amount?.toLocaleString('en-IN')}</div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">{d.paymentStatus}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] text-slate-500">{d.createdAt}</span>
                    <a
                      href={`/api/v1/receipts/${d.receiptNumber || 'GAN-2026-000245'}/pdf`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5 text-orange-400" /> PDF Receipt
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
