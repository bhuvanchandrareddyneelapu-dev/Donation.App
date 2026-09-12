import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, CheckCircle, PieChart as PieIcon, Download, Eye, ExternalLink, AlertTriangle, Building2, UserCheck } from 'lucide-react';
import { ExpenseChart } from '../components/transparency/ExpenseChart';
import api from '../services/api';
import { Expense } from '../types';

interface TransparencySummary {
  festivalId: number;
  festivalName: string;
  totalCollection: number;
  totalExpenses: number;
  netBalance: number;
  remainingBalance: number;
  categoryBreakdown: Record<string, number>;
  expenseList: Expense[];
}

export const TransparencyPage: React.FC = () => {
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<TransparencySummary>({
    festivalId: 1,
    festivalName: 'Unicode Estates Ganesh Chaturthi 2026',
    totalCollection: 0,
    totalExpenses: 0,
    netBalance: 0,
    remainingBalance: 0,
    categoryBreakdown: {},
    expenseList: [],
  });

  const loadTransparencyData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/transparency/festival/1/summary');
      setSummary(res.data);
    } catch (err) {
      console.error('Failed to load transparency summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransparencyData();

    const handleDonationUpdated = () => {
      loadTransparencyData();
    };

    window.addEventListener('donation-updated', handleDonationUpdated);
    return () => {
      window.removeEventListener('donation-updated', handleDonationUpdated);
    };
  }, []);

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt);
  };

  const isDeficit = summary.netBalance < 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Public Financial Audit Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Live Festival Transparency Portal</h1>
          <p className="text-slate-400 text-sm mt-2">
            Every single rupee collected is tracked against verified vendor bills, bank deposit statements, and public invoices.
          </p>
        </div>

        {/* Top Summary Metric Cards (Collected, Spent, Balance) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          
          {/* Total Collected */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Collected</div>
            <div className="text-3xl font-black text-emerald-400 mt-2">
              {formatCurrency(summary.totalCollection)}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Verified from completed online & verified cash donations
            </div>
          </div>

          {/* Total Spent */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Spent</div>
            <div className="text-3xl font-black text-rose-400 mt-2">
              {formatCurrency(summary.totalExpenses)}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Sum of verified committee expense vouchers
            </div>
          </div>

          {/* Remaining Balance */}
          <div className={`bg-slate-900 border ${isDeficit ? 'border-rose-500/50 bg-rose-950/10' : 'border-slate-800'} rounded-3xl p-6 shadow-xl relative overflow-hidden`}>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Remaining Balance</span>
              {isDeficit && (
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Deficit
                </span>
              )}
            </div>
            <div className={`text-3xl font-black ${isDeficit ? 'text-rose-400' : 'text-orange-400'} mt-2`}>
              {formatCurrency(summary.netBalance)}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              {isDeficit ? 'Expenses exceed collection (Deficit)' : 'Total Collected − Total Spent'}
            </div>
          </div>

        </div>

        {/* Mandatory Transparency Trust Banner */}
        <div className="mb-10 p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex items-start space-x-3.5 shadow-lg">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">Public Financial Integrity Guarantee</h4>
            <p className="text-xs font-medium text-slate-300 leading-relaxed">
              Every amount shown here comes from actual donation and expense records maintained by authorized committee members. Financial changes are audit logged.
            </p>
          </div>
        </div>

        {/* Charts & Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Dynamic Category Breakdown Chart */}
          <div className="lg:col-span-5">
            <ExpenseChart categoryData={summary.categoryBreakdown} />
          </div>

          {/* Line by line table */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 overflow-hidden shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-white">Line-Item Expense Ledger</h4>
                <span className="text-xs text-slate-400 font-medium">
                  {summary.expenseList.length} {summary.expenseList.length === 1 ? 'Record' : 'Records'}
                </span>
              </div>

              {loading ? (
                <div className="py-16 text-center text-slate-500 text-sm">
                  Loading verified expense ledger...
                </div>
              ) : summary.expenseList.length > 0 ? (
                <div className="divide-y divide-slate-800 overflow-x-auto max-h-[460px] overflow-y-auto pr-1">
                  {summary.expenseList.map((exp) => (
                    <div key={exp.id} className="py-4 flex items-center justify-between space-x-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-800 text-orange-400 border border-slate-700">
                            {exp.category ? exp.category.replace(/_/g, ' ') : 'EXPENSE'}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{exp.paymentDate || 'N/A'}</span>
                        </div>
                        <h5 className="text-sm font-bold text-white mt-1">{exp.title}</h5>
                        <div className="text-xs text-slate-400 mt-0.5 flex items-center space-x-2">
                          <span>Vendor: <strong className="text-slate-300">{exp.vendorName || 'Not specified'}</strong></span>
                        </div>
                      </div>

                      <div className="text-right flex items-center space-x-4 shrink-0">
                        <div>
                          <div className="text-sm font-extrabold text-rose-400">₹{Number(exp.amount).toLocaleString('en-IN')}</div>
                          <div className="text-[10px] text-slate-500">{exp.paidBy || 'Committee'}</div>
                        </div>

                        {exp.proofUrl && (
                          <button
                            onClick={() => setSelectedProofUrl(exp.proofUrl!)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                            title="Inspect Bill / Invoice Proof"
                          >
                            <Eye className="w-4 h-4 text-orange-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center space-y-2 bg-slate-950/40 rounded-2xl border border-slate-800">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-300">No expenses recorded yet.</p>
                  <p className="text-xs text-slate-500">Official vendor payouts will appear here in real-time once verified by committee members.</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Invoice Proof Viewer Modal */}
      {selectedProofUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full relative">
            <button
              onClick={() => setSelectedProofUrl(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <h4 className="text-lg font-bold text-white mb-4">Verified Invoice & Bill Proof</h4>
            <div className="aspect-video rounded-2xl overflow-hidden border border-slate-800 mb-4 bg-slate-950 flex items-center justify-center">
              <img src={selectedProofUrl} alt="Bill Proof" className="w-full h-full object-contain" />
            </div>
            <p className="text-xs text-slate-400">
              Verified by Authorized Committee Member with Audit Trail Logged
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
