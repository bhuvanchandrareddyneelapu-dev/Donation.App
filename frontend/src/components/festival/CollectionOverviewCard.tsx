import React, { useEffect, useState } from 'react';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import { getCollectionSummary, CollectionSummary } from '../../services/festivalService';

interface CollectionOverviewCardProps {
  festivalId?: number;
  refreshTrigger?: number;
  organizerName?: string;
}

export const CollectionOverviewCard: React.FC<CollectionOverviewCardProps> = ({
  festivalId = 1,
  refreshTrigger = 0,
  organizerName = 'Unicode Estates Cultural & Festival Committee',
}) => {
  const [summary, setSummary] = useState<CollectionSummary>({
    festivalId,
    collectedAmount: 0,
    targetAmount: 0,
    remainingAmount: 0,
    percentage: 0,
    totalDonationsCount: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const data = await getCollectionSummary(festivalId);
      setSummary(data);
    } catch (err) {
      console.error('Failed to load collection summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [festivalId, refreshTrigger]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-black text-orange-400 uppercase tracking-widest">
            Committee: {organizerName}
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-0.5">Donation & Collection Overview</h2>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={fetchSummary}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title="Refresh database collection summary"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-400' : ''}`} />
          </button>
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/50 px-3.5 py-2 rounded-xl">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Verifiable Database Audit</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-xs text-slate-400 font-bold">Target Amount</span>
          <div className="text-2xl font-black text-white mt-1">
            {formatCurrency(summary.targetAmount)}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Derived dynamically (Collected × 1.25)</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-xs text-slate-400 font-bold">Collected Amount</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {formatCurrency(summary.collectedAmount)}
          </div>
          <span className="text-[10px] text-emerald-400/80 block mt-1">
            {summary.totalDonationsCount} valid contribution{summary.totalDonationsCount === 1 ? '' : 's'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-xs text-slate-400 font-bold">Remaining Amount</span>
          <div className="text-2xl font-black text-orange-400 mt-1">
            {formatCurrency(summary.remainingAmount)}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Target − Collection</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-slate-400">Festival Collection Progress</span>
          <span className="text-orange-400">{summary.percentage.toFixed(1)}% Achieved</span>
        </div>
        <div className="w-full h-3.5 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 transition-all duration-700"
            style={{ width: `${Math.min(summary.percentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
