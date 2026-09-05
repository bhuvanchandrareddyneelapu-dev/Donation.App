import React, { useState } from 'react';
import { Heart, Calendar, MapPin, ShieldCheck, Users, Image as ImageIcon, Plus, Sparkles, MessageSquare } from 'lucide-react';
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
    name: 'Unicode Estates Ganesh Chaturthi Celebrations 2026',
    festivalType: 'GANESH_CHATURTHI',
    bannerUrl: '/assets/images/unicode-estates-ganesh-idol.png',
    idolImageUrl: '/assets/images/unicode-estates-ganesh-idol.png',
    description: 'Come together with our Unicode Estates community to celebrate Ganpati Bappa with devotion, joy, togetherness and new beginnings.',
    venue: 'Unicode Estates',
    organizer: 'Unicode Estates Cultural & Festival Committee',
    targetAmount: 500000,
    currentCollection: 345000,
    installationDate: '2026-09-14',
    immersionDate: '2026-09-24',
    active: true,
  };

  const schedule = [
    { time: '06:00 AM', title: 'Grand Arrival & Prana Pratishtha Puja', desc: 'Vedic chantings by priests' },
    { time: '07:30 PM', title: 'Maha Aarti & Cultural Evening', desc: 'Community Bhajan performance' },
    { time: '12:00 PM - 03:00 PM', title: 'Daily Mahaprasadam Kitchen', desc: 'Serving all community devotees' },
    { time: 'Starting 05:00 PM', title: 'Ganesh Nimajjan Utsav Procession', desc: 'Unicode Estates Procession Route' },
  ];

  const galleryImages = [
    { url: '/assets/images/unicode-estates-ganesh-idol.png', title: 'Unicode Estates Ganesh Idol 2026' },
    { url: '/assets/images/unicode-estates-ganesh-idol.png', title: 'Grand Mandap & Devotional Lighting' },
    { url: '/assets/images/unicode-estates-ganesh-idol.png', title: 'Devotees Performing Evening Maha Aarti' },
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
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      
      {/* High-Impact Full-Width Festival Hero Banner */}
      <div className="relative w-full bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div className="relative h-[380px] sm:h-[480px] w-full">
          <img
            src={ganeshFestival.bannerUrl}
            alt="Grand Ganesh Chaturthi Idol & Floral Mandap"
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient Dark Overlays for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />

          {/* Banner Content */}
          <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-10">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-orange-600/90 text-white font-black text-xs uppercase tracking-wider shadow-lg backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>🕉️ Grand Ganesh Chaturthi Mahotsav 2026</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight drop-shadow-md">
                {ganeshFestival.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed max-w-2xl">
                {ganeshFestival.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 pt-1 font-medium">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-orange-400" />
                  <span>{ganeshFestival.venue}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Installation: {ganeshFestival.installationDate} | Visarjan: {ganeshFestival.immersionDate}</span>
                </div>
              </div>

              {/* Instant Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-3">
                <button
                  onClick={() => setShowDonateModal(true)}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-black text-base shadow-xl shadow-orange-500/40 hover:brightness-110 active:scale-95 transition flex items-center space-x-2"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  <span>❤️ Donate Now (Under 1 Min)</span>
                </button>

                <a
                  href="#schedule"
                  className="px-6 py-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:border-slate-500 text-slate-200 font-bold text-sm transition flex items-center space-x-2"
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Event Schedule</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Festival Summary Progress Bar Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 mb-10 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <span className="text-xs font-black text-orange-400 uppercase tracking-widest">Committee: {ganeshFestival.organizer}</span>
              <h2 className="text-2xl font-extrabold text-white mt-0.5">Donation & Collection Overview</h2>
            </div>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/50 px-3.5 py-2 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Verifiable Public Audit</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 font-bold">Target Amount</span>
              <div className="text-2xl font-black text-white mt-1">₹50,00,000</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 font-bold">Collected Amount</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">₹34,50,000</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 font-bold">Remaining Amount</span>
              <div className="text-2xl font-black text-orange-400 mt-1">₹15,50,000</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-400">Festival Target Completion</span>
              <span className="text-orange-400">{pct}% Achieved</span>
            </div>
            <div className="w-full h-3.5 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex space-x-2 border-b border-slate-800 pb-4 mb-8 overflow-x-auto">
          {['OVERVIEW', 'TRANSPARENCY', 'GALLERY', 'VOLUNTEERS', 'COMMUNITY'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition ${
                activeTab === tab ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'OVERVIEW' && (
          <div id="schedule" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Festival Schedule & Pujas</h3>
                <div className="space-y-4">
                  {schedule.map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start space-x-4">
                      <div className="px-3 py-1.5 rounded-xl bg-orange-600/20 border border-orange-500/30 text-orange-400 text-xs font-bold whitespace-nowrap">
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
                <h3 className="text-base font-bold text-white mb-2">Organizer & Mandap Info</h3>
                <div>
                  <span className="text-slate-400 block">Committee:</span>
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
                  <span className="text-slate-400 block">Visarjan Date:</span>
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

        {activeTab === 'COMMUNITY' && (
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
            <Sparkles className="w-10 h-10 text-amber-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">Join the Devotee Community Feed</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">Access daily pooja photos, live celebrations, aarti videos, announcements, and immersion updates.</p>
            <a
              href="/community"
              className="inline-block px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-lg"
            >
              Explore Community Feed
            </a>
          </div>
        )}

      </div>

      {showDonateModal && <DonateModal festival={ganeshFestival} onClose={() => setShowDonateModal(false)} />}
      {showCashModal && <CashDonationModal festival={ganeshFestival} onClose={() => setShowCashModal(false)} />}
    </div>
  );
};
