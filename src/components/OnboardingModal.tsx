import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RecoveryGoal, AccountabilityType } from '../types';
import {
  Shield,
  Sparkles,
  Target,
  AlertCircle,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Lock
} from 'lucide-react';

const GOAL_OPTIONS: { id: RecoveryGoal; label: string; desc: string }[] = [
  { id: 'stop_pornography', label: 'Stop Pornography', desc: 'Overcome digital visual consumption and guard the eyes.' },
  { id: 'stop_masturbation', label: 'Stop Masturbation', desc: 'Break the compulsive cycle and master the body in honor.' },
  { id: 'overcome_lustful_habits', label: 'Overcome Lustful Habits', desc: 'Take thoughts captive and arrest sexual fantasies.' },
  { id: 'reduce_compulsive_behavior', label: 'Reduce Compulsive Urges', desc: 'Interrupt automatic reflexes of emotional escapism.' },
  { id: 'pursue_sexual_purity', label: 'Pursue Overall Sexual Purity', desc: 'Walk in holiness, honor God\'s design, and picture Christ.' }
];

const TRIGGER_PRESETS = [
  'Late-night phone in bed',
  'Loneliness & isolation',
  'Work / academic stress',
  'Aimless boredom',
  'Social media browsing',
  'Fatigue / exhaustion',
  'Feelings of rejection',
  'Unstructured weekends'
];

export const OnboardingModal: React.FC = () => {
  const { profile, updateProfile } = useApp();
  const [step, setStep] = useState<number>(1);
  const [displayName, setDisplayName] = useState(profile.displayName || '');
  const [primaryGoals, setPrimaryGoals] = useState<RecoveryGoal[]>(
    profile.primaryGoals && profile.primaryGoals.length > 0
      ? profile.primaryGoals
      : (profile.mainGoal ? [profile.mainGoal] : ['stop_pornography', 'pursue_sexual_purity'])
  );
  const [triggers, setTriggers] = useState<string[]>(profile.primaryTriggers || ['Late-night phone in bed', 'Loneliness & isolation']);
  const [customTrigger, setCustomTrigger] = useState('');
  const [reminderTime, setReminderTime] = useState(profile.devotionalReminderTime || '07:30');
  const [accountabilityType, setAccountabilityType] = useState<AccountabilityType>(
    profile.accountabilityType || 'private_self_guided'
  );
  const [partnerName, setPartnerName] = useState(profile.accountabilityPartnerName || '');

  // If already completed onboarding, do not show
  if (profile.completedOnboarding) return null;

  const toggleGoal = (goalId: RecoveryGoal) => {
    setPrimaryGoals((prev) => {
      if (prev.includes(goalId)) {
        // Keep at least one goal selected
        if (prev.length <= 1) return prev;
        return prev.filter((g) => g !== goalId);
      }
      return [...prev, goalId];
    });
  };

  const toggleTrigger = (item: string) => {
    setTriggers((prev) =>
      prev.includes(item) ? prev.filter((t) => t !== item) : [...prev, item]
    );
  };

  const addCustomTrigger = () => {
    if (customTrigger.trim() && !triggers.includes(customTrigger.trim())) {
      setTriggers([...triggers, customTrigger.trim()]);
      setCustomTrigger('');
    }
  };

  const handleFinish = () => {
    updateProfile({
      displayName: displayName.trim(),
      primaryGoals,
      mainGoal: primaryGoals[0] || 'stop_pornography',
      primaryTriggers: triggers,
      devotionalReminderTime: reminderTime,
      accountabilityType,
      accountabilityPartnerName: partnerName.trim(),
      completedOnboarding: true,
      startDate: new Date().toISOString(),
      lastSetbackDate: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-amber-500/40 shadow-2xl text-slate-100 flex flex-col my-auto max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-950 via-slate-900 to-amber-950/60 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-white tracking-wide font-cinzel text-base sm:text-lg">
                Armour of God
              </h2>
              <p className="text-xs text-amber-300">Personalize Your Recovery Journey</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            Step {step} of 4
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 h-1">
          <div
            className="bg-amber-500 h-1 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1: Welcome & Name & Privacy */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-center space-y-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Stand Firm. Walk in Purity. Live in Freedom.
                </span>
                <h3 className="text-xl font-bold text-white font-cinzel">Welcome, Soldier</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                  Overcoming sexual sin is not a test of isolated willpower. It is a spiritual battle fought
                  with the supernatural equipment of Ephesians 6 and the grace of Jesus Christ.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Preferred Nickname or Display Name (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g., David, Pilgrim, Brother (leave blank if preferred)"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
                <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>100% Private & Local:</strong> No email, password, phone number, or cloud tracking is
                  collected. All your data stays strictly on this device.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Primary Goals (Multi-select) */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                    <Target className="w-4 h-4" />
                    <span>Mission Objectives</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {primaryGoals.length} Selected
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-cinzel">What are your primary goals?</h3>
                <p className="text-xs text-slate-400">Select one or more goals to shape your spiritual walk:</p>
              </div>

              <div className="space-y-2">
                {GOAL_OPTIONS.map((goal) => {
                  const isChecked = primaryGoals.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => toggleGoal(goal.id)}
                      className={`w-full p-3 rounded-xl border text-left transition flex items-start gap-3 ${
                        isChecked
                          ? 'bg-amber-500/15 border-amber-400 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 border transition ${
                          isChecked
                            ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold'
                            : 'border-slate-600 bg-slate-900'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-white flex items-center justify-between">
                          <span>{goal.label}</span>
                          {isChecked && (
                            <span className="text-[10px] text-amber-400 font-mono font-bold">Active</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{goal.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Temptation Triggers */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  <span>Reconnaissance</span>
                </div>
                <h3 className="text-lg font-bold text-white font-cinzel">Identify Your Common Triggers</h3>
                <p className="text-xs text-slate-400">Select what most frequently tempts you (select all that apply):</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {TRIGGER_PRESETS.map((t) => {
                  const isChecked = triggers.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggleTrigger(t)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition flex items-center gap-2 ${
                        isChecked
                          ? 'bg-amber-500/20 border-amber-400 text-white font-medium'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${
                          isChecked ? 'bg-amber-500 border-amber-400 text-slate-950' : 'border-slate-600'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="truncate">{t}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add custom trigger..."
                  value={customTrigger}
                  onChange={(e) => setCustomTrigger(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomTrigger()}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={addCustomTrigger}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-medium hover:bg-slate-700"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Reminders & Accountability */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                  <Users className="w-4 h-4" />
                  <span>Support & Rhythm</span>
                </div>
                <h3 className="text-lg font-bold text-white font-cinzel">Rhythm & Accountability</h3>
                <p className="text-xs text-slate-400">Establish your daily devotional rhythm and support approach:</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Preferred Morning Devotional Time:</span>
                </label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-300">
                  Accountability Strategy:
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'private_self_guided', label: 'Private Self-Guided Journey', desc: 'Personal quiet reflection and scriptural discipline.' },
                    { id: 'trusted_christian_partner', label: 'Trusted Christian Accountability Partner', desc: 'Locking shields with a mature brother/sister in Christ.' },
                    { id: 'pastor_or_mentor', label: 'Pastor or Mentor Guidance', desc: 'Discipleship under pastoral oversight.' }
                  ].map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => setAccountabilityType(acc.id as any)}
                      className={`w-full p-2.5 rounded-xl border text-left transition ${
                        accountabilityType === acc.id
                          ? 'bg-amber-500/20 border-amber-400 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="text-xs font-semibold text-white">{acc.label}</div>
                      <div className="text-[11px] text-slate-400">{acc.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {accountabilityType !== 'private_self_guided' && (
                <div className="space-y-1.5 pt-1 animate-in fade-in">
                  <label className="text-xs font-semibold text-slate-300">
                    Partner / Mentor Name (Optional):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Pastor John, Marcus"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((prev) => prev - 1)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep((prev) => prev + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs sm:text-sm hover:from-amber-400 hover:to-amber-500 shadow-md transition"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl active:scale-95 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Put On the Armor & Enter</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
