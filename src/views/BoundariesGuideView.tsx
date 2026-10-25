import React, { useState } from 'react';
import { BOUNDARIES_GUIDE, BoundaryGuideSection } from '../data/boundariesGuideData';
import {
  ShieldAlert,
  Smartphone,
  Wifi,
  Lock,
  Globe,
  Home,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

export const BoundariesGuideView: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string>(BOUNDARIES_GUIDE[0].id);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? '' : id));
  };

  const getIcon = (category: BoundaryGuideSection['category']) => {
    switch (category) {
      case 'transparency':
        return Info;
      case 'dns':
        return Wifi;
      case 'os_restrictions':
        return Smartphone;
      case 'safesearch':
        return Globe;
      case 'apps':
        return Lock;
      case 'physical_environment':
        return Home;
      default:
        return ShieldAlert;
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      {/* Header */}
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
          <Lock className="w-3.5 h-3.5" />
          Radical Amputation & Digital Fences
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-cinzel">
          Device Boundaries & Blocking Guide
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          "Make no provision for the flesh" (Romans 13:14). Comprehensive, actionable instructions to
          lock down your devices, Wi-Fi networks, and bedroom habits.
        </p>
      </div>

      {/* Guide Accordions */}
      <div className="space-y-3.5">
        {BOUNDARIES_GUIDE.map((section) => {
          const Icon = getIcon(section.category);
          const isExpanded = expandedId === section.id;
          const isTransparency = section.category === 'transparency';

          return (
            <div
              key={section.id}
              className={`rounded-2xl border transition overflow-hidden ${
                isTransparency
                  ? 'bg-gradient-to-r from-blue-950/60 to-slate-900 border-blue-500/40 shadow-lg'
                  : isExpanded
                  ? 'bg-slate-900 border-amber-500/40 shadow-md'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                onClick={() => toggleExpand(section.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                      isTransparency
                        ? 'bg-blue-600/20 text-blue-300 border-blue-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base font-cinzel">
                      {section.title}
                    </h3>
                    <p className="text-xs text-slate-400">{section.summary}</p>
                  </div>
                </div>

                <div className="text-slate-400 p-1">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 space-y-4 text-xs sm:text-sm text-slate-300">
                  <div className="space-y-2.5">
                    {section.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-amber-300 space-y-1">
                    <strong className="text-amber-400 block font-semibold">Pro Defense Tip:</strong>
                    <p className="leading-relaxed">{section.tips}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
