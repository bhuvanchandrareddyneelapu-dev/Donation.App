import React, { useState } from 'react';
import { Calendar, ArrowRight, ArrowLeft, Clock, MapPin, Sparkles, Flower2, Flame, Utensils, Music, Waves, Megaphone } from 'lucide-react';
import { FestivalConfig, FestivalUpdateCategory } from '../../config/festivalConfig';

interface FestivalUpdatesProps {
  config: FestivalConfig;
  onNext: () => void;
  onBack: () => void;
}

export const FestivalUpdates: React.FC<FestivalUpdatesProps> = ({
  config,
  onNext,
  onBack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(config.updates[0]?.id || 'puja');

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'flower':
        return <Flower2 className="w-4 h-4 text-orange-400" />;
      case 'flame':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'utensils':
        return <Utensils className="w-4 h-4 text-emerald-400" />;
      case 'music':
        return <Music className="w-4 h-4 text-sky-400" />;
      case 'waves':
        return <Waves className="w-4 h-4 text-blue-400" />;
      case 'megaphone':
        return <Megaphone className="w-4 h-4 text-rose-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  const activeCategoryData: FestivalUpdateCategory =
    config.updates.find((u) => u.id === selectedCategory) || config.updates[0];

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center py-8 px-4">
      <div className="max-w-4xl w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-extrabold text-xs">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Festival Schedule & Program Updates</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            📅 {config.communityName} Festival Updates
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Explore daily pujas, aarti schedules, mahaprasadam distribution, and cultural activities.
          </p>
        </div>

        {/* Category Tabs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {config.updates.map((cat) => {
            const isActive = cat.id === selectedCategory;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1.5 ${
                  isActive
                    ? 'bg-gradient-to-b from-orange-500 to-amber-600 text-white border-orange-400 shadow-lg shadow-orange-600/30 font-bold scale-[1.02]'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white font-medium'
                }`}
              >
                <div className={`p-1.5 rounded-xl ${isActive ? 'bg-white/20' : 'bg-slate-900'}`}>
                  {getCategoryIcon(cat.iconName)}
                </div>
                <span className="text-xs tracking-tight line-clamp-1">{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* Category Detail Card */}
        {activeCategoryData && (
          <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30">
                  {getCategoryIcon(activeCategoryData.iconName)}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">{activeCategoryData.title}</h3>
                  <p className="text-xs text-slate-400">{activeCategoryData.description}</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-extrabold text-xs">
                {activeCategoryData.badge}
              </span>
            </div>

            {/* Schedule Items List */}
            <div className="space-y-3.5">
              {activeCategoryData.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-950 text-orange-400 font-mono text-[11px] font-bold border border-slate-800">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {item.timeOrDate}
                      </span>
                      <h4 className="font-extrabold text-white text-sm">{item.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400 pl-1">{item.details}</p>
                  </div>

                  {item.location && (
                    <div className="flex items-center space-x-1 text-[11px] text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{item.location}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Configurable Placeholder Reminder */}
            <div className="text-center p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 italic">
              ✨ {activeCategoryData.placeholderText} for {config.communityName}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm flex items-center space-x-2 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:brightness-110 active:scale-95 text-white font-extrabold text-sm shadow-xl shadow-orange-500/30 flex items-center space-x-2 transition"
          >
            <span>Next: Support Our Festival</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
