import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Sparkles, ArrowRight, Calendar, MapPin, Users, Award, Lock, CheckCircle2 } from 'lucide-react';
import { DonateModal } from '../components/donation/DonateModal';
import { Festival } from '../types';

export const HomePage: React.FC = () => {
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);

  const festivals: Festival[] = [
    {
      id: 1,
      name: 'Grand Ganesh Chaturthi Mahotsav 2026',
      festivalType: 'GANESH_CHATURTHI',
      bannerUrl: 'https://images.unsplash.com/photo-1605626830588-4663e26b1c5a?w=1000',
      idolImageUrl: 'https://images.unsplash.com/photo-1605626830588-4663e26b1c5a?w=800',
      description: 'Celebrating 92 years of divine grand Ganeshotsav with 24x7 Mahaprasadam, free medical camps, and community blood donation drives.',
      venue: 'Lalbaug Ground, Parel, Mumbai',
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
      bannerUrl: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=1000',
      idolImageUrl: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=800',
      description: 'World-famous 10-day Mysore Dasara celebration featuring illuminated Mysore Palace, Jumboo Savari procession, and Goddess Chamundeshwari pujas.',
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden border-b border-slate-900">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-orange-600/20 via-amber-500/10 to-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Donation.app (Version 1) - Festival Committee Portal</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Digital Management & Public Transparency For <span className="text-gradient-saffron">Ganesh Chaturthi & Dasara</span>
          </h1>

          <p className="text-lg text-slate-300 max-w-2xl mx-auto mt-6 font-normal leading-relaxed">
            Replaces manual notebook donation tracking. Digital receipts via WhatsApp, on-ground volunteer cash recording, line-by-line expense audits, and live progress tracking.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#festivals"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-base shadow-xl shadow-orange-500/30 hover:brightness-110 active:scale-95 transition"
            >
              Select Festival Event
            </a>
            <Link
              to="/transparency"
              className="px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-slate-200 hover:text-white font-bold text-base transition flex items-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Public Audit Ledger</span>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
              <div className="text-3xl font-black text-white">₹61.00 Lakhs</div>
              <div className="text-xs text-slate-400 mt-1">Total Digitized Collection</div>
            </div>
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
              <div className="text-3xl font-black text-orange-400">100%</div>
              <div className="text-xs text-slate-400 mt-1">WhatsApp Receipt Automation</div>
            </div>
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
              <div className="text-3xl font-black text-emerald-400">1,240+</div>
              <div className="text-xs text-slate-400 mt-1">On-Ground Volunteer Cash Receipts</div>
            </div>
          </div>

        </div>
      </section>

      {/* Version 1 Festival Cards Section (ONLY Ganesh Chaturthi & Dasara) */}
      <section id="festivals" className="py-20 bg-slate-950 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-orange-500 uppercase tracking-widest">Version 1 Supported Festivals</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">Select A Festival Event</h2>
            <p className="text-sm text-slate-400 mt-2">
              Choose your organizing committee to donate, view live expense audits, or inspect photo galleries.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Card 1: Ganesh Chaturthi */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col hover:border-orange-500/50 transition duration-300">
              <div className="aspect-[16/9] relative overflow-hidden">
                <img
                  src={festivals[0].bannerUrl}
                  alt={festivals[0].name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-orange-600/90 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg">
                  🕉️ Ganesh Chaturthi
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-white">{festivals[0].name}</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{festivals[0].description}</p>
                  
                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-orange-400" />
                      <span>{festivals[0].venue}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>Installation: {festivals[0].installationDate} | Immersion: {festivals[0].immersionDate}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">Collection: ₹34.50 Lakhs</span>
                    <span className="text-orange-400">Target: ₹50 Lakhs (69%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 w-[69%]" />
                  </div>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    to="/ganesh"
                    className="py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs text-center border border-slate-700 transition"
                  >
                    View Event Details
                  </Link>
                  <button
                    onClick={() => setSelectedFestival(festivals[0])}
                    className="py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs shadow-lg shadow-orange-600/30 transition flex items-center justify-center space-x-2"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Donate Now</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Dasara */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col hover:border-amber-500/50 transition duration-300">
              <div className="aspect-[16/9] relative overflow-hidden">
                <img
                  src={festivals[1].bannerUrl}
                  alt={festivals[1].name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-amber-600/90 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg">
                  🏹 Dasara (Dussehra)
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-white">{festivals[1].name}</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{festivals[1].description}</p>
                  
                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <span>{festivals[1].venue}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      <span>Starts: {festivals[1].installationDate} | Vijayadashami: {festivals[1].immersionDate}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">Collection: ₹26.50 Lakhs</span>
                    <span className="text-amber-400">Target: ₹40 Lakhs (66%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 w-[66%]" />
                  </div>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    to="/dasara"
                    className="py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs text-center border border-slate-700 transition"
                  >
                    View Event Details
                  </Link>
                  <button
                    onClick={() => setSelectedFestival(festivals[1])}
                    className="py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-lg shadow-amber-600/30 transition flex items-center justify-center space-x-2"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Donate Now</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Transparency Banner */}
      <section className="py-16 bg-slate-900/60 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>100% Verifiable Public Audits</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">Full Transparency For Every Rupee</h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto">
            Inspect line-item expense entries for Decoration, Sound, Lighting, Food/Prasadam, and Stage setup alongside uploaded vendor bill invoices.
          </p>
          <div className="pt-2">
            <Link
              to="/transparency"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 transition"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Open Public Transparency Portal</span>
            </Link>
          </div>
        </div>
      </section>

      {selectedFestival && (
        <DonateModal festival={selectedFestival} onClose={() => setSelectedFestival(null)} />
      )}

    </div>
  );
};
