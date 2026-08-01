import React from 'react';
import { X, FileText, Download, Table, ShieldCheck } from 'lucide-react';

interface ReportsModalProps {
  onClose: () => void;
}

export const ReportsModal: React.FC<ReportsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full relative shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Export Audit Reports
          </span>
          <h3 className="text-xl font-extrabold text-white">Financial & Festival Reports</h3>
          <p className="text-xs text-slate-400">Export verified records for committee review and public audit compliance.</p>
        </div>

        <div className="space-y-3">
          
          {/* Donation Report */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Donation Summary Audit</h4>
                <p className="text-[10px] text-slate-400">All online & cash collections with receipt numbers</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <a
                href="/api/v1/reports/donations/pdf"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5 text-orange-400" /> PDF
              </a>
              <a
                href="/api/v1/reports/donations/csv"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1"
              >
                <Table className="w-3.5 h-3.5 text-emerald-400" /> CSV
              </a>
            </div>
          </div>

          {/* Expense Report */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Expense Ledger Audit</h4>
                <p className="text-[10px] text-slate-400">Line-item expenses, vendors & approvals</p>
              </div>
            </div>
            <a
              href="/api/v1/reports/expenses/csv"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1"
            >
              <Table className="w-3.5 h-3.5 text-emerald-400" /> CSV
            </a>
          </div>

        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-orange-600 text-white font-bold text-xs"
        >
          Close
        </button>
      </div>
    </div>
  );
};
