import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import {
  Shield,
  AlertTriangle,
  HeartHandshake,
  CheckCircle2,
  BookOpen,
  Compass,
  PenLine,
  Sparkles,
  Flame,
  Volume2,
  Calendar,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Clock,
  Layers,
  Bookmark,
  Bell
} from 'lucide-react';
import { DAILY_BATTLE_PLAN_SUMMARY } from '../data/armourData';
import { MILESTONE_BADGES } from '../data/recoveryPlanData';

const DAILY_VERSES = [
  {
    ref: '1 Corinthians 10:13',
    text: 'No temptation has overtaken you that is not common to man. God is faithful, and he will not let you be tempted beyond your ability, but with the temptation he will also provide the way of escape, that you may be able to endure it.',
    theme: 'Way of Escape'
  },
  {
    ref: 'Romans 8:1',
    text: 'There is therefore now no condemnation for those who are in Christ Jesus.',
    theme: 'Freedom from Condemnation'
  },
  {
    ref: 'Psalm 101:3',
    text: 'I will not set before my eyes anything that is worthless. I hate the work of those who fall away; it shall not cling to me.',
    theme: 'Covenant with the Eyes'
  },
  {
    ref: 'Proverbs 24:16',
    text: 'For the righteous falls seven times and rises again, but the wicked stumble in times of calamity.',
    theme: 'The Righteous Rises Again'
  },
  {
    ref: 'Philippians 4:8',
    text: 'Finally, brothers, whatever is true, whatever is honorable, whatever is just, whatever is pure, whatever is lovely, whatever is commendable, think about these things.',
    theme: 'Renewing the Mind'
  }
];

export const HomeDashboard: React.FC = () => {
  const {
    profile,
    updateProfile,
    daysSinceLastSetback,
    todayChecklist,
    toggleChecklistItem,
    setEmergencyModalOpen,
    setSetbackModalOpen,
    completedPlanDays,
    habitLogs,
    savedItems,
    toggleSaveItem,
    isItemSaved,
    triggerDevotionAlarm
  } = useApp();

  const [copiedVerse, setCopiedVerse] = useState(false);

  // Pick today's verse based on day of month
  const todayDayIndex = new Date().getDate() % DAILY_VERSES.length;
  const todayVerse = DAILY_VERSES[todayDayIndex];

  // Calculate completed checklist items
  const checklistKeys: (keyof typeof todayChecklist)[] = [
    'morningPrayer',
    'beltOfTruthTruthDeclared',
    'breastplateGuardAffection',
    'shoesReadinessMission',
    'shieldWordMeditation',
    'helmetThoughtCaptive',
    'swordVerseSpoken',
    'eveningReflection'
  ];
  const completedCount = checklistKeys.filter((k) => todayChecklist[k] === true).length;
  const checklistPercentage = Math.round((completedCount / checklistKeys.length) * 100);

  // Next milestone calculation
  const nextMilestone = MILESTONE_BADGES.find((m) => m.daysRequired > daysSinceLastSetback) || MILESTONE_BADGES[MILESTONE_BADGES.length - 1];
  const prevMilestoneDays = MILESTONE_BADGES.slice().reverse().find((m) => m.daysRequired <= daysSinceLastSetback)?.daysRequired || 0;
  const milestoneProgress = Math.min(
    100,
    Math.round(((daysSinceLastSetback - prevMilestoneDays) / Math.max(1, nextMilestone.daysRequired - prevMilestoneDays)) * 100)
  );

  const copyVerse = () => {
    navigator.clipboard.writeText(`"${todayVerse.text}" — ${todayVerse.ref}`);
    setCopiedVerse(true);
    setTimeout(() => setCopiedVerse(false), 2000);
  };

  const checklistItems = [
    { key: 'morningPrayer' as const, label: 'Morning Full Armour Battle Prayer', piece: 'Prayer' },
    { key: 'beltOfTruthTruthDeclared' as const, label: 'Fasten Belt of Truth (renounce 1 lie aloud)', piece: 'Belt' },
    { key: 'breastplateGuardAffection' as const, label: 'Strap Breastplate (make no provision for flesh)', piece: 'Breastplate' },
    { key: 'shoesReadinessMission' as const, label: 'Lace Shoes of Peace (walk over spikes on mission)', piece: 'Shoes' },
    { key: 'shieldWordMeditation' as const, label: 'Soak Shield of Faith (meditate on God\'s promises)', piece: 'Shield' },
    { key: 'helmetThoughtCaptive' as const, label: 'Wear Helmet (arrest wandering thoughts immediately)', piece: 'Helmet' },
    { key: 'swordVerseSpoken' as const, label: 'Wield Sword of the Spirit (speak 1 rhema verse aloud)', piece: 'Sword' },
    { key: 'eveningReflection' as const, label: 'Evening Review & Consecration', piece: 'Evening' }
  ];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f1d3f] via-[#12224d] to-[#0a1128] border border-amber-500/25 p-5 sm:p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Ephesians 6:10-18
            </span>
            <span className="text-xs text-slate-400">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-cinzel tracking-tight">
              {profile.displayName ? `Stand Firm, ${profile.displayName}` : 'Stand Firm in the Lord'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg leading-relaxed">
              "Finally, be strong in the Lord and in the strength of his might. Put on the whole armor of God, that you may be able to stand against the schemes of the devil."
            </p>

            {/* Active Goals Badges */}
            {profile.primaryGoals && profile.primaryGoals.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Goals:</span>
                {profile.primaryGoals.map((g) => {
                  const labels: Record<string, string> = {
                    stop_pornography: 'Stop Pornography',
                    stop_masturbation: 'Stop Masturbation',
                    overcome_lustful_habits: 'Overcome Lustful Habits',
                    reduce_compulsive_behavior: 'Reduce Compulsive Urges',
                    pursue_sexual_purity: 'Overall Sexual Purity'
                  };
                  return (
                    <span
                      key={g}
                      className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-amber-500/30 text-amber-300 text-[10px] font-medium"
                    >
                      {labels[g] || g}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-lg sm:text-xl font-bold text-amber-400 font-mono flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-amber-400" />
                {daysSinceLastSetback}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Days Standing</div>
            </div>

            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-lg sm:text-xl font-bold text-emerald-400 font-mono">
                {completedCount}/8
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Armour Tasks</div>
            </div>

            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-lg sm:text-xl font-bold text-blue-400 font-mono">
                {completedPlanDays.length}/30
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Plan Days</div>
            </div>
          </div>
        </div>
      </div>

      {/* TWO PRIMARY ACTION BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* I AM BEING TEMPTED */}
        <button
          onClick={() => setEmergencyModalOpen(true)}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 p-4 sm:p-5 text-left text-white shadow-lg shadow-red-950/50 hover:brightness-110 active:scale-[0.98] transition border border-red-400/40"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-black/25">
                  <AlertTriangle className="w-5 h-5 text-amber-300 animate-pulse" />
                </div>
                <span className="font-extrabold text-base sm:text-lg tracking-wide font-cinzel">
                  I AM BEING TEMPTED
                </span>
              </div>
              <p className="text-xs text-red-100 font-medium pl-8">
                Emergency 6-Step Defense & Escape Route
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition" />
          </div>
        </button>

        {/* I HAVE HAD A SETBACK */}
        <button
          onClick={() => setSetbackModalOpen(true)}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-4 sm:p-5 text-left text-slate-100 shadow-md hover:border-blue-400/50 active:scale-[0.98] transition border border-blue-500/30"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <span className="font-bold text-base sm:text-lg tracking-wide font-cinzel text-white">
                  I HAVE HAD A SETBACK
                </span>
              </div>
              <p className="text-xs text-blue-200 font-medium pl-8">
                Gospel Grace, Confession & Rising Again
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition" />
          </div>
        </button>
      </div>

      {/* DEVOTION TIME ALARM WIDGET */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-[#101b38] to-slate-900 border border-amber-500/30 p-4 sm:p-5 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                profile.devotionalAlarmEnabled
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-500 border-slate-800'
              }`}
            >
              <Bell className={`w-5 h-5 ${profile.devotionalAlarmEnabled ? 'text-amber-400 animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm sm:text-base font-cinzel">
                  Devotion Time Alarm
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    profile.devotionalAlarmEnabled
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {profile.devotionalAlarmEnabled ? 'Alarm Active' : 'Alarm Off'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Set for <strong className="text-amber-400 font-mono">{profile.devotionalReminderTime}</strong> • Rings an audible cathedral bell chime as a spiritual reminder.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Test Alarm Sound */}
            <button
              onClick={() => triggerDevotionAlarm()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-amber-500/30 text-amber-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition"
              title="Test hearing the devotion alarm ring now"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Test Ring</span>
            </button>

            {/* Toggle Enable/Disable */}
            <button
              onClick={() => {
                const next = !profile.devotionalAlarmEnabled;
                updateProfile({ devotionalAlarmEnabled: next });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                profile.devotionalAlarmEnabled
                  ? 'bg-amber-500 text-slate-950 border-amber-400 hover:bg-amber-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {profile.devotionalAlarmEnabled ? 'Turn Off' : 'Turn On'}
            </button>
          </div>
        </div>
      </div>

      {/* TODAY'S SCRIPTURE ANCHOR */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-amber-500/10 text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-white text-xs sm:text-sm tracking-wide font-cinzel">
              TODAY'S BIBLE ANCHOR
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {/* Save Verse Button */}
            <button
              onClick={() => {
                toggleSaveItem({
                  type: 'verse',
                  title: todayVerse.ref,
                  content: todayVerse.text,
                  source: 'Daily Devotional',
                  category: todayVerse.theme
                });
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                isItemSaved(todayVerse.ref) || isItemSaved(todayVerse.text)
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
              title="Save this Bible verse to your library"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isItemSaved(todayVerse.ref) || isItemSaved(todayVerse.text) ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>{isItemSaved(todayVerse.ref) || isItemSaved(todayVerse.text) ? 'Saved' : 'Save Verse'}</span>
            </button>

            <button
              onClick={copyVerse}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium transition"
            >
              {copiedVerse ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <blockquote className="text-sm sm:text-base text-slate-200 font-serif italic leading-relaxed border-l-2 border-amber-400 pl-3.5 py-1">
          "{todayVerse.text}"
        </blockquote>

        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="font-bold text-amber-300 font-mono">{todayVerse.ref}</span>
          <span className="text-slate-400 text-[11px] bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-800">
            {todayVerse.theme}
          </span>
        </div>
      </div>

      {/* DAILY BATTLE PRAYER */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-amber-500/10 text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-white text-xs sm:text-sm tracking-wide font-cinzel">
              DAILY WARRIOR PRAYER
            </h3>
          </div>
          <button
            onClick={() => {
              toggleSaveItem({
                type: 'prayer',
                title: 'Daily Armour of God Battle Prayer',
                content: 'Lord Jesus, I surrender my eyes, thoughts, and physical desires to Your holy lordship today. Clothe me in the Full Armour of God: truth against deception, righteousness guarding my affections, peace steadying my feet, faith quenching every fiery arrow, salvation protecting my mind, and the sword of Your Word cutting down every impure urge. In Jesus’ Name, Amen.',
                source: 'Daily Devotional',
                category: 'Spiritual Warfare'
              });
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
              isItemSaved('Daily Armour of God Battle Prayer')
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
            title="Save this prayer to your library"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isItemSaved('Daily Armour of God Battle Prayer') ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>{isItemSaved('Daily Armour of God Battle Prayer') ? 'Saved' : 'Save Prayer'}</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 font-serif italic leading-relaxed border-l-2 border-amber-500/60 pl-3.5 py-1">
          "Lord Jesus, I surrender my eyes, thoughts, and physical desires to Your holy lordship today. Clothe me in the Full Armour of God: truth against deception, righteousness guarding my affections, peace steadying my feet, faith quenching every fiery arrow, salvation protecting my mind, and the sword of Your Word cutting down every impure urge. In Jesus’ Name, Amen."
        </p>

        <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
          <span>Ephesians 6:18 • Stand Firm</span>
          <Link to="/saved" className="text-amber-400 hover:underline font-medium">
            Saved Prayers ({savedItems.filter(i => i.type === 'prayer').length}) →
          </Link>
        </div>
      </div>

      {/* TODAY'S SPIRITUAL ARMOUR CHECKLIST */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-sm sm:text-base font-cinzel">
                Daily Armour Checklist
              </h3>
            </div>
            <p className="text-xs text-slate-400">Put on each piece by faith and obedience:</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-amber-400">{checklistPercentage}%</span>
            <div className="w-16 h-1.5 bg-slate-950 rounded-full mt-1 overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: `${checklistPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {checklistItems.map((item) => {
            const isChecked = !!todayChecklist[item.key];
            return (
              <button
                key={item.key}
                onClick={() => toggleChecklistItem(item.key)}
                className={`w-full p-3 rounded-xl border text-left transition flex items-center gap-3 ${
                  isChecked
                    ? 'bg-amber-500/10 border-amber-500/40 text-slate-100'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border transition ${
                    isChecked
                      ? 'bg-amber-500 border-amber-400 text-slate-950'
                      : 'border-slate-600 bg-slate-900'
                  }`}
                >
                  {isChecked && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs sm:text-sm font-medium ${isChecked ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                    {item.label}
                  </div>
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 flex-shrink-0">
                  {item.piece}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RECOVERY MILESTONE ROADMAP */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-5 space-y-3.5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400/20" />
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base font-cinzel">
                Recovery Milestone Progress
              </h3>
              <p className="text-xs text-slate-400">Next Target: {nextMilestone.title} ({nextMilestone.daysRequired} Days)</p>
            </div>
          </div>
          <Link
            to="/journey"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-0.5"
          >
            <span>Roadmap</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Milestone Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>{daysSinceLastSetback} Days Reached</span>
            <span>{nextMilestone.daysRequired} Days Target</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
              style={{ width: `${milestoneProgress}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-slate-300 italic bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          "{nextMilestone.verse}"
        </p>
      </div>

      {/* QUICK SHORTCUTS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          to="/armour"
          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition flex flex-col gap-1.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition">
            <Shield className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white">Full Armour</span>
          <span className="text-[11px] text-slate-400 leading-tight">6 Pieces & Prayers</span>
        </Link>

        <Link
          to="/study"
          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition flex flex-col gap-1.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-105 transition">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white">Bible Study</span>
          <span className="text-[11px] text-slate-400 leading-tight">10 PDF Lessons</span>
        </Link>

        <Link
          to="/journal"
          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition flex flex-col gap-1.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition">
            <PenLine className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white">Private Journal</span>
          <span className="text-[11px] text-slate-400 leading-tight">Reflections & Notes</span>
        </Link>

        <Link
          to="/tracker"
          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition flex flex-col gap-1.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-105 transition">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white">Trigger Tracker</span>
          <span className="text-[11px] text-slate-400 leading-tight">Weekly Patterns</span>
        </Link>
      </div>

      {/* DAILY BATTLE PLAN SUMMARY */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3.5 shadow-md">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-white text-sm sm:text-base font-cinzel">
            Daily Battle Rhythm (Ephesians 6:18)
          </h3>
        </div>
        <div className="space-y-2">
          {DAILY_BATTLE_PLAN_SUMMARY.slice(0, 3).map((plan, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3"
            >
              <span className="text-xs font-bold text-amber-300 w-24 flex-shrink-0">
                {plan.timeOfDay}:
              </span>
              <p className="text-xs text-slate-300 flex-1 leading-relaxed">
                {plan.action}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
