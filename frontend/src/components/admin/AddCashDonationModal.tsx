import React, { useState } from 'react';
import { X, DollarSign, CheckCircle, Download, Send, AlertCircle, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

interface AddCashDonationModalProps {
  festivalId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddCashDonationModal: React.FC<AddCashDonationModalProps> = ({
  festivalId,
  onClose,
  onSuccess,
}) => {
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [noEmail, setNoEmail] = useState(false);
  const [gotram, setGotram] = useState('');
  const [familyDetails, setFamilyDetails] = useState('');
  const [amount, setAmount] = useState<number>(1000);
  const [purpose, setPurpose] = useState('GANESH_CHATURTHI');
  const [publicVisibility, setPublicVisibility] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdReceipt, setCreatedReceipt] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent double-submit

    if (!donorName.trim()) {
      setErrorMsg('Please enter donor name.');
      return;
    }
    if (!donorPhone.trim()) {
      setErrorMsg('Please enter donor phone number.');
      return;
    }
    if (!amount || amount < 1) {
      setErrorMsg('Donation amount must be at least ₹1.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        festivalId,
        donorName: donorName.trim(),
        donorPhone: donorPhone.trim(),
        donorEmail: noEmail ? '' : donorEmail.trim(),
        gotram: gotram.trim(),
        familyDetails: familyDetails.trim(),
        publicVisibility,
        isAnonymous,
        amount,
        purpose,
        paymentType: 'CASH',
        remarks: notes.trim() || 'Physical cash contribution recorded by Super Admin',
      };

      const res = await api.post('/donations/manual', payload);
      setCreatedReceipt(res.data);
      window.dispatchEvent(new Event('donation-updated'));
      onSuccess();
    } catch (err: any) {
      console.error('Failed to record manual cash donation:', err);
      setErrorMsg(err?.response?.data?.message || err?.response?.data?.error || 'Failed to record cash donation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-950/30 hover:bg-slate-950/60 transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-black/20 tracking-wider">
              Super Admin Action
            </span>
          </div>
          <h3 className="text-xl font-black flex items-center space-x-2">
            <DollarSign className="w-6 h-6 text-amber-300" />
            <span>Record Offline / Cash Donation</span>
          </h3>
          <p className="text-xs text-emerald-100 mt-1">Official instant receipt and DB ledger update</p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="p-6">
          {!createdReceipt ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Donor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. N.Govinda Reddy(209)"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 6304151954"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Gotram (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Nagula Gotram"
                    value={gotram}
                    onChange={(e) => setGotram(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Family Details (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. N.Govinda Reddy & N.Leela Rani Family"
                    value={familyDetails}
                    onChange={(e) => setFamilyDetails(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Email Address (For PDF Receipt)</label>
                <input
                  type="email"
                  disabled={noEmail}
                  placeholder="e.g. donor@example.com"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none disabled:opacity-50 mb-1"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="noEmailCash"
                    checked={noEmail}
                    onChange={(e) => {
                      setNoEmail(e.target.checked);
                      if (e.target.checked) setDonorEmail('');
                    }}
                    className="w-3.5 h-3.5 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="noEmailCash" className="text-[11px] text-slate-400 cursor-pointer">
                    No email provided (Receipt stored in app)
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-amber-400 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="1516"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-base font-extrabold text-emerald-400 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Donation Purpose</label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="GANESH_CHATURTHI">Ganesh Chaturthi Main Fund</option>
                    <option value="ANNADANAM">Mahaprasadam / Annadhanam</option>
                    <option value="POOJA_EXPENSE">Puja & Flowers Decoration</option>
                    <option value="CULTURAL_EVENT">Cultural Programs & Sound</option>
                    <option value="VISARJAN">Visarjan Procession</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Notes / Admin Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Cash collected by super admin"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="publicVisCheck"
                    checked={publicVisibility}
                    onChange={(e) => setPublicVisibility(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="publicVisCheck" className="text-xs text-slate-300 cursor-pointer">
                    Show donation on public community donor wall (`/donors`)
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="anonymousCheck"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="anonymousCheck" className="text-xs text-slate-300 cursor-pointer">
                    Display as Anonymous Devotee on public wall
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>Committing Cash Entry...</span>
                ) : (
                  <span>Record Cash Donation ₹{amount?.toLocaleString('en-IN')} & Issue Receipt</span>
                )}
              </button>

            </form>
          ) : (
            <div className="text-center py-4 space-y-5">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-white">Cash Donation Recorded!</h4>
                <p className="text-xs text-slate-400 mt-1">Official Receipt #{createdReceipt?.receiptNumber} committed successfully</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Receipt No:</span>
                  <span className="font-mono font-bold text-orange-400">{createdReceipt?.receiptNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Donor Name:</span>
                  <span className="font-bold text-white">{createdReceipt?.donorName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Amount Paid:</span>
                  <span className="font-black text-emerald-400 text-sm">₹{createdReceipt?.amount?.toLocaleString('en-IN')} (CASH)</span>
                </div>
                {donorEmail && !noEmail && (
                  <div className="pt-1 text-[11px] text-emerald-400 font-bold flex items-center space-x-1">
                    <Send className="w-3.5 h-3.5" />
                    <span>PDF Receipt dispatched to {donorEmail}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <a
                  href={`/api/v1/receipts/${createdReceipt?.receiptNumber}/pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-1/2 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </a>
                <button
                  onClick={onClose}
                  className="w-1/2 py-3 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
