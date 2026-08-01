import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Festival } from '../types';
import { DonateModal } from '../components/donation/DonateModal';
import { Link } from 'react-router-dom';

export const FestivalsPage: React.FC = () => {
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);

  const festivals: Festival[] = [
    {
      id: 1,
      name: 'Grand Ganesh Chaturthi Mahotsav 2026',
      festivalType: 'GANESH_CHATURTHI',
      bannerUrl: 'https://images.unsplash.com/photo-1605626830588-4663e26b1c5a?w=800',
      description: 'Celebrating 92 years of divine grand Ganeshotsav with 24x7 Mahaprasadam, free medical camps, and community blood donation drives.',
      venue: 'Lalbaug Ground, Mumbai',
      organizer: 'Lalbaugcha Raja Executive Committee',
      targetAmount: 5000000,
      currentCollection: 3450000,
      installationDate: '2026-09-14',
      immersionDate: '2026-09-24',
      active: true,
    },
    {
      id: 2,
      name: 'Grand Mysore Dasara & Navaratri Festival 2026',
      festivalType: 'DASARA',
      bannerUrl: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=800',
      description: 'World-famous 10-day Mysore Dasara celebration featuring illuminated Mysore Palace, Jumboo Savari procession, and Chamundeshwari Temple pujas.',
      venue: 'Mysore Palace Grounds, Mysuru',
      organizer: 'Mysore Dasara Committee',
      targetAmount: 4000000,
      currentCollection: 2650000,
      installationDate: '2026-10-15',
      immersionDate: '2026-10-24',
      active: true,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Banner */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-black text-white">Version 1 Festival Events</h1>
          <p className="text-slate-400 text-sm mt-2">
            Contribute directly to verified Ganesh Chaturthi & Dasara organizing committees.
          </p>
        </div>

        {/* Festival Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {festivals.map((fest) => {
            const pct = Math.round((fest.currentCollection / fest.targetAmount) * 100);
            return (
              <div key={fest.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col hover:border-orange-500/50 transition">
                <div className="aspect-video relative">
                  <img src={fest.bannerUrl} alt={fest.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-extrabold text-orange-400">
                    {fest.festivalType}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{fest.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{fest.description}</p>
                    <div className="text-xs text-slate-500 mt-2 font-medium">📍 {fest.venue}</div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-400">Raised: ₹{(fest.currentCollection / 100000).toFixed(2)}L</span>
                      <span className="text-orange-400">{pct}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to={fest.festivalType === 'GANESH_CHATURTHI' ? '/ganesh' : '/dasara'}
                      className="py-3 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs text-center border border-slate-700"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => setSelectedFestival(fest)}
                      className="py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs shadow-md shadow-orange-600/20 transition flex items-center justify-center space-x-2"
                    >
                      <Heart className="w-4 h-4 fill-white" />
                      <span>Donate</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {selectedFestival && (
        <DonateModal festival={selectedFestival} onClose={() => setSelectedFestival(null)} />
      )}
    </div>
  );
};
