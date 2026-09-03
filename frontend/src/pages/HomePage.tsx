import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Users, Calendar, ArrowRight, Sparkles, Smartphone } from 'lucide-react';
import { Festival } from '../types';
import { DonateModal } from '../components/donation/DonateModal';
import { DonorWall } from '../components/donation/DonorWall';

export const HomePage: React.FC = () => {
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);

  const ganeshFestival: Festival = {
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
  };

  const dasaraFestival: Festival = {
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
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Digital Festival Management & Transparency Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Transparent Digital Contributions for <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500">Ganesh Chaturthi</span> & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Dasara</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Zero-friction digital donations with instant cryptographic Email PDF receipts, volunteer cash recording, and 100% itemized public expense transparency.
          </p>

          {/* Quick Action Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/ganesh"
              className="px-8 py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm shadow-xl shadow-orange-600/30 flex items-center space-x-2 transition"
            >
              <span>🕉️ Ganesh Chaturthi Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/donor/history"
              className="px-6 py-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-sm flex items-center space-x-2 transition"
            >
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>Donor History (Phone / OTP)</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        
        {/* Festival Cards Grid */}
        <div>
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Active Festival Events 2026</h2>
            <p className="text-xs text-slate-400 mt-1">Select a festival event to view live collections, schedules, and expense ledgers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Ganesh Chaturthi Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col hover:border-orange-500/50 transition shadow-xl">
              <div className="aspect-video relative">
                <img src={ganeshFestival.bannerUrl} alt={ganeshFestival.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-extrabold text-orange-400">
                  🕉️ GANESH CHATURTHI
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{ganeshFestival.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{ganeshFestival.description}</p>
                  <div className="text-xs text-slate-500 mt-2">📍 {ganeshFestival.venue}</div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">Raised: ₹34.50L</span>
                    <span className="text-orange-400">69%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: '69%' }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/ganesh"
                    className="py-3 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs text-center border border-slate-700"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => setSelectedFestival(ganeshFestival)}
                    className="py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs shadow-md shadow-orange-600/20 transition flex items-center justify-center space-x-2"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Donate Now</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Dasara Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col hover:border-amber-500/50 transition shadow-xl">
              <div className="aspect-video relative">
                <img src={dasaraFestival.bannerUrl} alt={dasaraFestival.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-extrabold text-amber-400">
                  🏹 DASARA
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{dasaraFestival.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{dasaraFestival.description}</p>
                  <div className="text-xs text-slate-500 mt-2">📍 {dasaraFestival.venue}</div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">Raised: ₹26.50L</span>
                    <span className="text-amber-400">66%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '66%' }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/dasara"
                    className="py-3 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs text-center border border-slate-700"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => setSelectedFestival(dasaraFestival)}
                    className="py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-md shadow-amber-600/20 transition flex items-center justify-center space-x-2"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Donate Now</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Live Devotee Wall Component */}
        <DonorWall />

      </div>

      {selectedFestival && (
        <DonateModal festival={selectedFestival} onClose={() => setSelectedFestival(null)} />
      )}
    </div>
  );
};
