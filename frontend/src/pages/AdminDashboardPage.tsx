import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, PlusCircle, Settings, Calendar, Bell, FileText, Users, Download, Send, RotateCcw, ShieldCheck, AlertCircle, RefreshCw, Eye, X, Mail, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';
import { AddCashDonationModal } from '../components/admin/AddCashDonationModal';
import { downloadAuthenticatedFile } from '../utils/download';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [emailStatus, setEmailStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddCashModal, setShowAddCashModal] = useState(false);

  // Reversal Modal State
  const [reversingDonation, setReversingDonation] = useState<any | null>(null);
  const [reversalReason, setReversalReason] = useState('');
  const [reversingLoading, setReversingLoading] = useState(false);
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, donationsRes, emailStatusRes] = await Promise.all([
        api.get('/admin/dashboard-stats?festivalId=1').catch(() => null),
        api.get('/donations/festival/1').catch(() => null),
        api.get('/admin/email/status').catch(() => null),
      ]);

      if (statsRes?.data) {
        setStats(statsRes.data);
      }
      if (donationsRes?.data) {
        setDonations(donationsRes.data);
      }
      if (emailStatusRes?.data) {
        setEmailStatus(emailStatusRes.data);
      }
    } catch (err) {
      console.error('Failed to load supervisor dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const handleDonationUpdated = () => {
      fetchDashboardData();
    };

    window.addEventListener('donation-updated', handleDonationUpdated);
    return () => {
      window.removeEventListener('donation-updated', handleDonationUpdated);
    };
  }, []);

  const handleSendTestEmail = async () => {
    setTestEmailLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/admin/email/test');
      setToastMsg(res.data?.message || 'Production test email sent successfully. Check the admin inbox.');
      setTimeout(() => setToastMsg(''), 5000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'Failed to send production test email.';
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 6000);
    } finally {
      setTestEmailLoading(false);
    }
  };

  const handleResendEmail = async (id: number) => {
    setErrorMsg('');
    try {
      await api.post(`/admin/donations/${id}/resend-email`);
      setToastMsg('Receipt email sent successfully.');
      setTimeout(() => setToastMsg(''), 5000);
    } catch (err: any) {
      console.error('Failed to resend email receipt:', err);
      const msg = err?.response?.data?.message || 'Failed to send receipt email. Please try again.';
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 6000);
    }
  };

  const handleConfirmReversal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reversalReason.trim()) {
      alert('Please enter a reason for reversing this donation.');
      return;
    }

    setReversingLoading(true);
    try {
      await api.post(`/admin/donations/${reversingDonation.id}/reverse`, {
        reason: reversalReason.trim(),
      });

      setToastMsg(`Donation #${reversingDonation.id} reversed successfully.`);
      setTimeout(() => setToastMsg(''), 4000);
      setReversingDonation(null);
      setReversalReason('');
      fetchDashboardData();
    } catch (err: any) {
      console.error('Reversal error:', err);
      alert(err?.response?.data?.message || err?.response?.data?.error || 'Failed to reverse donation.');
    } finally {
      setReversingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed top-24 right-5 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs shadow-2xl flex items-center space-x-2 animate-bounce">
            <ShieldCheck className="w-5 h-5" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Error Toast Notification */}
        {errorMsg && (
          <div className="fixed top-24 right-5 z-50 p-4 rounded-2xl bg-rose-600 text-white font-extrabold text-xs shadow-2xl flex items-center space-x-2 animate-bounce">
            <AlertCircle className="w-5 h-5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Dashboard Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-orange-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-extrabold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Supervisor / Head Management Portal</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white mt-2 tracking-tight">
              Unicode Estates Ganesh Chaturthi 2026
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Live financial ledger, cash entry management, receipt distribution & festival controls
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowAddCashModal(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Record Cash Donation</span>
            </button>

            <Link
              to="/admin/festival"
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center space-x-2 transition"
            >
              <Settings className="w-4 h-4 text-orange-400" />
              <span>Manage Festival</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Collection</span>
            <div className="text-3xl font-black text-emerald-400">
              ₹{stats?.totalCollection?.toLocaleString('en-IN') || 0}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Valid Completed Records</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Festival Target</span>
            <div className="text-3xl font-black text-amber-400">
              {stats?.targetAmount > 0 ? `₹${stats.targetAmount.toLocaleString('en-IN')}` : 'To Be Announced'}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {stats?.targetAmount > 0 ? `Remaining: ₹${stats.remainingAmount?.toLocaleString('en-IN')}` : 'Target set in Admin'}
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Online vs Cash Split</span>
            <div className="text-base font-black text-white space-y-0.5 pt-1">
              <div className="text-orange-400">Online: ₹{stats?.onlineCollection?.toLocaleString('en-IN') || 0}</div>
              <div className="text-amber-300">Cash: ₹{stats?.cashCollection?.toLocaleString('en-IN') || 0}</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Donors</span>
            <div className="text-3xl font-black text-white flex items-center space-x-2">
              <Users className="w-6 h-6 text-orange-400" />
              <span>{stats?.totalDonations || 0}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Verified Devotee Contributions</span>
          </div>

          {stats?.isTestMode && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">🧪 Test Mode Ledger</span>
              <div className="text-2xl font-black text-amber-300">
                ₹{stats?.testCollection?.toLocaleString('en-IN') || 0}
              </div>
              <span className="text-[11px] text-amber-200 font-medium">
                {stats?.testDonations || 0} Test Payment(s) (Excluded from Public Ledger)
              </span>
            </div>
          )}
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider">Quick Management Actions</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            <button
              onClick={() => setShowAddCashModal(true)}
              className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 flex flex-col items-center justify-center text-center space-y-1 transition"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="text-[11px] font-extrabold">Add Cash Donation</span>
            </button>

            <Link
              to="/admin/festival"
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-orange-500/50 flex flex-col items-center justify-center text-center space-y-1 transition"
            >
              <Settings className="w-5 h-5 text-orange-400" />
              <span className="text-[11px] font-bold">Manage Festival</span>
            </Link>

            <Link
              to="/admin/festival"
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/50 flex flex-col items-center justify-center text-center space-y-1 transition"
            >
              <Calendar className="w-5 h-5 text-amber-400" />
              <span className="text-[11px] font-bold">Manage Timings</span>
            </Link>

            <Link
              to="/admin/festival"
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-yellow-500/50 flex flex-col items-center justify-center text-center space-y-1 transition"
            >
              <Bell className="w-5 h-5 text-yellow-400" />
              <span className="text-[11px] font-bold">Add Announcement</span>
            </Link>

            <Link
              to="/donors"
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/50 flex flex-col items-center justify-center text-center space-y-1 transition"
            >
              <Eye className="w-5 h-5 text-emerald-400" />
              <span className="text-[11px] font-bold">Donor Transparency</span>
            </Link>

            <Link
              to="/admin/reports"
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500/50 flex flex-col items-center justify-center text-center space-y-1 transition"
            >
              <FileText className="w-5 h-5 text-blue-400" />
              <span className="text-[11px] font-bold">View Reports</span>
            </Link>

            <button
              onClick={fetchDashboardData}
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white flex flex-col items-center justify-center text-center space-y-1 transition"
            >
              <RefreshCw className="w-5 h-5 text-slate-400" />
              <span className="text-[11px] font-bold">Refresh Stats</span>
            </button>
          </div>
        </div>

        {/* Email Delivery Diagnostics & Test Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center space-x-2">
                  <span>EMAIL DELIVERY DIAGNOSTICS</span>
                  {emailStatus?.configured ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> CONFIGURED
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> NOT CONFIGURED
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400">Live production email configuration status & delivery test suite</p>
              </div>
            </div>

            <button
              onClick={handleSendTestEmail}
              disabled={testEmailLoading}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg shadow-orange-500/20 flex items-center space-x-2 transition"
            >
              <Send className="w-4 h-4" />
              <span>{testEmailLoading ? 'Sending Test Email...' : 'Send Test Email'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs pt-2">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Email Provider</span>
              <div className="font-mono font-bold text-white mt-0.5 truncate uppercase">
                {emailStatus?.provider ? String(emailStatus.provider).toUpperCase() : 'RESEND'}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Transport</span>
              <div className="font-mono font-bold text-amber-400 mt-0.5 uppercase">
                {emailStatus?.transport ? String(emailStatus.transport).toUpperCase() : 'HTTPS'}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase font-bold">API Key / Auth</span>
              <div className="font-mono font-bold text-emerald-400 mt-0.5">
                {(emailStatus?.apiConfigured ?? emailStatus?.smtpAuth ?? (emailStatus?.configured && emailStatus?.provider === 'resend')) ? 'ENABLED' : 'MISSING'}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase font-bold">API / Provider Status</span>
              <div className="font-mono font-bold text-emerald-400 mt-0.5">
                {emailStatus?.status || (emailStatus?.configured ? 'CONFIGURED' : 'UNCONFIGURED')}
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">
                Connectivity: {emailStatus?.connectivity || 'UNVERIFIED'}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Sender (MAIL_FROM)</span>
              <div className="font-mono font-bold text-slate-300 mt-0.5 truncate">
                {emailStatus?.fromEmail || 'Missing'}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Admin Recipient</span>
              <div className="font-mono font-bold text-slate-300 mt-0.5 truncate">
                {emailStatus?.adminEmail || 'Missing'}
              </div>
            </div>
          </div>
        </div>

        {/* All Donations Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-lg font-black text-white">All Festival Contributions ({donations.length})</h3>
              <p className="text-xs text-slate-400">Complete itemized audit log of online & cash donations</p>
            </div>
            <button
              onClick={async () => {
                try {
                  await downloadAuthenticatedFile('/admin/reports/export-csv?festivalId=1', 'Donation_Report_Unicode_Estates_2026.csv');
                } catch (err) {
                  console.error('Failed to export CSV report:', err);
                }
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center space-x-1.5 border border-slate-700"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">ID / Receipt</th>
                  <th className="p-3">Donor Name</th>
                  <th className="p-3">Contact Details</th>
                  <th className="p-3">Amount (₹)</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {donations.map((d) => (
                  <tr key={d.id} className={d.isReversed ? 'bg-rose-950/20 text-slate-500 line-through' : 'hover:bg-slate-950/40'}>
                    <td className="p-3 font-mono font-bold text-orange-400">
                      <div>#{d.id}</div>
                      <div className="text-[10px] text-slate-400">{d.receiptNumber}</div>
                    </td>
                    <td className="p-3 font-bold text-white">
                      {d.donorName}
                      {d.gotram && <div className="text-[10px] text-amber-400 font-normal">Gotram: {d.gotram}</div>}
                    </td>
                    <td className="p-3 text-slate-300">
                      <div>{d.donorPhone}</div>
                      <div className="text-[10px] text-slate-400">{d.donorEmail || 'No Email'}</div>
                    </td>
                    <td className="p-3 font-black text-emerald-400 text-sm">
                      ₹{d.amount?.toLocaleString('en-IN')}
                      {d.isTest && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          TEST
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-bold">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        d.paymentType === 'ONLINE' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      }`}>
                        {d.paymentType}
                      </span>
                    </td>
                    <td className="p-3">
                      {d.isReversed ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold">
                          REVERSED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                          VERIFIED
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={async () => {
                            try {
                              const rNum = d.receiptNumber || d.id;
                              await downloadAuthenticatedFile(`/receipts/${rNum}/pdf`, `Receipt_${rNum}.pdf`);
                            } catch (err) {
                              console.error('Failed to download receipt PDF:', err);
                            }
                          }}
                          title="Download PDF Receipt"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                          <Download className="w-3.5 h-3.5 text-orange-400" />
                        </button>

                        {d.donorEmail && (
                          <button
                            onClick={() => handleResendEmail(d.id)}
                            title="Resend Receipt Email"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                          >
                            <Send className="w-3.5 h-3.5 text-emerald-400" />
                          </button>
                        )}

                        {!d.isReversed && (
                          <button
                            onClick={() => setReversingDonation(d)}
                            title="Reverse Donation (Audit Reason Required)"
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add Cash Donation Modal */}
      {showAddCashModal && (
        <AddCashDonationModal
          festivalId={1}
          onClose={() => setShowAddCashModal(false)}
          onSuccess={() => {
            fetchDashboardData();
          }}
        />
      )}

      {/* Reversal Confirmation Modal */}
      {reversingDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center text-rose-400">
              <h3 className="text-lg font-black flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>Reverse Donation #{reversingDonation.id}</span>
              </h3>
              <button onClick={() => setReversingDonation(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div>Donor: <strong>{reversingDonation.donorName}</strong></div>
              <div>Amount: <strong className="text-emerald-400">₹{reversingDonation.amount}</strong></div>
              <div>Receipt: <strong className="font-mono text-orange-400">{reversingDonation.receiptNumber}</strong></div>
            </div>

            <form onSubmit={handleConfirmReversal} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Reversal Reason (Mandatory Audit Log) *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Incorrect cash entry recorded; actual cash was ₹1,000"
                  value={reversalReason}
                  onChange={(e) => setReversalReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setReversingDonation(null)}
                  className="w-1/2 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reversingLoading}
                  className="w-1/2 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold shadow-lg shadow-rose-600/30"
                >
                  {reversingLoading ? 'Reversing...' : 'Confirm Reversal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
