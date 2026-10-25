import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HeartHandshake,
  X,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  MessageCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

const COMMON_TRIGGERS = [
  'Late-night unmonitored phone use',
  'Loneliness or isolation',
  'Work / academic stress',
  'Aimless boredom or unstructured time',
  'Fatigue / physical exhaustion (HALT)',
  'Provocative image on social media / TV',
  'Emotional rejection or anger',
  'Curiosity / testing boundaries'
];

const PRACTICAL_CHANGES = [
  'Move smartphone charging station outside the bedroom',
  'Enable strict DNS filtering (CleanBrowsing) on phone/router',
  'Delete triggering app or log out of social platform',
  'Call or message accountability partner immediately',
  'Establish a strict 10:00 PM screen-off boundary',
  'Schedule purposeful outdoor exercise or service'
];

export const SetbackModal: React.FC = () => {
  const { setbackModalOpen, setSetbackModalOpen, recordSetback, profile } = useApp();
  const [selectedTrigger, setSelectedTrigger] = useState(COMMON_TRIGGERS[0]);
  const [customTrigger, setCustomTrigger] = useState('');
  const [selectedChange, setSelectedChange] = useState(PRACTICAL_CHANGES[0]);
  const [customChange, setCustomChange] = useState('');
  const [reflectionNote, setReflectionNote] = useState('');
  const [confessionPrayed, setConfessionPrayed] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  if (!setbackModalOpen) return null;

  const finalTrigger = customTrigger.trim() || selectedTrigger;
  const finalChange = customChange.trim() || selectedChange;

  const handleComplete = () => {
    recordSetback(finalTrigger, finalChange, reflectionNote);
    setSetbackModalOpen(false);
    setStep(1);
    setConfessionPrayed(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-blue-500/40 shadow-2xl text-slate-100 flex flex-col my-auto max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border-b border-blue-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white tracking-wide font-cinzel text-base sm:text-lg">
                Grace, Truth & Restoration
              </h2>
              <p className="text-xs text-blue-300">Proverbs 24:16 — The Righteous Rises Again</p>
            </div>
          </div>
          <button
            onClick={() => setSetbackModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {step === 1 ? (
            <>
              {/* Scripture Anchor of Hope */}
              <div className="p-4 rounded-xl bg-gradient-to-b from-blue-950/50 to-slate-950 border border-blue-500/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <span>The Word of the Lord to You Right Now:</span>
                </div>
                <blockquote className="text-sm italic text-slate-200 border-l-2 border-amber-400 pl-3 py-1">
                  "For the righteous falls seven times and rises again..."
                  <span className="block not-italic font-bold text-amber-300 text-xs mt-1">
                    — Proverbs 24:16
                  </span>
                </blockquote>
                <p className="text-xs text-slate-400 leading-relaxed">
                  A setback does not disqualify you from God's love. Your righteousness is not based on your
                  streak; it is anchored in the finished work of Jesus Christ. Get back up!
                </p>
              </div>

              {/* Prayer of Confession & Cleansing */}
              <div className="space-y-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Prayer of Confession (1 John 1:9)</span>
                </label>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                    "Lord Jesus, I confess that I stumbled. I looked where I should not have looked, and I
                    yielded to the deception of the flesh. I do not hide in shame. I run to the cross. Your
                    blood cleanses me from ALL unrighteousness. I receive Your forgiveness, I rise again, and I
                    choose to walk in Your light today. Amen."
                  </p>
                  <button
                    onClick={() => setConfessionPrayed(!confessionPrayed)}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition ${
                      confessionPrayed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{confessionPrayed ? 'Confession Prayed & Cleansed' : 'I Have Prayed This Prayer'}</span>
                  </button>
                </div>
              </div>

              {/* Trigger Identification */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-blue-400" />
                  <span>What was the open door or trigger?</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COMMON_TRIGGERS.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setSelectedTrigger(t);
                        setCustomTrigger('');
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs transition ${
                        selectedTrigger === t && !customTrigger
                          ? 'bg-blue-600/25 border-blue-400 text-white font-medium'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or enter custom trigger..."
                  value={customTrigger}
                  onChange={(e) => setCustomTrigger(e.target.value)}
                  className="w-full mt-2 px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </>
          ) : (
            <>
              {/* STEP 2: Practical Change & Forward March */}
              <div className="space-y-3 animate-in fade-in">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 uppercase">
                  Step 2: Practical Battle Adjustment
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white font-cinzel">
                  What will you change next time?
                </h3>
                <p className="text-xs text-slate-300">
                  Repentance is practical adjustment. Slam the specific door that was left unlocked:
                </p>

                <div className="space-y-2">
                  {PRACTICAL_CHANGES.map((change) => (
                    <button
                      key={change}
                      onClick={() => {
                        setSelectedChange(change);
                        setCustomChange('');
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs transition ${
                        selectedChange === change && !customChange
                          ? 'bg-emerald-500/20 border-emerald-400 text-white font-medium'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {change}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Or custom boundary plan..."
                  value={customChange}
                  onChange={(e) => setCustomChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />

                {/* Optional Reflection */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Personal Reflection or Journal Note (Optional):
                  </label>
                  <textarea
                    rows={3}
                    placeholder="What did this reveal to you about your heart, fatigue, or need for God?"
                    value={reflectionNote}
                    onChange={(e) => setReflectionNote(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Accountability Partner Reach Out */}
                {profile.accountabilityPartnerName && (
                  <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-indigo-300">
                      <MessageCircle className="w-4 h-4" />
                      <span>Partner: <strong>{profile.accountabilityPartnerName}</strong></span>
                    </div>
                    <span className="text-slate-400 text-[11px]">Send an honest check-in</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          {step === 2 ? (
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs sm:text-sm hover:from-blue-500 hover:to-indigo-500 shadow-md transition"
            >
              <span>Next: Battle Adjustment</span>
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm shadow-lg transition active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Rise Again & Continue Journey</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
