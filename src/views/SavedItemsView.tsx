import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SavedItem } from '../types';
import {
  Bookmark,
  BookOpen,
  Flame,
  Plus,
  Search,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Trash2,
  Edit3,
  Sparkles,
  Heart,
  Share2,
  X
} from 'lucide-react';

export const SavedItemsView: React.FC = () => {
  const { savedItems, saveItem, removeSavedItem, updateSavedItemNotes } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'verse' | 'prayer'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Note editing state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');

  // Form State for Add New
  const [formType, setFormType] = useState<'verse' | 'prayer'>('verse');
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formSource, setFormSource] = useState('Personal Collection');
  const [formNotes, setFormNotes] = useState('');

  const filteredItems = savedItems.filter((item) => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      item.title.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query) ||
      (item.category && item.category.toLowerCase().includes(query)) ||
      (item.notes && item.notes.toLowerCase().includes(query));
    return matchesTab && matchesQuery;
  });

  const verseCount = savedItems.filter((i) => i.type === 'verse').length;
  const prayerCount = savedItems.filter((i) => i.type === 'prayer').length;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleAudio = (item: SavedItem) => {
    if (!('speechSynthesis' in window)) return;

    if (playingAudioId === item.id) {
      window.speechSynthesis.cancel();
      setPlayingAudioId(null);
    } else {
      window.speechSynthesis.cancel();
      const text = `${item.title}. ${item.content}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setPlayingAudioId(null);
      utterance.onerror = () => setPlayingAudioId(null);
      window.speechSynthesis.speak(utterance);
      setPlayingAudioId(item.id);
    }
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    saveItem({
      type: formType,
      title: formTitle.trim(),
      content: formContent.trim(),
      category: formCategory.trim() || (formType === 'verse' ? 'Scripture' : 'Prayer'),
      source: formSource.trim() || 'Personal',
      notes: formNotes.trim() || undefined
    });

    // Reset and close
    setFormTitle('');
    setFormContent('');
    setFormCategory('');
    setFormNotes('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <Bookmark className="w-3.5 h-3.5" />
            Spiritual Arsenal & Sanctuary
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-cinzel">
            Saved Verses & Prayers
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Treasured Scriptures and warrior prayers to strengthen your soul in every hour of battle.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition shadow-lg shadow-amber-500/20 self-start sm:self-auto font-cinzel"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Save Verse / Prayer</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({savedItems.length})
          </button>
          <button
            onClick={() => setActiveTab('verse')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'verse'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Verses ({verseCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('prayer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'prayer'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Prayers ({prayerCount})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved words..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="p-10 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-amber-400 flex items-center justify-center mx-auto border border-slate-700">
            <Bookmark className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-bold text-white text-base font-cinzel">No Saved Items Found</h3>
            <p className="text-xs text-slate-400">
              {searchQuery
                ? 'No verses or prayers match your search keywords.'
                : 'Save verses and prayers throughout the app by tapping the bookmark icon, or add your own custom entry.'}
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Verse or Prayer</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800/90 hover:border-amber-500/30 transition space-y-4 shadow-lg group relative"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                      item.type === 'verse'
                        ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {item.type === 'verse' ? (
                      <>
                        <BookOpen className="w-3 h-3" />
                        <span>Bible Verse</span>
                      </>
                    ) : (
                      <>
                        <Flame className="w-3 h-3" />
                        <span>Prayer</span>
                      </>
                    )}
                  </span>

                  {item.category && (
                    <span className="text-[11px] text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {item.category}
                    </span>
                  )}
                </div>

                {/* Top Action Bar */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleAudio(item)}
                    className={`p-1.5 rounded-lg border text-xs transition ${
                      playingAudioId === item.id
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white border-transparent hover:border-slate-800'
                    }`}
                    title={playingAudioId === item.id ? 'Stop listening' : 'Listen aloud'}
                  >
                    {playingAudioId === item.id ? (
                      <VolumeX className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => handleCopy(item.id, `${item.title}\n\n"${item.content}"`)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white border border-transparent hover:border-slate-800 transition"
                    title="Copy to clipboard"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Remove "${item.title}" from your saved library?`)) {
                        removeSavedItem(item.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 border border-transparent hover:border-red-950 transition"
                    title="Delete saved item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title & Source */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white font-cinzel">
                  {item.title}
                </h3>
                {item.source && (
                  <p className="text-[11px] text-slate-400 pt-0.5">Source: {item.source}</p>
                )}
              </div>

              {/* Content / Scripture / Prayer */}
              <div className="p-4 rounded-xl bg-slate-950/70 border-l-4 border-amber-500 border-r border-t border-b border-slate-800/80">
                <blockquote className="text-xs sm:text-sm text-slate-200 font-serif italic leading-relaxed whitespace-pre-line">
                  "{item.content}"
                </blockquote>
              </div>

              {/* Personal Notes Section */}
              <div className="pt-1">
                {editingNoteId === item.id ? (
                  <div className="space-y-2 p-3 rounded-xl bg-slate-950 border border-amber-500/30">
                    <label className="text-[11px] font-semibold text-amber-300">
                      Personal Reflection / Note:
                    </label>
                    <textarea
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      placeholder="Write how this verse or prayer ministers to your heart..."
                      rows={2}
                      className="w-full p-2 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="px-2.5 py-1 rounded text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          updateSavedItemNotes(item.id, noteDraft.trim());
                          setEditingNoteId(null);
                        }}
                        className="px-3 py-1 rounded bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                ) : item.notes ? (
                  <div
                    onClick={() => {
                      setEditingNoteId(item.id);
                      setNoteDraft(item.notes || '');
                    }}
                    className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-300 flex items-start justify-between gap-3 cursor-pointer hover:border-slate-700"
                  >
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        My Reflection:
                      </span>
                      <p className="italic text-slate-300">{item.notes}</p>
                    </div>
                    <Edit3 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingNoteId(item.id);
                      setNoteDraft('');
                    }}
                    className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-amber-300 transition"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Add personal reflection note</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Custom Verse or Prayer */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-amber-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base font-cinzel">
                  Save a Verse or Prayer
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNew} className="space-y-3.5">
              {/* Type selector */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Category Type:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormType('verse')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition ${
                      formType === 'verse'
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Holy Scripture</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType('prayer')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition ${
                      formType === 'prayer'
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Flame className="w-4 h-4" />
                    <span>Heartfelt Prayer</span>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  {formType === 'verse' ? 'Scripture Citation (e.g. Psalm 119:9–11):' : 'Prayer Title (e.g. Prayer for Eyes & Purity):'}
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder={formType === 'verse' ? 'e.g. 2 Timothy 2:22' : 'e.g. Morning Prayer for Deliverance'}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Content */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  {formType === 'verse' ? 'Scripture Text:' : 'Prayer Text:'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder={
                    formType === 'verse'
                      ? 'Enter the full Bible verse text here...'
                      : 'Write your warrior prayer or personal prayer to Christ...'
                  }
                  className="w-full p-3 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Category & Source */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Theme / Battle Focus:</label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="e.g. Overcoming Urges, Peace, Purity"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Source / Origin:</label>
                  <input
                    type="text"
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value)}
                    placeholder="e.g. Morning Devotion, Pastoral Sermon"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Personal Notes */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Personal Note (Optional):</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="How does this apply to your spiritual battle today?"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition font-cinzel"
                >
                  Save to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
