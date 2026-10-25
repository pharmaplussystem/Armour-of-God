import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { JournalEntry } from '../types';
import {
  PenLine,
  Plus,
  Trash2,
  Download,
  Calendar,
  Sparkles,
  Users,
  Search,
  BookOpen,
  CheckCircle2,
  HeartHandshake
} from 'lucide-react';

const ACCOUNTABILITY_QUESTIONS = [
  '1. Have you viewed pornography or sexually explicit content since we last spoke?',
  '2. Have you lingered on lustful thoughts or entertained sexual fantasies in your heart?',
  '3. Did you engage in masturbation or intentional self-gratification?',
  '4. Have you taken your smartphone into bed or compromised on your agreed boundaries?',
  '5. Were you honest in all your answers, or did you hold anything back?'
];

export const JournalView: React.FC = () => {
  const { journalEntries, addJournalEntry, deleteJournalEntry, profile } = useApp();
  const [activeTab, setActiveTab] = useState<'entries' | 'new' | 'accountability'>('entries');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<JournalEntry['category']>('reflection');
  const [content, setContent] = useState('');
  const [verseRef, setVerseRef] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addJournalEntry({
      title: title.trim(),
      category,
      content: content.trim(),
      verseReference: verseRef.trim() || undefined
    });

    setTitle('');
    setContent('');
    setVerseRef('');
    setActiveTab('entries');
  };

  const exportJournalText = () => {
    const textData = journalEntries
      .map(
        (j) =>
          `----------------------------------------\nDATE: ${new Date(j.date).toLocaleString()}\nTITLE: ${j.title} [${j.category.toUpperCase()}]\n${j.verseReference ? `VERSE: ${j.verseReference}\n` : ''}\n${j.content}\n`
      )
      .join('\n');

    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `armour_of_god_journal_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredEntries = journalEntries.filter((item) => {
    const matchesCat = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      {/* Header */}
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
          <PenLine className="w-3.5 h-3.5" />
          Private & Confidential
        </span>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-cinzel">
            Spiritual War Journal
          </h2>
          <button
            onClick={exportJournalText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition"
            title="Export journal as text file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
        <p className="text-xs sm:text-sm text-slate-300">
          Record reflections, prayers, victory testimonies, and honest heart exams. Stored only in your local browser.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs sm:text-sm font-semibold gap-2 pb-1">
        <button
          onClick={() => setActiveTab('entries')}
          className={`px-4 py-2 rounded-t-xl transition ${
            activeTab === 'entries'
              ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Entries ({journalEntries.length})
        </button>
        <button
          onClick={() => setActiveTab('new')}
          className={`px-4 py-2 rounded-t-xl transition flex items-center gap-1.5 ${
            activeTab === 'new'
              ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Entry</span>
        </button>
        <button
          onClick={() => setActiveTab('accountability')}
          className={`px-4 py-2 rounded-t-xl transition flex items-center gap-1.5 ${
            activeTab === 'accountability'
              ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Accountability Meeting Plan</span>
        </button>
      </div>

      {/* TAB 1: ALL ENTRIES */}
      {activeTab === 'entries' && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'reflection', label: 'Reflections' },
                { id: 'prayer', label: 'Prayers' },
                { id: 'victory', label: 'Victories' },
                { id: 'setback', label: 'Setbacks' },
                { id: 'gratitude', label: 'Gratitude' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    filterCategory === cat.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Entries */}
          {filteredEntries.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
              <PenLine className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-400">No journal entries found in this category.</p>
              <button
                onClick={() => setActiveTab('new')}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
              >
                Create First Entry
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEntries.map((entry) => {
                const badgeColor = {
                  reflection: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                  prayer: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                  victory: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                  setback: 'bg-red-500/20 text-red-300 border-red-500/30',
                  gratitude: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                }[entry.category];

                return (
                  <div
                    key={entry.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-md"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${badgeColor}`}>
                          {entry.category}
                        </span>
                        <h3 className="font-bold text-white text-sm sm:text-base font-cinzel">
                          {entry.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500">
                          {new Date(entry.date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <button
                          onClick={() => deleteJournalEntry(entry.id)}
                          className="p-1 text-slate-500 hover:text-red-400 transition"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                      {entry.content}
                    </p>

                    {entry.verseReference && (
                      <div className="text-[11px] font-mono text-amber-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 inline-block">
                        Scripture Anchor: {entry.verseReference}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: NEW ENTRY FORM */}
      {activeTab === 'new' && (
        <form onSubmit={handleSave} className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white font-cinzel">Write a New Entry</h3>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Title:</label>
            <input
              type="text"
              placeholder="e.g., Victory Over Late-Night Urge, Gratitude for Peace..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="reflection">Reflection</option>
                <option value="prayer">Prayer</option>
                <option value="victory">Victory</option>
                <option value="setback">Setback Reflection</option>
                <option value="gratitude">Gratitude</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Scripture Ref (Optional):</label>
              <input
                type="text"
                placeholder="e.g., Psalm 119:9"
                value={verseRef}
                onChange={(e) => setVerseRef(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Notes / Content:</label>
            <textarea
              rows={6}
              placeholder="Express what God is teaching you, temptations overcome, or honest confessions..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('entries')}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs sm:text-sm hover:from-amber-400 hover:to-amber-500 shadow-md transition"
            >
              Save to Journal
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: ACCOUNTABILITY MEETING PLAN */}
      {activeTab === 'accountability' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/30 space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-white font-cinzel">
              Godly Accountability Meeting Guide
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Confession to God brings forgiveness; confession to one another brings healing (James 5:16).
              Use these direct, uncompromised questions when meeting with your partner or mentor.
            </p>
          </div>

          {/* Current Partner Info */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="text-slate-400">Accountability Partner:</span>
              <div className="font-bold text-white text-sm">
                {profile.accountabilityPartnerName || 'No partner specified yet'}
              </div>
            </div>
            <span className="text-[11px] text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              {profile.accountabilityType === 'private_self_guided'
                ? 'Private Journey'
                : 'Brotherhood Covenant'}
            </span>
          </div>

          {/* Direct Questions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              The Five Check-In Questions:
            </h4>
            {ACCOUNTABILITY_QUESTIONS.map((q, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span>{q}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <strong className="text-amber-300 block">Biblical Ground Rule:</strong>
            <p>
              "Bear one another's burdens, and so fulfill the law of Christ" (Galatians 6:2).
              Never use accountability for gossip or social judgment. The atmosphere must always be
              sacred, confidential, and saturated in the grace of Jesus Christ.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
