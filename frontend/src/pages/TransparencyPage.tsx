import React, { useState } from 'react';
import { ShieldCheck, FileText, CheckCircle, PieChart as PieIcon, Download, Eye, ExternalLink } from 'lucide-react';
import { ExpenseChart } from '../components/transparency/ExpenseChart';

export const TransparencyPage: React.FC = () => {
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);

  const mockExpenses = [
    {
      id: 1,
      title: 'Eco-friendly Floral Pandal & Theme Decor',
      category: 'DECORATION',
      amount: 450000,
      vendorName: 'Maharashtrian Floral Designers & Decorators',
      paidBy: 'Treasurer - Sunil Deshmukh',
      paymentDate: '2026-07-28',
      proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
    },
    {
      id: 2,
      title: 'Daily 24x7 Mahaprasadam & Modak Kitchen (15,000 Devotees)',
      category: 'PRASADAM',
      amount: 680000,
      vendorName: 'Shree Annapurna Catering Services',
      paidBy: 'Treasurer - Sunil Deshmukh',
      paymentDate: '2026-07-30',
      proofUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800',
    },
    {
      id: 3,
      title: 'LED Stage Lighting & High-Definition Sound Rigging',
      category: 'LIGHTING',
      amount: 220000,
      vendorName: 'SoundWave Acoustics Pvt Ltd',
      paidBy: 'Org Admin - Rajesh Kulkarni',
      paymentDate: '2026-07-29',
      proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
    },
    {
      id: 4,
      title: 'Heavy Duty Silent Diesel Generator (Backup Power)',
      category: 'GENERATOR',
      amount: 85000,
      vendorName: 'PowerGen Rental Services',
      paidBy: 'Treasurer - Sunil Deshmukh',
      paymentDate: '2026-07-31',
      proofUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800',
    },
    {
      id: 5,
      title: 'Police Permission, Security Guards & Crowd Control Barriers',
      category: 'POLICE_PERMISSION',
      amount: 65000,
      vendorName: 'Shield Force Security Agency',
      paidBy: 'Org Admin - Rajesh Kulkarni',
      paymentDate: '2026-07-27',
      proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
    },
  ];

  const totalExpense = mockExpenses.reduce((acc, curr) => acc + curr.amount, 0);

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

        {/* Top Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="text-xs font-bold text-slate-400 uppercase">Total Collection</div>
            <div className="text-2xl font-black text-emerald-400 mt-2">₹34,50,000</div>
            <div className="text-[10px] text-slate-500 mt-1">Verified via Razorpay & Cash Logs</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="text-xs font-bold text-slate-400 uppercase">Total Expenses Paid</div>
            <div className="text-2xl font-black text-rose-400 mt-2">₹15,00,000</div>
            <div className="text-[10px] text-slate-500 mt-1">Backed by uploaded invoices</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="text-xs font-bold text-slate-400 uppercase">Net Festival Fund Balance</div>
            <div className="text-2xl font-black text-orange-400 mt-2">₹19,50,000</div>
            <div className="text-[10px] text-slate-500 mt-1">In Mandal Bank Escrow</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="text-xs font-bold text-slate-400 uppercase">Audit Score</div>
            <div className="text-2xl font-black text-amber-400 mt-2">99.4%</div>
            <div className="text-[10px] text-slate-500 mt-1">Publicly Certified Audit</div>
          </div>
        </div>

        {/* Charts & Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          <div className="lg:col-span-5">
            <ExpenseChart categoryData={{
              DECORATION: 450000,
              PRASADAM: 680000,
              LIGHTING: 220000,
              GENERATOR: 85000,
              POLICE_PERMITS: 65000
            }} />
          </div>

          {/* Line by line table */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 overflow-hidden">
            <h4 className="text-lg font-bold text-white mb-4">Line-Item Expense Ledger</h4>
            
            <div className="divide-y divide-slate-800 overflow-x-auto">
              {mockExpenses.map((exp) => (
                <div key={exp.id} className="py-4 flex items-center justify-between space-x-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-orange-400 border border-slate-700">
                        {exp.category}
                      </span>
                      <span className="text-xs text-slate-400">{exp.paymentDate}</span>
                    </div>
                    <h5 className="text-sm font-bold text-white mt-1">{exp.title}</h5>
                    <div className="text-xs text-slate-500 mt-0.5">Vendor: {exp.vendorName}</div>
                  </div>

                  <div className="text-right flex items-center space-x-4">
                    <div>
                      <div className="text-sm font-extrabold text-rose-400">₹{exp.amount.toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-slate-500">{exp.paidBy}</div>
                    </div>

                    <button
                      onClick={() => setSelectedProofUrl(exp.proofUrl)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                      title="Inspect Bill / Invoice Proof"
                    >
                      <Eye className="w-4 h-4 text-orange-400" />
                    </button>
                  </div>
                </div>
              ))}
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
            <div className="aspect-video rounded-2xl overflow-hidden border border-slate-800 mb-4">
              <img src={selectedProofUrl} alt="Bill Proof" className="w-full h-full object-cover" />
            </div>
            <p className="text-xs text-slate-400">
              Verified by Treasurer Sunil Deshmukh with Digital Signature Hash #VERIFIED_PROOF_99218
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
