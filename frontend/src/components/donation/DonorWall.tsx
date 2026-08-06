import React from 'react';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';

interface DonorItem {
  id: number;
  name: string;
  amount: number;
  time: string;
  isAnonymous: boolean;
}

export const DonorWall: React.FC = () => {
  const recentDonors: DonorItem[] = [
    { id: 1, name: 'Priya Sundaram', amount: 25000, time: '10 mins ago', isAnonymous: false },
    { id: 2, name: 'Ramesh Chandran & Family', amount: 11000, time: '25 mins ago', isAnonymous: false },
    { id: 3, name: 'Anonymous Devotee', amount: 5001, time: '1 hour ago', isAnonymous: true },
    { id: 4, name: 'Bhuvan', amount: 500, time: '2 hours ago', isAnonymous: false },
    { id: 5, name: 'Anonymous Devotee', amount: 1001, time: '3 hours ago', isAnonymous: true },
  ];

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

      <div className="divide-y divide-slate-800">
        {recentDonors.map((d) => (
          <div key={d.id} className="py-3.5 flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-orange-400 font-extrabold text-xs">
                {d.isAnonymous ? '🙏' : d.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-white text-sm">
                  {d.isAnonymous ? 'Anonymous Devotee' : d.name}
                </div>
                <div className="text-[11px] text-slate-500">{d.time}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-base font-black text-emerald-400">
                ₹{d.amount.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
