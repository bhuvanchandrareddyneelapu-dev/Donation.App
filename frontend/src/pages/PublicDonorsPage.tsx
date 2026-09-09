import React, { useState, useEffect } from 'react';
import { ShieldCheck, Heart, Search, Filter, Download, Sparkles, QrCode, Lock, CheckCircle, Users } from 'lucide-react';
import api from '../services/api';
import { downloadAuthenticatedFile } from '../utils/download';

export const PublicDonorsPage: React.FC = () => {
  const [stats, setStats] = useState<any>({
    totalCollection: 0,
    targetAmount: 0,
    remainingAmount: 0,
    totalDonations: 0,
    onlineCollection: 0,
    cashCollection: 0,
  });

  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMethod, setFilterMethod] = useState<'ALL' | 'ONLINE' | 'CASH'>('ALL');

  const fetchPublicData = async () => {
    setLoading(true);
    try {
      const [summaryRes, donorsRes] = await Promise.all([
        api.get('/transparency/festival/1/summary').catch(() => null),
        api.get('/transparency/donors?festivalId=1').catch(() => null),
      ]);

      if (summaryRes?.data) {
        setStats({
          totalCollection: summaryRes.data.totalCollection || 0,
          targetAmount: summaryRes.data.targetAmount || 0,
          remainingAmount: summaryRes.data.remainingTarget || 0,
          totalDonations: summaryRes.data.totalDonations || donorsRes?.data?.length || 0,
          onlineCollection: summaryRes.data.onlineCollection || 0,
          cashCollection: summaryRes.data.cashCollection || 0,
        });
      }

      if (donorsRes?.data) {
        setDonors(donorsRes.data);
      }
    } catch (err) {
      console.error('Failed to load public transparency donors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicData();

    const handleDonationUpdated = () => {
      fetchPublicData();
    };

    window.addEventListener('donation-updated', handleDonationUpdated);
    return () => {
      window.removeEventListener('donation-updated', handleDonationUpdated);
    };
  }, []);

  const filteredDonors = donors.filter((d) => {
    const matchesSearch =
      d.donorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.receiptNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.gotram?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMethod =
      filterMethod === 'ALL' ? true : d.paymentType === filterMethod;

    return matchesSearch && matchesMethod;
  });

  const totalColl = stats.totalCollection || 0;
  const targetAmt = stats.targetAmount || 0;
  const progressPercent = targetAmt > 0 ? Math.min(100, Math.round((totalColl / targetAmt) * 100)) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Banner */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Itemized Public Audit Ledger</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Community Donors & Transparency
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Unicode Estates Ganesh Chaturthi Celebrations 2026 digital donation book. Every online and cash contribution is cryptographically verified and recorded in real time.
          </p>
        </div>

        {/* Live Collection & Target Progress Card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Valid Collection</span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 mt-1">
                ₹{totalColl.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Real-time Verified Ledger</span>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Festival Target</span>
              <div className="text-3xl sm:text-4xl font-black text-amber-400 mt-1">
                {targetAmt > 0 ? `₹${targetAmt.toLocaleString('en-IN')}` : 'To Be Announced'}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {targetAmt > 0 ? `Remaining: ₹${stats.remainingAmount?.toLocaleString('en-IN')}` : 'Target set by Head Committee'}
              </span>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Devotees Contributed</span>
              <div className="text-3xl sm:text-4xl font-black text-white mt-1 flex items-center justify-center sm:justify-start space-x-2">
                <Users className="w-7 h-7 text-orange-400" />
                <span>{stats.totalDonations || donors.length}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Online + Cash Contributions</span>
            </div>
          </div>

          {/* Progress Bar */}
          {targetAmt > 0 ? (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Fundraising Progress</span>
                <span className="text-amber-400 font-black">{progressPercent}% Achieved</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-medium text-center">
              ℹ️ Festival donation target will be announced soon by the Unicode Estates Executive Committee.
            </div>
          )}
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search donor, receipt no, gotram..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <button
              onClick={() => setFilterMethod('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filterMethod === 'ALL' ? 'bg-orange-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              All Methods
            </button>
            <button
              onClick={() => setFilterMethod('ONLINE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filterMethod === 'ONLINE' ? 'bg-orange-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              Online / Razorpay
            </button>
            <button
              onClick={() => setFilterMethod('CASH')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filterMethod === 'CASH' ? 'bg-orange-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              Cash Contributions
            </button>
          </div>
        </div>

        {/* Public Donor Cards Grid */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-slate-400 font-medium px-1">
            <span>Showing {filteredDonors.length} Verified Public Records</span>
            <span className="text-emerald-400 font-semibold flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Email & Phone Protected</span>
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Loading public donor ledger...
            </div>
          ) : filteredDonors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDonors.map((donor) => (
                <div
                  key={donor.id}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 space-y-3 shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-base font-black text-white flex items-center space-x-1.5">
                        <Heart className="w-4 h-4 text-orange-500 fill-orange-500/20 shrink-0" />
                        <span>{donor.donorName || 'Devotee'}</span>
                      </h4>
                      <div className="text-[11px] font-mono text-orange-400 font-bold mt-0.5">
                        Receipt #{donor.receiptNumber}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-emerald-400">
                        ₹{donor.amount?.toLocaleString('en-IN')}
                      </span>
                      <span className="block text-[10px] font-extrabold uppercase text-slate-400">
                        {donor.paymentType}
                      </span>
                    </div>
                  </div>

                  {/* Consented Gotram & Family Details */}
                  {donor.publicVisibility && (donor.gotram || donor.familyDetails) && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs text-slate-300">
                      {donor.gotram && (
                        <div><strong className="text-amber-400">Gotram:</strong> {donor.gotram}</div>
                      )}
                      {donor.familyDetails && (
                        <div><strong className="text-slate-400">Family:</strong> {donor.familyDetails}</div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-slate-800/80 text-xs">
                    <span className="text-[11px] text-slate-500">
                      {donor.createdAt ? new Date(donor.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Verified'}
                    </span>
                    <div className="flex space-x-2">
                      <a
                        href={`/verify-receipt?hash=${donor.qrCodeHash || donor.receiptNumber}`}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] flex items-center space-x-1 border border-slate-700"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>View</span>
                      </a>
                      <button
                        onClick={async () => {
                          try {
                            const rNum = donor.receiptNumber || donor.qrCodeHash;
                            await downloadAuthenticatedFile(`/receipts/${rNum}/pdf`, `Receipt_${rNum}.pdf`);
                          } catch (err) {
                            console.error('Failed to download PDF receipt:', err);
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-[11px] flex items-center space-x-1 shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-base font-extrabold text-white">No Public Donor Records Found</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Be the first devotee to contribute to Unicode Estates Ganesh Chaturthi 2026!
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
