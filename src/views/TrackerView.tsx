import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Layers,
  Plus,
  Trash2,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  BarChart3,
  Calendar
} from 'lucide-react';

const EMOTIONS = ['Stress', 'Loneliness', 'Boredom', 'Anxiety', 'Fatigue (Tired)', 'Anger', 'Numbness', 'Curiosity'];
const TRIGGERS = ['Late night phone in bed', 'Alone in room / house', 'Social media feed', 'TV / movie scene', 'Unstructured time', 'Work pressure'];

export const TrackerView: React.FC = () => {
  const { habitLogs, addHabitLog, deleteHabitLog } = useApp();
  const [showLogForm, setShowLogForm] = useState(false);

  // Form state
  const [emotionalState, setEmotionalState] = useState(EMOTIONS[0]);
  const [customEmotion, setCustomEmotion] = useState('');
  const [trigger, setTrigger] = useState(TRIGGERS[0]);
  const [customTrigger, setCustomTrigger] = useState('');
  const [urgeIntensity, setUrgeIntensity] = useState<number>(7);
  const [actionTaken, setActionTaken] = useState('');
  const [resisted, setResisted] = useState<boolean>(true);
  const [reflection, setReflection] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addHabitLog({
      emotionalState: customEmotion.trim() || emotionalState,
      trigger: customTrigger.trim() || trigger,
      urgeIntensity,
      actionTaken: actionTaken.trim() || (resisted ? 'Stood firm in prayer & walked away' : 'Reflected & got back up'),
      resisted,
      reflection: reflection.trim() || undefined
    });

    setCustomEmotion('');
    setCustomTrigger('');
    setActionTaken('');
    setReflection('');
    setShowLogForm(false);
  };

  // Metrics & pattern analysis
  const totalLogs = habitLogs.length;
  const resistedCount = habitLogs.filter((l) => l.resisted).length;
  const resistanceRate = totalLogs > 0 ? Math.round((resistedCount / totalLogs) * 100) : 100;

  // Find most frequent triggers
  const triggerCounts: Record<string, number> = {};
  habitLogs.forEach((l) => {
    triggerCounts[l.trigger] = (triggerCounts[l.trigger] || 0) + 1;
  });
  const topTrigger = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      {/* Header */}
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
          <Layers className="w-3.5 h-3.5" />
          Pattern Intelligence
        </span>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-cinzel">
            Trigger & Urge Tracker
          </h2>
          <button
            onClick={() => setShowLogForm(!showLogForm)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showLogForm ? 'Close' : 'Log Urge'}</span>
          </button>
        </div>
        <p className="text-xs sm:text-sm text-slate-300">
          Understand your high-risk patterns without shame. Experiencing an urge or temptation is not a failure; it is an invitation to wield the armour.
        </p>
      </div>

      {/* Pattern Summary Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">{resistanceRate}%</div>
          <div className="text-[11px] text-slate-400">Resistance Rate</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400">{totalLogs}</div>
          <div className="text-[11px] text-slate-400">Total Tracked</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <div className="text-xs font-bold text-blue-400 truncate mt-1">
            {topTrigger ? topTrigger[0] : 'None Yet'}
          </div>
          <div className="text-[11px] text-slate-400">Top Known Trigger</div>
        </div>
      </div>

      {/* Log Urge Form */}
      {showLogForm && (
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-purple-500/40 space-y-4 shadow-xl animate-in fade-in">
          <h3 className="text-base font-bold text-white font-cinzel">Log Temptation or Urge</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Emotion */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Emotional State:</label>
              <select
                value={emotionalState}
                onChange={(e) => setEmotionalState(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
              >
                {EMOTIONS.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>

            {/* Trigger */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Trigger / Situation:</label>
              <select
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
              >
                {TRIGGERS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Intensity Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Urge Intensity (1 to 10):</span>
              <span className="text-amber-400 font-mono font-bold text-sm">{urgeIntensity}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={urgeIntensity}
              onChange={(e) => setUrgeIntensity(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-950"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Mild Fleeting Thought (1-3)</span>
              <span>Strong Craving (4-7)</span>
              <span>Intense Urge (8-10)</span>
            </div>
          </div>

          {/* Outcome Resisted Toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Outcome:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setResisted(true)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                  resisted
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Resisted Urge 👍
              </button>
              <button
                type="button"
                onClick={() => setResisted(false)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                  !resisted
                    ? 'bg-red-500/20 text-red-300 border-red-500/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Experienced Setback ⚠️
              </button>
            </div>
          </div>

          {/* Action Taken */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Action Taken / Response:</label>
            <input
              type="text"
              placeholder="e.g., Put phone away, prayed Psalm 101:3, went for a run..."
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Reflection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Reflection Note (Optional):</label>
            <input
              type="text"
              placeholder="What did this teach you about your heart?"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowLogForm(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition"
            >
              Record Log
            </button>
          </div>
        </form>
      )}

      {/* Log History */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white font-cinzel">Recent Tracked Urges</h3>
        {habitLogs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
            <Layers className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No habit logs recorded yet.</p>
            <p className="text-[11px] text-slate-500">Tap "Log Urge" above whenever you face temptation.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {habitLogs.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        entry.resisted
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-red-500/20 text-red-300 border-red-500/30'
                      }`}
                    >
                      {entry.resisted ? 'Resisted' : 'Setback'}
                    </span>
                    <span className="font-semibold text-white">{entry.trigger}</span>
                    <span className="text-amber-400 font-mono text-[11px]">({entry.urgeIntensity}/10)</span>
                  </div>

                  <div className="text-slate-400 text-[11px]">
                    State: <strong className="text-slate-200">{entry.emotionalState}</strong> • Action:{' '}
                    <span className="text-slate-300">{entry.actionTaken}</span>
                  </div>

                  {entry.reflection && (
                    <p className="text-[11px] text-slate-300 italic bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      "{entry.reflection}"
                    </p>
                  )}

                  <div className="text-[10px] text-slate-500">
                    {new Date(entry.timestamp).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                <button
                  onClick={() => deleteHabitLog(entry.id)}
                  className="text-slate-500 hover:text-red-400 p-1"
                  title="Delete log"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
