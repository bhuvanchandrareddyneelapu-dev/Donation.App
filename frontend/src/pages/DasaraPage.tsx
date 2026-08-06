import React, { useState } from 'react';
import { Heart, Calendar, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { DonateModal } from '../components/donation/DonateModal';
import { CashDonationModal } from '../components/volunteer/CashDonationModal';
import { ExpenseChart } from '../components/transparency/ExpenseChart';
import { Festival } from '../types';

export const DasaraPage: React.FC = () => {
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TRANSPARENCY' | 'PROGRAMS' | 'GALLERY'>('OVERVIEW');

  const dasaraFestival: Festival = {
    id: 2,
    name: 'Grand Mysore Dasara & Navaratri Festival 2026',
    festivalType: 'DASARA',
    bannerUrl: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=1600',
    idolImageUrl: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=1000',
    description: 'World-famous 10-day Mysore Dasara celebration featuring illuminated Mysore Palace, Jumboo Savari procession, and Goddess Chamundeshwari pujas.',
    venue: 'Mysore Palace Grounds, Mysuru, Karnataka 570001',
    organizer: 'Mysore Dasara Executive Committee',
    targetAmount: 4000000,
    currentCollection: 2650000,
    installationDate: '2026-10-15',
    immersionDate: '2026-10-24',
    active: true,
  };

  const programs = [
    { time: 'Oct 15, 06:30 PM', title: 'Palace Illumination & Inauguration', desc: 'Lighting of 100,000 electric bulbs at Mysore Palace' },
    { time: 'Oct 18, 07:00 PM', title: 'State Cultural Music & Dance Night', desc: 'Performances by classical artists' },
    { time: 'Oct 24, 02:00 PM', title: 'Jumboo Savari Elephant Procession', desc: '750kg Golden Howdah carrying Goddess Chamundeshwari' },
  ];

  const galleryImages = [
    { url: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=800', title: 'Illuminated Mysore Palace 2026' },
    { url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800', title: 'Goddess Chamundeshwari Puja' },
  ];

  const target = dasaraFestival.targetAmount;
  const collected = dasaraFestival.currentCollection;
  const pct = Math.round((collected / target) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      
      {/* High-Impact Full-Width Festival Hero Banner */}
      <div className="relative w-full bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div className="relative h-[380px] sm:h-[480px] w-full">
          <img
            src={dasaraFestival.bannerUrl}
            alt="Grand Mysore Dasara Palace Illumination"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />

          <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-10">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-600/90 text-white font-black text-xs uppercase tracking-wider shadow-lg backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-orange-300" />
                <span>🏹 Grand Mysore Dasara & Navaratri 2026</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight drop-shadow-md">
                {dasaraFestival.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed max-w-2xl">
                {dasaraFestival.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 pt-1 font-medium">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>{dasaraFestival.venue}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-orange-400" />
                  <span>Starts: {dasaraFestival.installationDate} | Vijayadashami: {dasaraFestival.immersionDate}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-3">
                <button
                  onClick={() => setShowDonateModal(true)}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-base shadow-xl shadow-amber-500/40 hover:brightness-110 active:scale-95 transition flex items-center space-x-2"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  <span>❤️ Donate Now (Under 1 Min)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Progress Tracker Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 mb-10 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest">Committee: {dasaraFestival.organizer}</span>
              <h2 className="text-2xl font-extrabold text-white mt-0.5">Donation & Progress Summary</h2>
            </div>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/50 px-3.5 py-2 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Public Transparency</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 font-bold">Target Amount</span>
              <div className="text-2xl font-black text-white mt-1">₹40,00,000</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 font-bold">Collected Amount</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">₹26,50,000</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 font-bold">Remaining Amount</span>
              <div className="text-2xl font-black text-amber-400 mt-1">₹13,50,000</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-400">Current Progress</span>
              <span className="text-amber-400">{pct}% Achieved</span>
            </div>
            <div className="w-full h-3.5 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-slate-800 pb-4 mb-8 overflow-x-auto">
          {['OVERVIEW', 'PROGRAMS', 'TRANSPARENCY', 'GALLERY'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition ${
                activeTab === tab ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Dasara Key Events & Processions</h3>
                <div className="space-y-4">
                  {programs.map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start space-x-4">
                      <div className="px-3 py-1.5 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-400 text-xs font-bold whitespace-nowrap">
                        {item.time}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{item.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-xs space-y-3">
                <h3 className="text-base font-bold text-white mb-2">Venue & Committee Info</h3>
                <div>
                  <span className="text-slate-400 block">Organizer:</span>
                  <span className="font-bold text-white">{dasaraFestival.organizer}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Venue:</span>
                  <span className="font-bold text-white">{dasaraFestival.venue}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Vijayadashami Date:</span>
                  <span className="font-bold text-amber-400">{dasaraFestival.immersionDate}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'TRANSPARENCY' && (
          <div className="space-y-8">
            <ExpenseChart categoryData={{ LIGHTING: 850000, STAGE: 450000, PRASADAM: 320000, DECORATION: 280000 }} />
          </div>
        )}

        {activeTab === 'GALLERY' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {galleryImages.map((img, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden group">
                <div className="aspect-video relative overflow-hidden">
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-4 text-xs font-bold text-white">{img.title}</div>
              </div>
            ))}
          </div>
        )}

      </div>

      {showDonateModal && <DonateModal festival={dasaraFestival} onClose={() => setShowDonateModal(false)} />}
      {showCashModal && <CashDonationModal festival={dasaraFestival} onClose={() => setShowCashModal(false)} />}
    </div>
  );
};
