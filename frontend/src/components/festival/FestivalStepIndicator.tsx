import React from 'react';
import { Sparkles, Heart, Bell, Calendar, CheckCircle2, Flame, LayoutDashboard } from 'lucide-react';

interface FestivalStepIndicatorProps {
  currentStep: number;
  maxVisitedStep: number;
  onSelectStep: (step: number) => void;
}

export const FestivalStepIndicator: React.FC<FestivalStepIndicatorProps> = ({
  currentStep,
  maxVisitedStep,
  onSelectStep,
}) => {
  const steps = [
    { num: 1, label: 'Welcome', icon: Sparkles },
    { num: 2, label: 'Dashboard', icon: LayoutDashboard },
    { num: 3, label: 'Darshan', icon: Flame },
    { num: 4, label: 'Notifications', icon: Bell },
    { num: 5, label: 'Updates', icon: Calendar },
    { num: 6, label: 'Donate', icon: Heart },
    { num: 7, label: 'Receipt', icon: CheckCircle2 },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-3">
      {/* Mobile view compact indicator */}
      <div className="flex items-center justify-between sm:hidden bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3 shadow-lg">
        <div className="flex items-center space-x-2">
          <span className="w-7 h-7 rounded-full bg-orange-500 text-white font-extrabold text-xs flex items-center justify-center shadow-md shadow-orange-500/30">
            {currentStep}
          </span>
          <div>
            <div className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">Step {currentStep} of {steps.length}</div>
            <div className="text-xs font-black text-white">{steps[currentStep - 1]?.label}</div>
          </div>
        </div>

        <div className="flex space-x-1">
          {steps.map((s) => (
            <button
              key={s.num}
              disabled={s.num > maxVisitedStep}
              onClick={() => onSelectStep(s.num)}
              className={`h-2 rounded-full transition-all ${
                s.num === currentStep
                  ? 'w-5 bg-orange-500 shadow-sm shadow-orange-500/50'
                  : s.num <= maxVisitedStep
                  ? 'w-2 bg-slate-700 hover:bg-slate-500'
                  : 'w-2 bg-slate-800/50 opacity-40'
              }`}
              title={s.label}
            />
          ))}
        </div>
      </div>

      {/* Desktop view detailed step indicator */}
      <div className="hidden sm:flex items-center justify-between relative bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-2 shadow-xl">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = s.num === currentStep;
          const isCompleted = s.num < currentStep || (s.num <= maxVisitedStep && s.num !== currentStep);
          const isAccessible = s.num <= maxVisitedStep;

          return (
            <React.Fragment key={s.num}>
              <button
                type="button"
                disabled={!isAccessible}
                onClick={() => onSelectStep(s.num)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 ring-1 ring-orange-400/50'
                    : isCompleted
                    ? 'bg-slate-800/60 text-slate-200 hover:bg-slate-800 hover:text-white border border-slate-700/50'
                    : 'text-slate-500 opacity-50 cursor-not-allowed'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white animate-pulse' : isCompleted ? 'text-orange-400' : 'text-slate-500'}`} />
                <span>{s.label}</span>
              </button>

              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 transition ${s.num < currentStep ? 'bg-orange-500/50' : 'bg-slate-800'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
