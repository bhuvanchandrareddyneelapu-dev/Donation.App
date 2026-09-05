import React from 'react';
import { CheckCircle2, Download, Send, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import { FestivalConfig } from '../../config/festivalConfig';

interface DonationSuccessProps {
  config: FestivalConfig;
  receiptData: any;
  onRestart: () => void;
}

export const DonationSuccess: React.FC<DonationSuccessProps> = ({
  config,
  receiptData,
  onRestart,
}) => {
  const receiptNum = receiptData?.receiptNumber || 'UNI-GAN-2026-8812';
  const amountPaid = receiptData?.amount || 501;
  const donorName = receiptData?.donorName || 'Devotee';

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center py-8 px-4">
      <div className="max-w-2xl w-full bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-center relative overflow-hidden">
        
        {/* Top Decorative Success Bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-orange-500" />

        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/50">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        {/* Headings */}
        <div className="space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
            Contribution Verified
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Donation Successful! 🙏
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Thank you for supporting {config.festivalName}.
          </p>
        </div>

        {/* Small Ganesh Idol Visual Badge */}
        <div className="relative max-w-xs mx-auto rounded-2xl overflow-hidden border border-amber-500/30 shadow-lg bg-slate-950">
          <img
            src={config.idolImageUrl}
            alt="Lord Ganesha"
            className="w-full h-36 object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-2 inset-x-0 text-xs font-bold text-amber-300">
            Ganpati Bappa Morya! 🌺
          </div>
        </div>

        {/* Receipt Information Card */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3 text-xs">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
            <span className="text-slate-400 font-semibold">Receipt Number:</span>
            <span className="font-mono font-black text-orange-400 text-sm">{receiptNum}</span>
          </div>

          <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
            <span className="text-slate-400 font-semibold">Amount Contributed:</span>
            <span className="font-black text-white text-base">₹{amountPaid.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
            <span className="text-slate-400 font-semibold">Donor Name:</span>
            <span className="font-bold text-slate-200">{donorName}</span>
          </div>

          <div className="pt-1 text-[11px] text-emerald-400 space-y-1.5 font-medium">
            <div className="flex items-center space-x-1.5">
              <Send className="w-3.5 h-3.5" />
              <span>Your PDF receipt has been sent to your email.</span>
            </div>
            <div className="flex items-center space-x-1.5 text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recorded in 100% Itemized Public Audit Ledger</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <a
            href="/community"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 transition hover:brightness-110"
          >
            <Sparkles className="w-4 h-4" />
            <span>View Devotee Community Feed & Aarti Photos</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={`/verify-receipt?hash=${receiptData?.qrCodeHash || receiptNum}`}
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center space-x-2 border border-slate-700 transition"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>View Receipt</span>
            </a>

            <a
              href={`/api/v1/receipts/${receiptNum}/pdf`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-orange-600/30 transition"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Download PDF</span>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/donor/history"
              className="w-full sm:w-1/2 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 border border-slate-700 transition"
            >
              <span>Go to Donation History</span>
            </a>

            <button
              type="button"
              onClick={onRestart}
              className="w-full sm:w-1/2 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center space-x-2 border border-slate-700 transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
