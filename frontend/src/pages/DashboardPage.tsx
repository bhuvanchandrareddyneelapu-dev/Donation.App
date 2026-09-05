import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, FileText, Sparkles } from 'lucide-react';
import { CashDonationModal } from '../components/volunteer/CashDonationModal';
import { ReportsModal } from '../components/reports/ReportsModal';
import { Festival } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CASH_APPROVALS' | 'MY_DONATIONS'>('OVERVIEW');
  const [showCashModal, setShowCashModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);

  const mockFestival: Festival = {
    id: 1,
    name: 'Grand Ganesh Chaturthi Mahotsav 2026',
    festivalType: 'GANESH_CHATURTHI',
    bannerUrl: 'https://images.unsplash.com/photo-1605626830588-4663e26b1c5a?w=800',
    description: 'Lalbaugcha Raja Mahotsav',
    venue: 'Lalbaug Ground, Mumbai',
    targetAmount: 5000000,
    currentCollection: 3450000,
    active: true,
  };

  const [pendingCashList, setPendingCashList] = useState([
    {
      id: 101,
      receiptNo: 'REC-CASH-2026-9901',
      donorName: 'Ramesh Chandran',
      donorPhone: '+91 9443218765',
      amount: 11000,
      volunteerName: 'Aarav Patel (VOL-BADGE-8841)',
      status: 'PENDING',
      recordedAt: '2026-07-31 16:45',
    },
    {
      id: 102,
      receiptNo: 'REC-CASH-2026-9902',
      donorName: 'Meenakshi Iyer',
      donorPhone: '+91 9887766554',
      amount: 5001,
      volunteerName: 'Aarav Patel (VOL-BADGE-8841)',
      status: 'PENDING',
      recordedAt: '2026-07-31 18:20',
    },
  ]);

  const handleApproveCash = (id: number) => {
    setPendingCashList(pendingCashList.map(item => item.id === id ? { ...item, status: 'VERIFIED & DEPOSITED' } : item));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-orange-500/20 text-orange-400 border border-orange-500/30">
              Role: {user?.role || 'DONOR'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">Welcome back, {user?.name || 'User'}</h1>
            <p className="text-xs text-slate-400">Festival Committee Management Portal (Version 1)</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowReportsModal(true)}
              className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center space-x-2 transition"
            >
              <FileText className="w-4 h-4 text-orange-400" />
              <span>Export Reports</span>
            </button>

            {(user?.role === 'FESTIVAL_ADMIN' || user?.role === 'SUPER_ADMIN') && (
              <a
                href="/admin/festival"
                className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:brightness-110 text-white font-extrabold text-xs shadow-lg shadow-orange-500/30 flex items-center space-x-2 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Festival Management</span>
              </a>
            )}

            {(user?.role === 'VOLUNTEER' || user?.role === 'FESTIVAL_ADMIN' || user?.role === 'SUPER_ADMIN') && (
              <button
                onClick={() => setShowCashModal(true)}
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Record Cash Donation</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-3 mb-8 border-b border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition ${
              activeTab === 'OVERVIEW' ? 'bg-orange-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Platform Overview
          </button>
          
          {(user?.role === 'TREASURER' || user?.role === 'FESTIVAL_ADMIN' || user?.role === 'SUPER_ADMIN') && (
            <button
              onClick={() => setActiveTab('CASH_APPROVALS')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition ${
                activeTab === 'CASH_APPROVALS' ? 'bg-orange-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Treasurer Cash Approvals ({pendingCashList.filter(p => p.status === 'PENDING').length})
            </button>
          )}

          <button
            onClick={() => setActiveTab('MY_DONATIONS')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition ${
              activeTab === 'MY_DONATIONS' ? 'bg-orange-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            My Donation History
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <span className="text-xs text-slate-400 font-bold uppercase">Online Collection (Razorpay/UPI)</span>
                <div className="text-2xl font-black text-emerald-400 mt-2">₹28,50,000</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <span className="text-xs text-slate-400 font-bold uppercase">Cash Collection (On-Ground)</span>
                <div className="text-2xl font-black text-amber-400 mt-2">₹6,00,000</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <span className="text-xs text-slate-400 font-bold uppercase">Verified Cash Entries</span>
                <div className="text-2xl font-black text-orange-400 mt-2">142 Entries</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Assigned Festival & Counter Details</h3>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs gap-4">
                <div>
                  <div className="font-bold text-white text-sm">{mockFestival.name}</div>
                  <div className="text-slate-400">Assigned Area: Gate 2 VIP & General Counter</div>
                </div>
                <button
                  onClick={() => setShowCashModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-orange-600 font-bold text-white text-xs"
                >
                  Record On-Ground Cash
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Cash Approvals (Treasurer) */}
        {activeTab === 'CASH_APPROVALS' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">Pending Cash Entry Verifications & Deposits</h3>
            <p className="text-xs text-slate-400 mb-6">Review cash recorded on-ground by assigned volunteers before marking deposited into committee bank account.</p>

            <div className="divide-y divide-slate-800 overflow-x-auto">
              {pendingCashList.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between space-x-4 text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-orange-400">{item.receiptNo}</span>
                      <span className="text-slate-500">{item.recordedAt}</span>
                    </div>
                    <div className="font-bold text-white text-sm mt-1">{item.donorName} ({item.donorPhone})</div>
                    <div className="text-slate-400">Recorded by: {item.volunteerName}</div>
                  </div>

                  <div className="text-right flex items-center space-x-4">
                    <div>
                      <div className="text-sm font-extrabold text-emerald-400">₹{item.amount.toLocaleString('en-IN')}</div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {item.status}
                      </span>
                    </div>

                    {item.status === 'PENDING' && (
                      <button
                        onClick={() => handleApproveCash(item.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
                      >
                        Approve & Verify Deposit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: My Donations */}
        {activeTab === 'MY_DONATIONS' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white">My Past Contributions</h3>
            
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <div className="font-bold text-white">Grand Ganesh Chaturthi Mahotsav 2026</div>
                <div className="text-slate-400">Receipt: REC-2026-1001 | Date: 2026-07-29</div>
              </div>
              <div className="text-right">
                <div className="font-extrabold text-orange-400 text-sm">₹25,000</div>
                <a
                  href="/api/v1/receipts/REC-2026-1001/pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-300 hover:text-white underline font-bold mt-1 block"
                >
                  Download PDF Receipt
                </a>
              </div>
            </div>
          </div>
        )}

      </div>

      {showCashModal && <CashDonationModal festival={mockFestival} onClose={() => setShowCashModal(false)} />}
      {showReportsModal && <ReportsModal onClose={() => setShowReportsModal(false)} />}
    </div>
  );
};
