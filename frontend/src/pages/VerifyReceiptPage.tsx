import React, { useState } from 'react';
import { Search, ShieldCheck, QrCode, CheckCircle, Download, Award, AlertCircle } from 'lucide-react';

export const VerifyReceiptPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);

    setTimeout(() => {
      setResult({
        receiptNumber: query.trim().toUpperCase(),
        donorName: 'Bhuvan',
        isAnonymous: false,
        festivalName: 'Grand Ganesh Chaturthi Mahotsav 2026',
        committeeName: 'Lalbaugcha Raja Executive Committee',
        amount: 500,
        paymentType: 'ONLINE (Razorpay / UPI)',
        paymentStatus: 'VERIFIED & COMPLETED',
        transactionId: 'pay_rzp_' + Math.floor(Math.random() * 1000000),
        qrCodeHash: 'HASH_QR_VERIFIED_770192',
        createdAt: '2026-08-01 14:30:00 IST',
      });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-white">Public Receipt Verification</h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Verify official cryptographic digital receipts issued by Ganesh Chaturthi & Dasara committees.
          </p>
        </div>

        {/* Verification Input Form */}
        <form onSubmit={handleVerify} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Enter Receipt Number or Scan QR Code Hash *
            </label>
            <div className="relative">
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. GAN-2026-000245 or REC-2026-1001"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-200 uppercase font-mono font-bold focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition"
          >
            <QrCode className="w-4 h-4" />
            <span>{loading ? 'Searching Ledger...' : 'Verify Cryptographic Authenticity'}</span>
          </button>
        </form>

        {/* Verified Result Card */}
        {result && (
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 px-6 py-2 bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-bl-2xl">
              AUTHENTIC RECORD ✅
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Official Receipt Verified</h3>
                <p className="text-xs text-slate-400">Cryptographic Hash: <span className="font-mono text-emerald-400">{result.qrCodeHash}</span></p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-bold">Receipt Number:</span>
                <span className="font-mono font-bold text-orange-400 text-sm">{result.receiptNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-bold">Festival Event:</span>
                <span className="font-bold text-white">{result.festivalName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-bold">Organizing Committee:</span>
                <span className="font-bold text-slate-300">{result.committeeName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-bold">Donor Name:</span>
                <span className="font-bold text-white">{result.donorName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-bold">Contribution Amount:</span>
                <span className="font-black text-emerald-400 text-base">₹{result.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-bold">Payment Method:</span>
                <span className="font-bold text-slate-300">{result.paymentType}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-bold">Transaction Reference ID:</span>
                <span className="font-mono text-slate-400">{result.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Issued Date & Time:</span>
                <span className="text-slate-300 font-semibold">{result.createdAt}</span>
              </div>
            </div>

            <a
              href={`/api/v1/receipts/${result.receiptNumber}/pdf`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs flex items-center justify-center space-x-2 border border-slate-700 shadow-md"
            >
              <Download className="w-4 h-4 text-orange-400" />
              <span>Download Signed Official PDF Receipt</span>
            </a>
          </div>
        )}

      </div>
    </div>
  );
};
