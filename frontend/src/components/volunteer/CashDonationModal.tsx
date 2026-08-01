import React, { useState } from 'react';
import { X, WifiOff, CheckCircle } from 'lucide-react';
import { Festival } from '../../types';
import { saveToOfflineQueue } from '../../services/offlineStore';
import api from '../../services/api';

interface CashDonationModalProps {
  festival: Festival;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CashDonationModal: React.FC<CashDonationModalProps> = ({ festival, onClose, onSuccess }) => {
  const [donorName, setDonorName] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [donorAddress, setDonorAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('501');
  const [remarks, setRemarks] = useState<string>('');
  const [isOfflineMode] = useState<boolean>(!navigator.onLine);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [receiptInfo, setReceiptInfo] = useState<any>(null);

  const handleSubmitCash = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount < 1) return;

    const payload = {
      festivalId: festival.id,
      donorName: donorName || 'Devotee Donor',
      donorPhone: donorPhone,
      donorAddress: donorAddress,
      amount: numAmount,
      paymentType: 'CASH' as const,
      remarks: remarks || 'Recorded on-ground cash donation',
    };

    if (!navigator.onLine || isOfflineMode) {
      saveToOfflineQueue(payload);
      setReceiptInfo({
        receiptNumber: 'REC-OFFLINE-' + Math.floor(Math.random() * 100000),
        amount: numAmount,
        donorName: payload.donorName,
        isOffline: true,
      });
      setSubmitted(true);
      if (onSuccess) onSuccess();
      return;
    }

    try {
      const res = await api.post('/donations/cash', payload);
      setReceiptInfo(res.data);
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      saveToOfflineQueue(payload);
      setReceiptInfo({
        receiptNumber: 'REC-OFFLINE-' + Math.floor(Math.random() * 100000),
        amount: numAmount,
        donorName: payload.donorName,
        isOffline: true,
      });
      setSubmitted(true);
      if (onSuccess) onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="bg-slate-800 p-6 border-b border-slate-700 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Volunteer Cash Entry
            </span>
            {isOfflineMode && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <WifiOff className="w-3 h-3" /> Offline Queue Mode
              </span>
            )}
          </div>
          <h3 className="text-xl font-extrabold text-white">Record Cash Donation</h3>
          <p className="text-xs text-slate-400">{festival.name}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {!submitted ? (
            <form onSubmit={handleSubmitCash} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Donor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="501"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:border-orange-500 focus:outline-none font-bold text-orange-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Address (Optional)</label>
                <input
                  type="text"
                  placeholder="Area / Locality"
                  value={donorAddress}
                  onChange={(e) => setDonorAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Remarks / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Received at Gate 2 counter"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition"
              >
                Generate Instant Cash Receipt (₹{amount})
              </button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-4">
              <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto" />
              <h4 className="text-xl font-extrabold text-white">Cash Recorded Successfully!</h4>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Receipt No:</span>
                  <span className="font-mono font-bold text-orange-400">{receiptInfo.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Donor:</span>
                  <span className="text-white font-semibold">{receiptInfo.donorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount Received:</span>
                  <span className="font-bold text-emerald-400">₹{receiptInfo.amount}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-amber-400 font-bold">Pending Treasurer Deposit Verification</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-orange-600 font-bold text-white text-sm"
              >
                Close & Next Record
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
