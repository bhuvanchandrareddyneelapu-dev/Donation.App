import React, { useState } from 'react';
import { Heart, Calendar, MapPin, ShieldCheck, Users, Image as ImageIcon, Plus } from 'lucide-react';
import { DonateModal } from '../components/donation/DonateModal';
import { CashDonationModal } from '../components/volunteer/CashDonationModal';
import { ExpenseChart } from '../components/transparency/ExpenseChart';
import { Festival } from '../types';

export const DasaraPage: React.FC = () => {
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TRANSPARENCY' | 'GALLERY' | 'PROGRAMS'>('OVERVIEW');

  const dasaraFestival: Festival = {
    id: 2,
    name: 'Grand Mysore Dasara & Navaratri Festival 2026',
    festivalType: 'DASARA',
    bannerUrl: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=1200',
    idolImageUrl: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=800',
    description: 'World-famous 10-day Mysore Dasara celebration featuring illuminated Mysore Palace, Jumboo Savari procession, and Chamundeshwari Temple pujas.',
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

  const target = dasaraFestival.targetAmount;
  const collected = dasaraFestival.currentCollection;
  const pct = Math.round((collected / target) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl mb-10">
          <div className="aspect-[21/9] sm:aspect-[25/9] relative">
            <img src={dasaraFestival.bannerUrl} alt="Mysore Dasara" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          </div>

          <div className="p-6 sm:p-10 -mt-20 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-600 text-white shadow-lg">
                🏹 DASARA (DUSSEHRA) 2026
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white mt-2">{dasaraFestival.name}</h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1.5">{dasaraFestival.description}</p>
            </div>

            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowDonateModal(true)}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-sm shadow-xl shadow-amber-500/30 hover:brightness-110 active:scale-95 transition flex items-center justify-center space-x-2"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Online Donation</span>
              </button>
              <button
                onClick={() => setShowCashModal(true)}
                className="px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Volunteer Cash Entry</span>
              </button>
            </div>
          </div>
        </div>

        {/* Progress Tracker Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 mb-10 shadow-xl">
          <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-4">Donation Progress Tracker</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 font-bold">Target Amount</span>
              <div className="text-2xl font-black text-white mt-1">₹40,00,000</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 font-bold">Collected Amount</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">₹26,50,000</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
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

        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-slate-800 pb-4 mb-8 overflow-x-auto">
          {['OVERVIEW', 'PROGRAMS', 'TRANSPARENCY'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition ${
                activeTab === tab ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
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
                <h3 className="text-lg font-bold text-white mb-4">Dasara Key Programs</h3>
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

      </div>

      {showDonateModal && <DonateModal festival={dasaraFestival} onClose={() => setShowDonateModal(false)} />}
      {showCashModal && <CashDonationModal festival={dasaraFestival} onClose={() => setShowCashModal(false)} />}
    </div>
  );
};
