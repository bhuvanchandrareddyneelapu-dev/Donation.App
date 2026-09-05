import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { defaultFestivalConfig, FestivalConfig } from '../config/festivalConfig';
import { FestivalStepIndicator } from '../components/festival/FestivalStepIndicator';
import { GaneshWelcome } from '../components/festival/GaneshWelcome';
import { FestivalDashboard } from '../components/festival/FestivalDashboard';
import { GaneshDarshan } from '../components/festival/GaneshDarshan';
import { FestivalNotifications } from '../components/festival/FestivalNotifications';
import { FestivalUpdates } from '../components/festival/FestivalUpdates';
import { DonationStep } from '../components/festival/DonationStep';
import { DonationSuccess } from '../components/festival/DonationSuccess';
import { NimajjanExperience } from '../components/festival/NimajjanExperience';
import { DonorWall } from '../components/donation/DonorWall';
import api from '../services/api';

export const HomePage: React.FC = () => {
  const [config, setConfig] = useState<FestivalConfig>(() => {
    const saved = localStorage.getItem('unicode_estates_festival_config');
    if (saved) {
      try {
        return { ...defaultFestivalConfig, ...JSON.parse(saved) };
      } catch (e) {
        console.error(e);
      }
    }
    return defaultFestivalConfig;
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxVisitedStep, setMaxVisitedStep] = useState<number>(2);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [showNimajjanModal, setShowNimajjanModal] = useState<boolean>(false);

  useEffect(() => {
    const loadLiveConfig = async () => {
      try {
        const res = await api.get('/festivals/1');
        if (res.data && res.data.configJson) {
          const parsed = JSON.parse(res.data.configJson);
          setConfig((prev) => ({ ...prev, ...parsed }));
        }
      } catch (err) {
        console.warn('Using local/default festival configuration:', err);
      }
    };
    loadLiveConfig();
  }, []);

  const goToStep = (step: number) => {
    setCurrentStep(step);
    if (step > maxVisitedStep) {
      setMaxVisitedStep(step);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDashboardNavigate = (section: 'welcome' | 'darshan' | 'notifications' | 'updates' | 'donate' | 'visarjan') => {
    switch (section) {
      case 'welcome':
        goToStep(1);
        break;
      case 'darshan':
        goToStep(3);
        break;
      case 'notifications':
        goToStep(4);
        break;
      case 'updates':
      case 'visarjan':
        goToStep(5);
        break;
      case 'donate':
        goToStep(6);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      
      {/* Top Festival Step Navigation Bar */}
      <div className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-md py-1">
        <FestivalStepIndicator
          currentStep={currentStep}
          maxVisitedStep={maxVisitedStep}
          onSelectStep={(s) => goToStep(s)}
        />
      </div>

      {/* Main Multi-Step Onboarding & Dashboard Journey */}
      <div className="transition-all duration-500">
        {currentStep === 1 && (
          <GaneshWelcome
            config={config}
            onNext={() => goToStep(2)}
            onJumpToDonation={() => goToStep(6)}
          />
        )}

        {currentStep === 2 && (
          <FestivalDashboard
            config={config}
            onNavigateTo={handleDashboardNavigate}
            onOpenNimajjan={() => setShowNimajjanModal(true)}
          />
        )}

        {currentStep === 3 && (
          <GaneshDarshan
            config={config}
            onNext={() => goToStep(4)}
            onBack={() => goToStep(2)}
          />
        )}

        {currentStep === 4 && (
          <FestivalNotifications
            config={config}
            onNext={() => goToStep(5)}
            onBack={() => goToStep(3)}
          />
        )}

        {currentStep === 5 && (
          <FestivalUpdates
            config={config}
            onNext={() => goToStep(6)}
            onBack={() => goToStep(4)}
          />
        )}

        {currentStep === 6 && (
          <DonationStep
            config={config}
            onBack={() => goToStep(5)}
            onSuccess={(data) => {
              setReceiptData(data);
              goToStep(7);
            }}
          />
        )}

        {currentStep === 7 && (
          <DonationSuccess
            config={config}
            receiptData={receiptData}
            onRestart={() => goToStep(1)}
          />
        )}
      </div>

      {/* Nimajjan Modal overlay if triggered from Dashboard */}
      {showNimajjanModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl overflow-y-auto">
          <NimajjanExperience
            config={config}
            onClose={() => setShowNimajjanModal(false)}
          />
        </div>
      )}

      {/* Additional Festival Resources & Live Devotee Wall */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        
        {/* Quick Portal Navigation Cards */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-orange-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{config.communityName} Festival Portals & Tools</span>
              </div>
              <h3 className="text-xl font-extrabold text-white mt-1">Explore Full Festival Features</h3>
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/50 px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Itemized Public Audit Ledger</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/ganesh"
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-orange-500/50 transition group space-y-2"
            >
              <div className="text-xl">🕉️</div>
              <h4 className="font-bold text-white text-sm group-hover:text-orange-400 transition">Ganesh Mahotsav Portal</h4>
              <p className="text-xs text-slate-400">View detailed schedule, mahaprasadam kitchen info, and mandap committee updates.</p>
            </Link>

            <Link
              to="/transparency"
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition group space-y-2"
            >
              <div className="text-xl">📊</div>
              <h4 className="font-bold text-white text-sm group-hover:text-emerald-400 transition">Public Expense Ledger</h4>
              <p className="text-xs text-slate-400">View vendor bills, decoration expenses, and live collection reports.</p>
            </Link>

            <Link
              to="/donor/history"
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition group space-y-2"
            >
              <div className="text-xl">📱</div>
              <h4 className="font-bold text-white text-sm group-hover:text-amber-400 transition">Donor History & Receipts</h4>
              <p className="text-xs text-slate-400">Retrieve your past contributions and download PDF receipts using phone OTP.</p>
            </Link>

            <Link
              to="/community"
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-500/50 transition group space-y-2"
            >
              <div className="text-xl">🎉</div>
              <h4 className="font-bold text-white text-sm group-hover:text-sky-400 transition">Devotee Community Feed</h4>
              <p className="text-xs text-slate-400">Access daily pooja photos, live evening aarti videos, and resident posts.</p>
            </Link>
          </div>
        </div>

        {/* Live Devotee Wall Component */}
        <DonorWall />

      </div>

    </div>
  );
};
