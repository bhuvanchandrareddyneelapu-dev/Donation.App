import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

interface DonorWallProps {
  festivalId?: number;
  refreshTrigger?: number;
}

export const DonorWall: React.FC<DonorWallProps> = ({
  festivalId = 1,
  refreshTrigger = 0,
}) => {
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPublicDonors = async () => {
    try {
      const res = await api.get(`/transparency/donors?festivalId=${festivalId}`);
      if (res.data && Array.isArray(res.data)) {
        setDonors(res.data);
      }
    } catch (err) {
      console.error('Failed to load public donor wall:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicDonors();
    // Poll every 20 seconds for live updates
    const interval = setInterval(fetchPublicDonors, 20000);
    return () => clearInterval(interval);
  }, [festivalId, refreshTrigger]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-orange-400 uppercase">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Live Devotee Wall</span>
          </div>
          <h3 className="text-xl font-black text-white mt-1">Recent Contributions</h3>
        </div>
        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          Live Updates
        </span>
      </div>

      {loading ? (
        <div className="py-6 text-center text-slate-400 text-xs">
          Loading live devotee contributions...
        </div>
      ) : donors.length > 0 ? (
        <div className="divide-y divide-slate-800">
          {donors.map((d) => {
            const isAnon = d.anonymous || d.donorName === 'Anonymous Devotee' || d.donorName === 'Anonymous Donor';
            const displayName = isAnon ? 'Anonymous Devotee' : d.donorName || 'Devotee';
            const formattedDate = d.createdAt
              ? new Date(d.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
              : 'Verified';

            return (
              <div key={d.id} className="py-3.5 flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-orange-400 font-extrabold text-xs">
                    {isAnon ? '🙏' : displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">
                      {displayName}
                    </div>
                    <div className="text-[11px] text-slate-500">{formattedDate}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-black text-emerald-400">
                    ₹{d.amount?.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] font-extrabold uppercase text-slate-400">
                    {d.paymentType}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-8 text-center space-y-2">
          <div className="text-sm font-bold text-slate-300">No public contributions recorded yet.</div>
          <div className="text-xs text-slate-500">Be the first devotee to contribute to the celebration!</div>
        </div>
      )}
    </div>
  );
};
