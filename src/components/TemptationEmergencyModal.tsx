import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SWORD_VERSES } from '../data/swordVersesData';
import {
  AlertTriangle,
  X,
  Volume2,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  PhoneCall,
  Footprints,
  BookOpen,
  Music,
  PenTool,
  PhoneOff
} from 'lucide-react';

const REPLACEMENT_ACTIONS = [
  { id: 'walk', label: 'Walk or Exercise', icon: Footprints, desc: 'Engage your physical body and change location immediately.' },
  { id: 'scripture', label: 'Read Scripture', icon: BookOpen, desc: 'Flood your mind with the holy Word of God.' },
  { id: 'friend', label: 'Call a Trusted Friend', icon: PhoneCall, desc: 'Break secrecy and talk to an accountability partner.' },
  { id: 'worship', label: 'Listen to Worship', icon: Music, desc: 'Turn your attention toward the majesty of Jesus Christ.' },
  { id: 'journal', label: 'Journal About the Urge', icon: PenTool, desc: 'Write down what you are feeling to diffuse the tension.' },
  { id: 'device_break', label: 'Put Away the Device', icon: PhoneOff, desc: 'Leave your phone in another room for 30 minutes.' }
];

export const TemptationEmergencyModal: React.FC = () => {
  const { emergencyModalOpen, setEmergencyModalOpen, addHabitLog } = useApp();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedAction, setSelectedAction] = useState<string>('walk');
  const [randomVerseIndex, setRandomVerseIndex] = useState(0);
  const [environmentChecks, setEnvironmentChecks] = useState<Record<string, boolean>>({});

  // Step 6 Timer state (5 minutes = 300 seconds)
  const [secondsLeft, setSecondsLeft] = useState<number>(300);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [urgeOutcome, setUrgeOutcome] = useState<'decreased' | 'same' | 'increased' | null>(null);

  useEffect(() => {
    if (emergencyModalOpen) {
      setCurrentStep(1);
      setSecondsLeft(300);
      setTimerRunning(false);
      setUrgeOutcome(null);
      setRandomVerseIndex(Math.floor(Math.random() * SWORD_VERSES.length));
      setEnvironmentChecks({});
    }
  }, [emergencyModalOpen]);

  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, secondsLeft]);

  if (!emergencyModalOpen) return null;

  const activeVerse = SWORD_VERSES[randomVerseIndex] || SWORD_VERSES[0];

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const handleFinishEmergency = () => {
    // Record victory in habit log
    addHabitLog({
      emotionalState: 'Emergency Mode Activated',
      trigger: 'Urgent Temptation Overcome',
      urgeIntensity: 9,
      actionTaken: `Completed Emergency Tool: ${selectedAction}. Urge outcome: ${urgeOutcome || 'managed'}`,
      resisted: true,
      reflection: 'Successfully paused, changed environment, prayed, wielded Scripture, and took replacement action.'
    });
    setEmergencyModalOpen(false);
  };

  const nextVerse = () => {
    setRandomVerseIndex((prev) => (prev + 1) % SWORD_VERSES.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border-2 border-red-500/50 shadow-2xl text-slate-100 flex flex-col my-auto max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/80 border-b border-red-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white tracking-wide font-cinzel text-base sm:text-lg">
                Emergency Battle Station
              </h2>
              <p className="text-xs text-red-300 font-medium">Step {currentStep} of 6 — Stand Firm</p>
            </div>
          </div>
          <button
            onClick={() => setEmergencyModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 h-1.5">
          <div
            className="bg-gradient-to-r from-red-500 to-amber-500 h-1.5 transition-all duration-300"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1: PAUSE */}
          {currentStep === 1 && (
            <div className="space-y-4 text-center py-2 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/40 text-red-400 flex items-center justify-center mx-auto shadow-lg shadow-red-500/10">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 uppercase tracking-wider">
                  Step 1: The Sovereign Pause
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-cinzel">
                  "You Do Not Have to Obey This Urge"
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed max-w-sm mx-auto">
                  Take a slow, deep breath. The craving you feel is not an order; it is only a suggestion.
                  In Jesus Christ, sin has lost its dominion over you.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-left space-y-2 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>The 10-Second Physical Reset:</span>
                </div>
                <p>1. Unclench your jaw and drop your shoulders.</p>
                <p>2. Inhale deeply through your nose for 4 seconds, exhale for 6 seconds.</p>
                <p>3. Declare silently: <em>"Christ is Lord of my body right now."</em></p>
              </div>
            </div>
          )}

          {/* STEP 2: CHANGE ENVIRONMENT */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 uppercase">
                  Step 2: Physical Movement
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white font-cinzel">
                  Change Your Physical Environment
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm">
                  Fleeing is physical action. Check off at least two immediate actions right now:
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: 'c1', text: 'Close the browser, app, or website immediately.' },
                  { id: 'c2', text: 'Put the smartphone face down or in another room.' },
                  { id: 'c3', text: 'Leave the bedroom or bathroom immediately.' },
                  { id: 'c4', text: 'Move into a shared, brightly lit, or public space.' },
                  { id: 'c5', text: 'Drink a tall glass of cold water or splash face.' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      setEnvironmentChecks((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                    }
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left text-xs sm:text-sm transition ${
                      environmentChecks[item.id]
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border ${
                        environmentChecks[item.id]
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                          : 'border-slate-600'
                      }`}
                    >
                      {environmentChecks[item.id] && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <span>{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: PRAY */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 uppercase">
                  Step 3: Cry of Deliverance
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white font-cinzel">
                  Pray This Prayer Aloud Right Now
                </h3>
                <p className="text-slate-300 text-xs">
                  Read these words out loud. Hearing your own voice breaks the mental fog:
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-b from-blue-950/40 to-slate-950 border border-blue-500/40 shadow-inner space-y-3">
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-serif italic">
                  "Lord Jesus, I need You right now! The urge is pressing hard against my flesh.
                  But You have already defeated sin on the cross.
                  I renounce this temptation in Your name.
                  You promised You would provide the way of escape, and I choose that escape right now!
                  Fill my heart with Your peace, give me supernatural strength, and cleanse my eyes.
                  Jesus, You are my Lord and my Defender. Amen."
                </p>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
                <Volume2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Speak it aloud. Satan cannot read your mind, but he must flee from Jesus' name.</span>
              </div>
            </div>
          )}

          {/* STEP 4: USE SCRIPTURE */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 uppercase">
                    Step 4: Wield the Sword
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white font-cinzel">
                    Thrust With the Word of God
                  </h3>
                </div>
                <button
                  onClick={nextVerse}
                  className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Next Verse</span>
                </button>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border-2 border-amber-500/40 shadow-lg space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
                  <span>{activeVerse.categoryLabel}</span>
                  <span className="bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    {activeVerse.reference}
                  </span>
                </div>
                <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                  "{activeVerse.text}"
                </p>
                <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <strong className="text-amber-300">How to wield: </strong>
                  {activeVerse.wieldExplanation}
                </div>
              </div>

              <p className="text-xs text-center text-slate-400">
                Repeat: <em>"It is written: {activeVerse.reference}!"</em>
              </p>
            </div>
          )}

          {/* STEP 5: REPLACEMENT ACTION */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 uppercase">
                  Step 5: Healthy Replacement
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white font-cinzel">
                  Choose Your Next Healthy Action
                </h3>
                <p className="text-slate-300 text-xs">
                  The law of displacement: do not leave a vacuum. Occupy your body and mind:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {REPLACEMENT_ACTIONS.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedAction === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedAction(item.id)}
                      className={`p-3 rounded-xl border text-left transition flex flex-col gap-1.5 ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: CHECK IN & TIMER */}
          {currentStep === 6 && (
            <div className="space-y-4 text-center animate-in fade-in">
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 uppercase">
                  Step 6: Reset Check-In
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white font-cinzel">
                  The 5-Minute Cool-Down Timer
                </h3>
                <p className="text-slate-300 text-xs">
                  Urges peak and begin to dissipate after 5 to 10 minutes of redirected focus:
                </p>
              </div>

              {/* Timer Display */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 max-w-xs mx-auto space-y-3">
                <div className="text-4xl font-mono font-bold text-amber-400 tracking-wider">
                  {formatTime(secondsLeft)}
                </div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-semibold text-xs hover:bg-amber-400 transition"
                  >
                    {timerRunning ? 'Pause Timer' : secondsLeft === 0 ? 'Restart' : 'Start 5-Min Timer'}
                  </button>
                  <button
                    onClick={() => {
                      setSecondsLeft(300);
                      setTimerRunning(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Urge Status Check */}
              <div className="space-y-2 pt-2 text-left">
                <label className="text-xs font-semibold text-slate-300 block">
                  How does the urge feel right now?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'decreased', label: 'Decreased 👍', desc: 'Fading out' },
                    { id: 'same', label: 'Same ⏳', desc: 'Still holding' },
                    { id: 'increased', label: 'High ⚠️', desc: 'Need more action' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setUrgeOutcome(opt.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        urgeOutcome === opt.id
                          ? 'bg-emerald-500/20 border-emerald-400 text-white font-semibold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="text-xs">{opt.label}</div>
                      <div className="text-[10px] text-slate-400">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {urgeOutcome === 'increased' && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 text-left">
                  <strong>Take radical action:</strong> Step completely outside the building or immediately call your accountability partner. Better to lose privacy than purity!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 6 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-semibold text-xs sm:text-sm hover:from-red-500 hover:to-amber-500 shadow-md active:scale-95 transition"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinishEmergency}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg active:scale-95 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Stand Firm & Log Victory</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
