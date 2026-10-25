import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { THIRTY_DAY_PLAN, MILESTONE_BADGES } from '../data/recoveryPlanData';
import { PlanDay } from '../types';
import {
  Compass,
  CheckCircle2,
  Calendar,
  Flame,
  Award,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  BookOpen,
  Footprints,
  Shield,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RecoveryJourneyView: React.FC = () => {
  const {
    daysSinceLastSetback,
    totalDaysActive,
    completedPlanDays,
    togglePlanDay
  } = useApp();

  const [activePlan, setActivePlan] = useState<'30day' | '7day' | 'milestones'>('30day');
  const [selectedDay, setSelectedDay] = useState<PlanDay | null>(null);
  const [phaseFilter, setPhaseFilter] = useState<number>(0); // 0 = all

  const handleToggleDay = (dayNum: number) => {
    togglePlanDay(dayNum);
    if (!completedPlanDays.includes(dayNum)) {
      // Trigger joyful celebration confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  const planToDisplay = activePlan === '7day' ? THIRTY_DAY_PLAN.slice(0, 7) : THIRTY_DAY_PLAN;

  const filteredDays = planToDisplay.filter((d) => phaseFilter === 0 || d.phaseNumber === phaseFilter);

  const completedCount = completedPlanDays.length;
  const progressPercent = Math.min(100, Math.round((completedCount / 30) * 100));

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      {/* Detail Day Reader View */}
      {selectedDay ? (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedDay(null)}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Journey Roadmap</span>
          </button>

          <article className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-7 space-y-6 shadow-xl">
            {/* Header info */}
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                  Day {selectedDay.dayNumber} of 30 • {selectedDay.phaseName}
                </span>
                <button
                  onClick={() => handleToggleDay(selectedDay.dayNumber)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition border ${
                    completedPlanDays.includes(selectedDay.dayNumber)
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {completedPlanDays.includes(selectedDay.dayNumber)
                      ? 'Day Completed!'
                      : 'Mark as Completed'}
                  </span>
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white font-cinzel">
                {selectedDay.title}
              </h2>

              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="text-slate-400">Armour Focus:</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/20">
                  {selectedDay.armorFocus}
                </span>
              </div>
            </div>

            {/* Daily Scripture */}
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/25 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Scripture Meditation: {selectedDay.scriptureRef}</span>
              </div>
              <blockquote className="text-sm italic text-slate-200 font-serif leading-relaxed">
                "{selectedDay.scriptureText}"
              </blockquote>
            </div>

            {/* Devotional Message */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>Daily Devotional Teaching</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                {selectedDay.devotional}
              </p>
            </div>

            {/* Habit Task */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wide">
                <Footprints className="w-4 h-4" />
                <span>Practical Habit-Building Task</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
                {selectedDay.habitTask}
              </p>
            </div>

            {/* Reflection Question */}
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wide">
                <HelpCircle className="w-4 h-4" />
                <span>Personal Reflection</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                "{selectedDay.reflectionQuestion}"
              </p>
            </div>

            {/* Daily Prayer */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-serif italic text-xs sm:text-sm text-slate-300">
              <span className="not-italic font-bold text-amber-400 text-xs uppercase tracking-wider block mb-1">
                Day {selectedDay.dayNumber} Prayer
              </span>
              <p>{selectedDay.prayer}</p>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              {selectedDay.dayNumber > 1 ? (
                <button
                  onClick={() =>
                    setSelectedDay(
                      THIRTY_DAY_PLAN.find((d) => d.dayNumber === selectedDay.dayNumber - 1) || null
                    )
                  }
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Previous Day
                </button>
              ) : (
                <div />
              )}

              {selectedDay.dayNumber < 30 ? (
                <button
                  onClick={() =>
                    setSelectedDay(
                      THIRTY_DAY_PLAN.find((d) => d.dayNumber === selectedDay.dayNumber + 1) || null
                    )
                  }
                  className="px-4 py-2 rounded-xl text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20"
                >
                  Next Day
                </button>
              ) : (
                <button
                  onClick={() => setSelectedDay(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                >
                  Complete Journey
                </button>
              )}
            </div>
          </article>
        </div>
      ) : (
        <>
          {/* Header & Overview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  <Compass className="w-3.5 h-3.5" />
                  Spiritual Growth Roadmaps
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-cinzel mt-1">
                  Recovery Journey
                </h2>
              </div>

              {/* Progress Circle badge */}
              <div className="text-right">
                <span className="text-sm font-bold font-mono text-amber-400">{completedCount} / 30 Days</span>
                <div className="w-24 h-1.5 bg-slate-950 rounded-full mt-1 overflow-hidden border border-slate-800">
                  <div
                    className="bg-amber-500 h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300">
              Never locked behind perfection. Even if you stumble, you never lose your learning progress.
              Rise again, put on the armour, and keep marching!
            </p>
          </div>

          {/* Plan Switcher */}
          <div className="flex border-b border-slate-800 text-xs sm:text-sm font-semibold gap-2 pb-1">
            <button
              onClick={() => setActivePlan('30day')}
              className={`px-4 py-2 rounded-t-xl transition ${
                activePlan === '30day'
                  ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              30-Day Growth Plan (4 Phases)
            </button>
            <button
              onClick={() => setActivePlan('7day')}
              className={`px-4 py-2 rounded-t-xl transition ${
                activePlan === '7day'
                  ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              7-Day Starter
            </button>
            <button
              onClick={() => setActivePlan('milestones')}
              className={`px-4 py-2 rounded-t-xl transition ${
                activePlan === 'milestones'
                  ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Milestone Badges
            </button>
          </div>

          {/* 30-Day / 7-Day Plan List */}
          {activePlan !== 'milestones' && (
            <div className="space-y-4">
              {/* Phase Filter Buttons (for 30-day) */}
              {activePlan === '30day' && (
                <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                  {[
                    { id: 0, label: 'All 30 Days' },
                    { id: 1, label: 'Phase 1: Honesty' },
                    { id: 2, label: 'Phase 2: Boundaries' },
                    { id: 3, label: 'Phase 3: Disciplines' },
                    { id: 4, label: 'Phase 4: Growth' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPhaseFilter(p.id)}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                        phaseFilter === p.id
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Days Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredDays.map((day) => {
                  const isCompleted = completedPlanDays.includes(day.dayNumber);
                  return (
                    <div
                      key={day.dayNumber}
                      onClick={() => setSelectedDay(day)}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 group ${
                        isCompleted
                          ? 'bg-slate-900/90 border-slate-800/80 hover:border-amber-500/40'
                          : 'bg-slate-900 border-slate-800 hover:border-amber-500/50 shadow-md'
                      }`}
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            Day {day.dayNumber}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate">{day.armorFocus}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 font-cinzel truncate">
                          {day.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate font-serif italic">
                          "{day.scriptureText}"
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isCompleted && (
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                        )}
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Milestones Shelf */}
          {activePlan === 'milestones' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                Milestones celebrate consistency and perseverance. Unlocked automatically based on your days
                standing firm ({daysSinceLastSetback} Days current streak).
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {MILESTONE_BADGES.map((badge) => {
                  const isUnlocked = daysSinceLastSetback >= badge.daysRequired;
                  return (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-2xl border transition flex items-start gap-3.5 ${
                        isUnlocked
                          ? 'bg-gradient-to-br from-amber-950/20 to-slate-900 border-amber-500/50 shadow-lg'
                          : 'bg-slate-950/60 border-slate-800/80 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 border ${
                          isUnlocked
                            ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 border-amber-300 shadow-md'
                            : 'bg-slate-900 border-slate-800 text-slate-600'
                        }`}
                      >
                        <Award className="w-6 h-6" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white font-cinzel">{badge.title}</h4>
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                              isUnlocked
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {badge.daysRequired} Days
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">{badge.subtitle}</p>
                        <p className="text-[11px] text-amber-400/90 font-serif italic">{badge.verse}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
