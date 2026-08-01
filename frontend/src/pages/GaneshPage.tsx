import React, { useState } from 'react';
import { Heart, Calendar, MapPin, ShieldCheck, Users, Image as ImageIcon, MessageSquare, Plus, Download, Eye, QrCode } from 'lucide-react';
import { DonateModal } from '../components/donation/DonateModal';
import { CashDonationModal } from '../components/volunteer/CashDonationModal';
import { ExpenseChart } from '../components/transparency/ExpenseChart';
import { Festival } from '../types';

export const GaneshPage: React.FC = () => {
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TRANSPARENCY' | 'GALLERY' | 'VOLUNTEERS' | 'COMMUNITY'>('OVERVIEW');

  const ganeshFestival: Festival = {
    id: 1,
    name: 'Grand Ganesh Chaturthi Mahotsav 2026',
    festivalType: 'GANESH_CHATURTHI',
    bannerUrl: 'https://images.unsplash.com/photo-1605626830588-4663e26b1c5a?w=1200',
    idolImageUrl: 'https://images.unsplash.com/photo-1605626830588-4663e26b1c5a?w=800',
    description: 'Celebrating 92 years of divine grand Ganeshotsav with 24x7 Mahaprasadam, free medical camps, and community blood donation drives.',
    venue: 'Lalbaug Ground, Parel, Mumbai, Maharashtra 400012',
    organizer: 'Lalbaugcha Raja Executive Committee',
    targetAmount: 5000000,
    currentCollection: 3450000,
    installationDate: '2026-09-14',
    immersionDate: '2026-09-24',
    active: true,
  };

  const schedule = [
    { time: '06:00 AM', title: 'Grand Arrival & Prana Pratishtha Puja', desc: 'Vedic chantings by 21 priests' },
    { time: '07:30 PM', title: 'Maha Aarti & Cultural Evening', desc: 'Live Bhajan performance by renowned artists' },
    { time: '12:00 PM - 03:00 PM', title: 'Daily 24x7 Mahaprasadam Kitchen', desc: 'Serving 15,000 devotees daily' },
    { time: 'Sep 24, 08:00 AM', title: 'Grand Visarjan Immersion Procession', desc: 'Girgaon Chowpatty Immersion Route' },
  ];

  const galleryImages = [
    { url: 'https://images.unsplash.com/photo-1605626830588-4663e26b1c5a?w=600', title: 'Divine Idol 2026' },
    { url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600', title: 'Floral Pandal Theme' },
    { url: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=600', title: 'Evening Maha Aarti' },
  ];

  const volunteers = [
    { name: 'Aarav Patel', role: 'Gate 2 VIP & Cash Counter', phone: '+91 98765 43213', badge: 'VOL-BADGE-8841' },
    { name: 'Sanjay Mehta', role: 'Mahaprasadam Kitchen Queue', phone: '+91 98765 11223', badge: 'VOL-BADGE-8842' },
    { name: 'Deepa Kulkarni', role: 'Medical & First Aid Desk', phone: '+91 98765 33445', badge: 'VOL-BADGE-8843' },
  ];

  const target = ganeshFestival.targetAmount;
  const collected = ganeshFestival.currentCollection;
  const remaining = target - collected;
  const pct = Math.round((collected / target) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl mb-10">
          <div className="aspect-[21/9] sm:aspect-[25/9] relative">
            <img src={ganeshFestival.bannerUrl} alt="Ganesh Chaturthi" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          </div>

          <div className="p-6 sm:p-10 -mt-20 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-orange-600 text-white shadow-lg">
                🕉️ GANESH CHATURTHI 2026
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white mt-2">{ganeshFestival.name}</h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1.5">{ganeshFestival.description}</p>
            </div>

            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowDonateModal(true)}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-orange-500/30 hover:brightness-110 active:scale-95 transition flex items-center justify-center space-x-2"
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
              <div className="text-2xl font-black text-white mt-1">₹50,00,000</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 font-bold">Collected Amount</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">₹34,50,000</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 font-bold">Remaining Amount</span>
              <div className="text-2xl font-black text-orange-400 mt-1">₹15,50,000</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-400">Current Progress</span>
              <span className="text-orange-400">{pct}% Achieved</span>
            </div>
            <div className="w-full h-3.5 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex space-x-2 border-b border-slate-800 pb-4 mb-8 overflow-x-auto">
          {['OVERVIEW', 'TRANSPARENCY', 'GALLERY', 'VOLUNTEERS'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition ${
                activeTab === tab ? 'bg-orange-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
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
                <h3 className="text-lg font-bold text-white mb-4">Festival Schedule & Events</h3>
                <div className="space-y-4">
                  {schedule.map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start space-x-4">
                      <div className="px-3 py-1.5 rounded-xl bg-orange-600/20 border border-orange-500/30 text-orange-400 text-xs font-bold">
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
                <h3 className="text-base font-bold text-white mb-2">Organizer & Venue Details</h3>
                <div>
                  <span className="text-slate-400 block">Organizer Committee:</span>
                  <span className="font-bold text-white">{ganeshFestival.organizer}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Venue:</span>
                  <span className="font-bold text-white">{ganeshFestival.venue}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Installation Date:</span>
                  <span className="font-bold text-orange-400">{ganeshFestival.installationDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Immersion Date (Visarjan):</span>
                  <span className="font-bold text-orange-400">{ganeshFestival.immersionDate}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'TRANSPARENCY' && (
          <div className="space-y-8">
            <ExpenseChart categoryData={{ DECORATION: 450000, PRASADAM: 680000, LIGHTING: 220000, GENERATOR: 85000, STAGE: 310000 }} />
          </div>
        )}

        {activeTab === 'GALLERY' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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

        {activeTab === 'VOLUNTEERS' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {volunteers.map((vol, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2 text-xs">
                <div className="font-bold text-white text-sm">{vol.name}</div>
                <div className="text-slate-400">{vol.role}</div>
                <div className="text-orange-400 font-mono">{vol.badge}</div>
              </div>
            ))}
          </div>
        )}

      </div>

      {showDonateModal && <DonateModal festival={ganeshFestival} onClose={() => setShowDonateModal(false)} />}
      {showCashModal && <CashDonationModal festival={ganeshFestival} onClose={() => setShowCashModal(false)} />}
    </div>
  );
};
