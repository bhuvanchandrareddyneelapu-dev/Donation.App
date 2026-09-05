import React, { useState } from 'react';
import { Sparkles, ArrowLeft, ArrowRight, X, Volume2, Waves, Clock, Calendar, MapPin, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { FestivalConfig } from '../../config/festivalConfig';

interface NimajjanExperienceProps {
  config: FestivalConfig;
  onClose?: () => void;
  onBack?: () => void;
}

export const NimajjanExperience: React.FC<NimajjanExperienceProps> = ({
  config,
  onClose,
  onBack,
}) => {
  const [currentChantIndex, setCurrentChantIndex] = useState(0);
  const [presentationMode, setPresentationMode] = useState(false);

  const nimajjan = config.nimajjan;
  const chants = nimajjan.chants;
  const isLastChant = currentChantIndex === chants.length - 1;
  const currentChant = chants[currentChantIndex];

  // Helper to split a chant into primary and response lines for large display
  const formatChantLines = (text: string) => {
    if (text.includes(' — ')) {
      const parts = text.split(' — ');
      return { line1: parts[0], line2: parts[1] };
    }
    if (text.includes('! ')) {
      const parts = text.split('! ');
      return { line1: parts[0] + '!', line2: parts[1] };
    }
    return { line1: text, line2: null };
  };

  const formattedChant = formatChantLines(currentChant);

  const handleNextChant = () => {
    if (currentChantIndex < chants.length - 1) {
      setCurrentChantIndex((prev) => prev + 1);
    } else {
      setCurrentChantIndex(0); // loop back
    }
  };

  const handlePrevChant = () => {
    if (currentChantIndex > 0) {
      setCurrentChantIndex((prev) => prev - 1);
    } else {
      setCurrentChantIndex(chants.length - 1);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center py-8 px-4 relative">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-600/15 via-orange-500/15 to-yellow-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full bg-slate-900/95 backdrop-blur-xl border border-amber-500/25 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden text-center">
        
        {/* Top Festive Border */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500" />

        {/* Top Action / Close Button if provided */}
        <div className="flex items-center justify-between">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center space-x-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Updates</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>{config.communityName} Devotional Experience</span>
            </div>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              aria-label="Close Nimajjan Experience"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Heading & Subheading */}
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 font-extrabold text-xs">
            <Waves className="w-4 h-4 text-amber-400" />
            <span>🛕 {nimajjan.title}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {nimajjan.title}
          </h1>

          <p className="text-sm sm:text-base text-amber-300/90 max-w-xl mx-auto font-medium leading-relaxed">
            "{nimajjan.subheading}"
          </p>
        </div>

        {/* Known Schedule Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
          <div className="flex items-center space-x-3 p-2">
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30">
              <Clock className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Starting Time</span>
              <span className="font-extrabold text-white">{nimajjan.startingTime}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-2 border-t sm:border-t-0 sm:border-l border-slate-800">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <Calendar className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Final Duration</span>
              <span className="font-extrabold text-white">{nimajjan.duration}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-2 border-t sm:border-t-0 sm:border-l border-slate-800">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30">
              <MapPin className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Procession Route</span>
              <span className="font-extrabold text-white">{nimajjan.route}</span>
            </div>
          </div>
        </div>

        {/* Interactive Chant Section */}
        <div className="space-y-6 pt-2">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🪔</span>
              <h2 className="text-lg font-black text-white">Nimajjan Chants</h2>
            </div>
            <span className="text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              Chant {currentChantIndex + 1} of {chants.length}
            </span>
          </div>

          {/* Featured Ganesh Idol & Chant Display Frame */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/30 bg-slate-950 shadow-2xl p-6 sm:p-10 space-y-6 min-h-[260px] flex flex-col items-center justify-center">
            
            {/* Background Idol Visual with Dark Festive Gradient Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <img
                src={config.idolImageUrl}
                alt="Ganesh idol of Unicode Estates Ganesh Chaturthi Celebrations 2026"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40 pointer-events-none" />

            {/* Chant Text Cards with Large Typography */}
            <div className="relative z-10 space-y-3 transition-all duration-300" aria-live="polite">
              <div className="text-2xl sm:text-4xl font-black text-amber-300 tracking-wide uppercase drop-shadow-md">
                {formattedChant.line1}
              </div>
              
              {formattedChant.line2 && (
                <div className="text-xl sm:text-3xl font-extrabold text-orange-400 tracking-wide uppercase drop-shadow-md flex items-center justify-center space-x-2">
                  <span className="text-amber-500 text-lg">↓</span>
                  <span>{formattedChant.line2}</span>
                </div>
              )}
            </div>

            {/* Tap for Next Chant Action Button */}
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={handlePrevChant}
                className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 transition"
                aria-label="Previous Chant"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNextChant}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-extrabold text-sm shadow-lg shadow-orange-500/30 hover:brightness-110 active:scale-95 transition flex items-center space-x-2"
              >
                <span>Tap for Next Chant</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNextChant}
                className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 transition"
                aria-label="Next Chant"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chant Together Presentation Mode Trigger */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="text-left space-y-0.5">
              <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Volume2 className="w-4 h-4 text-orange-400" />
                <span>Procession Display Mode</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Large-screen presentation view designed to show chants to community members during Nimajjan.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPresentationMode(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-extrabold text-xs flex items-center justify-center space-x-2 transition shrink-0"
            >
              <span>🔊 Chant Together</span>
            </button>
          </div>

          {/* Nimajjan Devotional Closing Message Card */}
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-amber-500/20 text-center space-y-3">
            <div className="text-amber-400 text-lg">❤️</div>
            <div className="space-y-1">
              {nimajjan.closingMessage.lines.map((line, idx) => (
                <div key={idx} className="text-sm sm:text-base font-bold text-slate-200">
                  {line}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-xs space-y-1">
              <div className="font-extrabold text-amber-300">
                {nimajjan.closingMessage.communityText}
              </div>
              <div className="text-slate-400 italic">
                "{nimajjan.closingMessage.gratitudeText}"
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* CHANT TOGETHER FULLSCREEN PRESENTATION MODE MODAL */}
      {presentationMode && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-12 overflow-y-auto">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-300 font-black text-sm uppercase tracking-wider">
              <Sparkles className="w-5 h-5 text-orange-400" />
              <span>🛕 GANPATI BAPPA! MORYA!</span>
            </div>

            <button
              type="button"
              onClick={() => setPresentationMode(false)}
              className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white text-xs font-extrabold flex items-center space-x-1.5 transition"
            >
              <X className="w-4 h-4" />
              <span>Exit Mode</span>
            </button>
          </div>

          {/* Main Visual & Chant Display */}
          <div className="my-auto max-w-4xl mx-auto w-full text-center space-y-8 py-8">
            
            {/* Ganesh Idol Centered Frame */}
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto rounded-3xl overflow-hidden border-2 border-amber-400/50 shadow-2xl bg-slate-900">
              <img
                src={config.idolImageUrl}
                alt="Ganesh idol of Unicode Estates Ganesh Chaturthi Celebrations 2026"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
            </div>

            {/* Chant Large Typography */}
            <div className="space-y-4 px-4" aria-live="polite">
              <div className="text-3xl sm:text-6xl font-black text-amber-300 tracking-wide uppercase leading-tight drop-shadow-lg">
                {formattedChant.line1}
              </div>

              {formattedChant.line2 && (
                <div className="text-2xl sm:text-5xl font-black text-orange-400 tracking-wide uppercase leading-tight drop-shadow-lg flex items-center justify-center space-x-3">
                  <span>{formattedChant.line2}</span>
                </div>
              )}
            </div>

            {/* Devotional Flowers / Diyas */}
            <div className="text-2xl sm:text-3xl space-x-3 text-amber-400">
              <span>🙏</span>
              <span>🪔</span>
              <span>🌺</span>
              <span>🪔</span>
              <span>🙏</span>
            </div>
          </div>

          {/* Bottom Control Bar */}
          <div className="max-w-xl mx-auto w-full flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handlePrevChant}
              className="flex-1 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-extrabold text-sm transition flex items-center justify-center space-x-2"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>PREVIOUS</span>
            </button>

            <button
              type="button"
              onClick={handleNextChant}
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-black text-sm shadow-xl shadow-orange-500/40 hover:brightness-110 active:scale-95 transition flex items-center justify-center space-x-2"
            >
              <span>NEXT CHANT</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
