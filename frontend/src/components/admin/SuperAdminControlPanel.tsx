import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit3, RotateCcw, ShieldAlert, Download, FileText, X, Check, Eye, EyeOff, RefreshCw, Sparkles, Building, Calendar, MapPin, Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SuperAdminSecurityModal } from './SuperAdminSecurityModal';
import { 
  recordManualDonation, 
  updateDonationRecord, 
  reverseDonationRecord, 
  getFestivalDonations, 
  getAllAuditLogs, 
  updateFestivalDetails,
  ManualDonationInput,
  DonationUpdateInput,
  DonationAuditLogItem
} from '../../services/festivalService';
import api from '../../services/api';
import { downloadAuthenticatedFile } from '../../utils/download';

interface SuperAdminControlPanelProps {
  festivalId?: number;
  onMutationSuccess?: () => void;
}

export const SuperAdminControlPanel: React.FC<SuperAdminControlPanelProps> = ({
  festivalId = 1,
  onMutationSuccess,
}) => {
  const { user } = useAuth();

  const isSuperAdmin = user && (user.role === 'SUPER_ADMIN' || user.role === 'HEAD' || user.role === 'FESTIVAL_ADMIN');

  const [activeModal, setActiveModal] = useState<'NONE' | 'ADD_DONATION' | 'DONATION_HISTORY' | 'EDIT_DONATION' | 'REVERSE_DONATION' | 'FESTIVAL_DETAILS' | 'AUDIT_LOGS'>('NONE');
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Donations state for management table
  const [donations, setDonations] = useState<any[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<DonationAuditLogItem[]>([]);

  // Manual donation form state
  const [manualForm, setManualForm] = useState<ManualDonationInput>({
    festivalId,
    donorName: '',
    donorPhone: '',
    donorEmail: '',
    donorAddress: '',
    gotram: '',
    familyDetails: '',
    amount: 1001,
    paymentType: 'CASH',
    remarks: '',
    publicVisibility: true,
    isAnonymous: false,
  });

  // Donation edit form state
  const [editForm, setEditForm] = useState<DonationUpdateInput>({
    donorName: '',
    donorPhone: '',
    donorEmail: '',
    donorAddress: '',
    gotram: '',
    familyDetails: '',
    amount: 0,
    paymentType: 'CASH',
    remarks: '',
    publicVisibility: true,
    isAnonymous: false,
    editReason: '',
  });

  // Reversal reason state
  const [reversalReason, setReversalReason] = useState<string>('Cash amount correction');

  // Festival details form state
  const [festivalForm, setFestivalForm] = useState({
    name: 'Unicode Estates Ganesh Chaturthi Celebrations 2026',
    description: 'Come together with our Unicode Estates community to celebrate Ganpati Bappa with devotion, joy, togetherness and new beginnings.',
    venue: 'Unicode Estates',
    organizer: 'Unicode Estates Cultural & Festival Committee',
    installationDate: '2026-09-14',
    immersionDate: '2026-09-24',
  });

  // Fetch donations when opening history modal
  const fetchDonations = async () => {
    setLoading(true);
    try {
      const list = await getFestivalDonations(festivalId);
      setDonations(list);
    } catch (err) {
      console.error('Failed to load donations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch audit logs when opening audit log modal
  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const logs = await getAllAuditLogs();
      setAuditLogs(logs);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeModal === 'DONATION_HISTORY') {
      fetchDonations();
    } else if (activeModal === 'AUDIT_LOGS') {
      fetchAuditLogs();
    }
  }, [activeModal]);

  if (!isSuperAdmin) {
    return null; // Public users do NOT see Super Admin controls
  }

  const notifySuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
    if (onMutationSuccess) onMutationSuccess();
  };

  const notifyError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 4000);
  };

  // Handlers
  const handleRecordManualDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.donorName || manualForm.amount <= 0) {
      notifyError('Donor Name and valid Amount are required.');
      return;
    }
    setLoading(true);
    try {
      await recordManualDonation(manualForm);
      notifySuccess(`Manual donation of ₹${manualForm.amount} for ${manualForm.donorName} saved successfully!`);
      setActiveModal('NONE');
      setManualForm({
        festivalId,
        donorName: '',
        donorPhone: '',
        donorEmail: '',
        donorAddress: '',
        gotram: '',
        familyDetails: '',
        amount: 1001,
        paymentType: 'CASH',
        remarks: '',
        publicVisibility: true,
        isAnonymous: false,
      });
    } catch (err: any) {
      console.error('Error saving manual donation:', err);
      notifyError(err.response?.data?.message || 'Failed to save manual donation.');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (d: any) => {
    setSelectedDonation(d);
    setEditForm({
      donorName: d.donorName,
      donorPhone: d.donorPhone || '',
      donorEmail: d.donorEmail || '',
      donorAddress: d.donorAddress || '',
      gotram: d.gotram || '',
      familyDetails: d.familyDetails || '',
      amount: d.amount,
      paymentType: d.paymentType,
      remarks: d.remarks || '',
      publicVisibility: d.publicVisibility ?? true,
      isAnonymous: d.isAnonymous ?? false,
      editReason: '',
    });
    setActiveModal('EDIT_DONATION');
  };

  const handleUpdateDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDonation) return;
    if (editForm.amount !== selectedDonation.amount && !editForm.editReason.trim()) {
      notifyError('Reason for amount edit is strictly required for audit log.');
      return;
    }
    setLoading(true);
    try {
      await updateDonationRecord(selectedDonation.id, editForm);
      notifySuccess(`Donation ID #${selectedDonation.id} updated successfully!`);
      setActiveModal('DONATION_HISTORY');
      fetchDonations();
    } catch (err: any) {
      console.error('Error updating donation:', err);
      notifyError(err.response?.data?.message || 'Failed to update donation.');
    } finally {
      setLoading(false);
    }
  };

  const openReverseModal = (d: any) => {
    setSelectedDonation(d);
    setReversalReason('Cash amount correction');
    setActiveModal('REVERSE_DONATION');
  };

  const handleReverseDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDonation) return;
    if (!reversalReason.trim()) {
      notifyError('Reversal reason is required.');
      return;
    }
    setLoading(true);
    try {
      await reverseDonationRecord(selectedDonation.id, reversalReason);
      notifySuccess(`Donation ID #${selectedDonation.id} has been reversed.`);
      setActiveModal('DONATION_HISTORY');
      fetchDonations();
    } catch (err: any) {
      console.error('Error reversing donation:', err);
      notifyError(err.response?.data?.message || 'Failed to reverse donation.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFestival = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateFestivalDetails(festivalId, festivalForm);
      notifySuccess('Festival details updated successfully!');
      setActiveModal('NONE');
    } catch (err: any) {
      console.error('Error updating festival:', err);
      notifyError(err.response?.data?.message || 'Failed to update festival details.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      await downloadAuthenticatedFile(`/admin/reports/export-csv?festivalId=${festivalId}`, `Donation_Report_Unicode_Estates_${Date.now()}.csv`);
    } catch (err) {
      console.error('Error downloading CSV:', err);
      notifyError('Failed to export CSV report.');
    }
  };

  const filteredDonations = donations.filter((d) => {
    const q = searchQuery.toLowerCase();
    return (
      (d.donorName && d.donorName.toLowerCase().includes(q)) ||
      (d.donorPhone && d.donorPhone.includes(q)) ||
      (d.receiptNumber && d.receiptNumber.toLowerCase().includes(q)) ||
      (d.transactionId && d.transactionId.toLowerCase().includes(q))
    );
  });

  return (
    <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      
      {/* Toast Messages */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold text-xs flex items-center justify-between animate-fade-in">
          <span>✅ {successMessage}</span>
          <button onClick={() => setSuccessMessage(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-300 font-bold text-xs flex items-center justify-between animate-fade-in">
          <span>⚠️ {errorMessage}</span>
          <button onClick={() => setErrorMessage(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Authenticated Role: {user?.role}</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">SUPER ADMIN CONTROLS</h2>
          <p className="text-xs text-slate-400">Manage festival collection, offline donations, edits with audit trail, reversals, and details in-app.</p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-slate-200 hover:text-white text-xs font-extrabold transition flex items-center space-x-2"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <button
          type="button"
          onClick={() => setActiveModal('ADD_DONATION')}
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600/30 via-slate-900 to-slate-900 border border-emerald-500/40 hover:border-emerald-400 transition text-left space-y-2 group shadow-xl active:scale-95"
        >
          <div className="flex justify-between items-center">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold">
              <Plus className="w-6 h-6" />
            </div>
            <Sparkles className="w-4 h-4 text-emerald-400 opacity-60 group-hover:opacity-100 transition" />
          </div>
          <div>
            <div className="text-sm font-black text-white group-hover:text-emerald-300 transition">
              + Add Donation
            </div>
            <div className="text-xs text-slate-400">Record cash, UPI, or offline contribution</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveModal('DONATION_HISTORY')}
          className="p-5 rounded-2xl bg-gradient-to-br from-amber-600/30 via-slate-900 to-slate-900 border border-amber-500/40 hover:border-amber-400 transition text-left space-y-2 group shadow-xl active:scale-95"
        >
          <div className="flex justify-between items-center">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-300 font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <Edit3 className="w-4 h-4 text-amber-400 opacity-60 group-hover:opacity-100 transition" />
          </div>
          <div>
            <div className="text-sm font-black text-white group-hover:text-amber-300 transition">
              Donation History & Edits
            </div>
            <div className="text-xs text-slate-400">View, edit, or reverse donations</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveModal('FESTIVAL_DETAILS')}
          className="p-5 rounded-2xl bg-gradient-to-br from-sky-600/30 via-slate-900 to-slate-900 border border-sky-500/40 hover:border-sky-400 transition text-left space-y-2 group shadow-xl active:scale-95"
        >
          <div className="flex justify-between items-center">
            <div className="p-3 rounded-xl bg-sky-500/20 text-sky-300 font-bold">
              <Building className="w-6 h-6" />
            </div>
            <Sparkles className="w-4 h-4 text-sky-400 opacity-60 group-hover:opacity-100 transition" />
          </div>
          <div>
            <div className="text-sm font-black text-white group-hover:text-sky-300 transition">
              Manage Festival Details
            </div>
            <div className="text-xs text-slate-400">Edit festival name, dates, venue, pujas</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveModal('AUDIT_LOGS')}
          className="p-5 rounded-2xl bg-gradient-to-br from-purple-600/30 via-slate-900 to-slate-900 border border-purple-500/40 hover:border-purple-400 transition text-left space-y-2 group shadow-xl active:scale-95"
        >
          <div className="flex justify-between items-center">
            <div className="p-3 rounded-xl bg-purple-500/20 text-purple-300 font-bold">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <FileText className="w-4 h-4 text-purple-400 opacity-60 group-hover:opacity-100 transition" />
          </div>
          <div>
            <div className="text-sm font-black text-white group-hover:text-purple-300 transition">
              Audit Logs & Trail
            </div>
            <div className="text-xs text-slate-400">Complete audit log of all modifications</div>
          </div>
        </button>

        {user?.role === 'SUPER_ADMIN' && (
          <button
            type="button"
            onClick={() => setIsSecurityModalOpen(true)}
            className="p-5 rounded-2xl bg-gradient-to-br from-indigo-600/30 via-slate-900 to-slate-900 border border-indigo-500/40 hover:border-indigo-400 transition text-left space-y-2 group shadow-xl active:scale-95"
          >
            <div className="flex justify-between items-center">
              <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-300 font-bold">
                <Lock className="w-6 h-6" />
              </div>
              <Sparkles className="w-4 h-4 text-indigo-400 opacity-60 group-hover:opacity-100 transition" />
            </div>
            <div>
              <div className="text-sm font-black text-white group-hover:text-indigo-300 transition">
                Security & Credentials
              </div>
              <div className="text-xs text-slate-400">Change Password & Phone (OTP)</div>
            </div>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. ADD MANUAL DONATION MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'ADD_DONATION' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-white">Record Manual / Offline Donation</h3>
                <p className="text-xs text-slate-400">Updates database collection instantly</p>
              </div>
              <button onClick={() => setActiveModal('NONE')} className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordManualDonation} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Donor Name *</label>
                  <input
                    type="text"
                    required
                    value={manualForm.donorName}
                    onChange={(e) => setManualForm({ ...manualForm, donorName: e.target.value })}
                    placeholder="e.g. Ravi Kumar"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Donation Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={manualForm.amount}
                    onChange={(e) => setManualForm({ ...manualForm, amount: parseFloat(e.target.value) || 0 })}
                    placeholder="1001"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:border-amber-500 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Phone (Optional/Private)</label>
                  <input
                    type="text"
                    value={manualForm.donorPhone}
                    onChange={(e) => setManualForm({ ...manualForm, donorPhone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Email (Optional/Private)</label>
                  <input
                    type="email"
                    value={manualForm.donorEmail}
                    onChange={(e) => setManualForm({ ...manualForm, donorEmail: e.target.value })}
                    placeholder="ravi@example.com"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Gotram (Optional)</label>
                  <input
                    type="text"
                    value={manualForm.gotram}
                    onChange={(e) => setManualForm({ ...manualForm, gotram: e.target.value })}
                    placeholder="e.g. Kashyapa"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Family Details (Optional)</label>
                  <input
                    type="text"
                    value={manualForm.familyDetails}
                    onChange={(e) => setManualForm({ ...manualForm, familyDetails: e.target.value })}
                    placeholder="e.g. Ravi & Family"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Payment Method</label>
                  <select
                    value={manualForm.paymentType}
                    onChange={(e) => setManualForm({ ...manualForm, paymentType: e.target.value as any })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium focus:border-amber-500 outline-none"
                  >
                    <option value="CASH">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Notes / Remarks</label>
                  <input
                    type="text"
                    value={manualForm.remarks}
                    onChange={(e) => setManualForm({ ...manualForm, remarks: e.target.value })}
                    placeholder="e.g. Cash collected at Mandap desk"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={manualForm.publicVisibility}
                    onChange={(e) => setManualForm({ ...manualForm, publicVisibility: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-slate-300 font-medium">Public Donor Wall Visibility</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={manualForm.isAnonymous}
                    onChange={(e) => setManualForm({ ...manualForm, isAnonymous: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-slate-300 font-medium">Anonymous Donor</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal('NONE')}
                  className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black hover:brightness-110 transition flex items-center space-x-2"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Save Manual Donation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DONATION HISTORY & MANAGEMENT MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'DONATION_HISTORY' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-5xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 shrink-0">
              <div>
                <h3 className="text-xl font-black text-white">Festival Donation Records</h3>
                <p className="text-xs text-slate-400">Edit, inspect audit logs, or soft-reverse donations</p>
              </div>
              <button onClick={() => setActiveModal('NONE')} className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-between items-center gap-4 shrink-0 text-xs">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by donor name, receipt #, or phone..."
                className="w-full sm:w-80 p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-500 outline-none"
              />
              <button
                onClick={fetchDonations}
                disabled={loading}
                className="p-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center space-x-1"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh List</span>
              </button>
            </div>

            <div className="overflow-y-auto flex-grow rounded-2xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider sticky top-0 border-b border-slate-800">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Donor</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Gotram / Family</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredDonations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 font-medium">
                        No donation records found.
                      </td>
                    </tr>
                  ) : (
                    filteredDonations.map((d) => (
                      <tr key={d.id} className={d.reversed ? 'bg-red-950/20 text-slate-500' : 'hover:bg-slate-900/60'}>
                        <td className="p-3 font-mono font-bold text-slate-400">#{d.id}</td>
                        <td className="p-3">
                          <div className="font-extrabold text-white">{d.donorName}</div>
                          <div className="text-[10px] text-slate-400">{d.donorPhone || d.donorEmail || 'Private'}</div>
                        </td>
                        <td className="p-3 font-black text-emerald-400">
                          ₹{d.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">
                            {d.paymentType}
                          </span>
                        </td>
                        <td className="p-3">
                          <div>{d.gotram || '—'}</div>
                          <div className="text-[10px] text-slate-400">{d.familyDetails}</div>
                        </td>
                        <td className="p-3">
                          {d.reversed ? (
                            <span className="px-2 py-0.5 rounded bg-red-900/50 text-red-300 border border-red-700 font-bold text-[10px]">
                              REVERSED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-800 font-bold text-[10px]">
                              {d.paymentStatus}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-2">
                          {!d.reversed && (
                            <>
                              <button
                                onClick={() => openEditModal(d)}
                                className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-bold text-[11px]"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => openReverseModal(d)}
                                className="px-2.5 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 font-bold text-[11px]"
                              >
                                Reverse
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex justify-end shrink-0">
              <button
                onClick={() => setActiveModal('NONE')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. EDIT DONATION MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'EDIT_DONATION' && selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-white">Edit Donation #{selectedDonation.id}</h3>
                <p className="text-xs text-amber-400 font-medium">Financial modifications require an audit reason</p>
              </div>
              <button onClick={() => setActiveModal('DONATION_HISTORY')} className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateDonation} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Donor Name</label>
                  <input
                    type="text"
                    value={editForm.donorName}
                    onChange={(e) => setEditForm({ ...editForm, donorName: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Donation Amount (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:border-amber-500 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editForm.donorPhone}
                    onChange={(e) => setEditForm({ ...editForm, donorPhone: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.donorEmail}
                    onChange={(e) => setEditForm({ ...editForm, donorEmail: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Gotram</label>
                  <input
                    type="text"
                    value={editForm.gotram}
                    onChange={(e) => setEditForm({ ...editForm, gotram: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Family Details</label>
                  <input
                    type="text"
                    value={editForm.familyDetails}
                    onChange={(e) => setEditForm({ ...editForm, familyDetails: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-amber-400 mb-1">
                  Reason for Edit / Correction (Required for Audit Log) *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.editReason}
                  onChange={(e) => setEditForm({ ...editForm, editReason: e.target.value })}
                  placeholder="e.g. Cash amount correction verified by Super Admin"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-amber-500/50 text-white font-medium focus:border-amber-400 outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal('DONATION_HISTORY')}
                  className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black hover:brightness-110 flex items-center space-x-2"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. REVERSE DONATION MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'REVERSE_DONATION' && selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-red-500/50 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-red-400">Reverse Donation #{selectedDonation.id}</h3>
                <p className="text-xs text-slate-400">Excludes amount from public collection</p>
              </div>
              <button onClick={() => setActiveModal('DONATION_HISTORY')} className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReverseDonation} className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-red-950/30 border border-red-800/40 text-slate-300 space-y-1">
                <div>Donor: <strong className="text-white">{selectedDonation.donorName}</strong></div>
                <div>Amount: <strong className="text-red-400">₹{selectedDonation.amount}</strong></div>
                <div>Payment Method: {selectedDonation.paymentType}</div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Reversal Reason *</label>
                <textarea
                  required
                  rows={3}
                  value={reversalReason}
                  onChange={(e) => setReversalReason(e.target.value)}
                  placeholder="Provide reason for cancellation/reversal..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-red-500 outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal('DONATION_HISTORY')}
                  className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-red-600 text-white font-black hover:bg-red-500 flex items-center space-x-2"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                  <span>Confirm Reversal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. EDIT FESTIVAL DETAILS MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'FESTIVAL_DETAILS' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-white">Manage Festival Information</h3>
                <p className="text-xs text-slate-400">Updates live public festival details</p>
              </div>
              <button onClick={() => setActiveModal('NONE')} className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateFestival} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Festival Name</label>
                <input
                  type="text"
                  required
                  value={festivalForm.name}
                  onChange={(e) => setFestivalForm({ ...festivalForm, name: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Venue / Location</label>
                <input
                  type="text"
                  required
                  value={festivalForm.venue}
                  onChange={(e) => setFestivalForm({ ...festivalForm, venue: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Organizer / Committee</label>
                <input
                  type="text"
                  required
                  value={festivalForm.organizer}
                  onChange={(e) => setFestivalForm({ ...festivalForm, organizer: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Sthapana Date</label>
                  <input
                    type="date"
                    value={festivalForm.installationDate}
                    onChange={(e) => setFestivalForm({ ...festivalForm, installationDate: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Visarjan Date</label>
                  <input
                    type="date"
                    value={festivalForm.immersionDate}
                    onChange={(e) => setFestivalForm({ ...festivalForm, immersionDate: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description / Message</label>
                <textarea
                  rows={3}
                  value={festivalForm.description}
                  onChange={(e) => setFestivalForm({ ...festivalForm, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal('NONE')}
                  className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-black hover:brightness-110 flex items-center space-x-2"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Save Festival Info</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. AUDIT LOGS MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'AUDIT_LOGS' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-purple-500/50 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 shrink-0">
              <div>
                <h3 className="text-xl font-black text-purple-300">Donation Audit Trail</h3>
                <p className="text-xs text-slate-400">Verifiable log of all edits, manual entries, and reversals</p>
              </div>
              <button onClick={() => setActiveModal('NONE')} className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-grow rounded-2xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider sticky top-0 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Log ID</th>
                    <th className="p-3">Donation ID</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Old Amount</th>
                    <th className="p-3">New Amount</th>
                    <th className="p-3">Reason / Details</th>
                    <th className="p-3">Modified By</th>
                    <th className="p-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-500 font-medium">
                        No audit log entries recorded yet.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-900/60">
                        <td className="p-3 font-mono text-slate-500">#{log.id}</td>
                        <td className="p-3 font-mono font-bold text-amber-400">#{log.donationId}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800 font-mono text-[10px]">
                            {log.action}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">
                          {log.oldAmount != null ? `₹${log.oldAmount}` : '—'}
                        </td>
                        <td className="p-3 font-bold text-white">
                          {log.newAmount != null ? `₹${log.newAmount}` : '—'}
                        </td>
                        <td className="p-3 max-w-xs truncate" title={log.reason}>
                          {log.reason}
                        </td>
                        <td className="p-3 font-medium text-slate-300">{log.performedBy}</td>
                        <td className="p-3 text-[10px] text-slate-400">
                          {log.performedAt ? new Date(log.performedAt).toLocaleString() : '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex justify-end shrink-0">
              <button
                onClick={() => setActiveModal('NONE')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
              >
                Close Audit Logs
              </button>
            </div>
          </div>
        </div>
      )}

      <SuperAdminSecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />

    </div>
  );
};
