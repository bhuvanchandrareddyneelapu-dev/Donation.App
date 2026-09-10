import React, { useState, useEffect } from 'react';
import { FileText, Download, BarChart2, Calendar, DollarSign, Users, ShieldCheck } from 'lucide-react';
import api from '../services/api';

import { downloadAuthenticatedFile } from '../utils/download';

import { useNavigate } from 'react-router-dom';

export const AdminReportsPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchReportsData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/dashboard-stats?festivalId=1');
      setStats(res.data);
    } catch (err: any) {
      console.error('Failed to load reports stats:', err);
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        navigate('/admin', { state: { sessionExpired: true }, replace: true });
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  const handleExportCsv = async () => {
    try {
      await downloadAuthenticatedFile('/admin/reports/export-csv?festivalId=1', 'Donation_Report_Unicode_Estates_2026.csv');
    } catch (err) {
      console.error('Failed to download CSV report:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div>
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-amber-400">
              <BarChart2 className="w-4 h-4" />
              <span>Supervisor Reporting & Audits</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Financial Reports & Audits
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Unicode Estates Ganesh Chaturthi Celebrations 2026
            </p>
          </div>

          <button
            onClick={handleExportCsv}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Complete CSV Report</span>
          </button>
        </div>

        {/* Summary Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Valid Collection</span>
            <div className="text-2xl font-black text-emerald-400">
              ₹{stats?.totalCollection?.toLocaleString('en-IN') || 0}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">100% Real DB Audited</span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Online (Razorpay / UPI)</span>
            <div className="text-2xl font-black text-orange-400">
              ₹{stats?.onlineCollection?.toLocaleString('en-IN') || 0}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Digital Razorpay Gateway</span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Physical Cash Contributions</span>
            <div className="text-2xl font-black text-amber-400">
              ₹{stats?.cashCollection?.toLocaleString('en-IN') || 0}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Supervisor Verified Receipts</span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Verified Transactions</span>
            <div className="text-2xl font-black text-white">
              {stats?.totalDonations || 0}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Valid Completed Records</span>
          </div>
        </div>

        {/* Report Export Action Banner */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-lg font-black text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span>Generate Official Committee Statements</span>
          </h3>

          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Export full itemized contribution records including Receipt Numbers, Donor Names, Gotram, Family Details, Amounts, Payment Methods, and Transaction Timestamps for executive committee meetings.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={handleExportCsv}
              className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs shadow-lg shadow-orange-600/30 flex items-center space-x-2 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download Excel / CSV File</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
