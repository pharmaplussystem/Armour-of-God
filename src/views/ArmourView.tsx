import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ARMOUR_PIECES, DAILY_BATTLE_PLAN_SUMMARY } from '../data/armourData';
import { SWORD_VERSES } from '../data/swordVersesData';
import { DEVOTIONAL_PRAYERS } from '../data/prayersData';
import {
  Shield,
  Zap,
  Footprints,
  Crown,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  Sparkles,
  Volume2,
  Plus,
  Trash2,
  BookOpen,
  Search,
  Check,
  ArrowRight
} from 'lucide-react';

export const ArmourView: React.FC = () => {
  const {
    customLies,
    addCustomLie,
    deleteCustomLie,
    memorizedVerses,
    toggleMemorizedVerse,
    bookmarkedVerses,
    toggleBookmarkedVerse,
    toggleSaveItem,
    isItemSaved
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pieces' | 'sword' | 'prayers' | 'plan'>('pieces');
  const [selectedPieceId, setSelectedPieceId] = useState<string>('belt');
  const [copiedPrayer, setCopiedPrayer] = useState(false);

  // Custom Lie Workbench State
  const [newLie, setNewLie] = useState('');
  const [newTruth, setNewTruth] = useState('');
  const [newScripture, setNewScripture] = useState('');

  // Sword Library Filters
  const [swordCategory, setSwordCategory] = useState<string>('all');
  const [swordSearch, setSwordSearch] = useState('');

  const selectedPiece = ARMOUR_PIECES.find((p) => p.id === selectedPieceId) || ARMOUR_PIECES[0];

  const handleAddCustomLie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLie.trim() || !newTruth.trim()) return;
    addCustomLie(newLie.trim(), newTruth.trim(), newScripture.trim() || 'Scripture of Truth');
    setNewLie('');
    setNewTruth('');
    setNewScripture('');
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrayer(true);
    setTimeout(() => setCopiedPrayer(false), 2000);
  };

  // Filter sword verses
  const filteredSwordVerses = SWORD_VERSES.filter((v) => {
    const matchesCat = swordCategory === 'all' || v.category === swordCategory;
    const matchesSearch =
      v.text.toLowerCase().includes(swordSearch.toLowerCase()) ||
      v.reference.toLowerCase().includes(swordSearch.toLowerCase()) ||
      v.categoryLabel.toLowerCase().includes(swordSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      {/* Top Header */}
      <div className="space-y-1.5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
          <Shield className="w-3.5 h-3.5" />
          Ephesians 6:10-18 Interactive Module
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-cinzel">
          The Full Armour of God
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Put on the complete supernatural battle equipment to extinguish flaming arrows and stand firm.
        </p>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-slate-800 text-xs sm:text-sm font-semibold overflow-x-auto gap-2 pb-1">
        {[
          { id: 'pieces', label: '6 Armour Pieces' },
          { id: 'sword', label: 'Sword Library' },
          { id: 'prayers', label: 'Devotional Prayers' },
          { id: 'plan', label: 'Daily Battle Rhythm' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-t-xl transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: 6 PIECES OF ARMOUR */}
      {activeTab === 'pieces' && (
        <div className="space-y-6">
          {/* Piece Selector Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
            {ARMOUR_PIECES.map((piece) => {
              const isSelected = selectedPieceId === piece.id;
              return (
                <button
                  key={piece.id}
                  onClick={() => setSelectedPieceId(piece.id)}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-white font-bold shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs tracking-tight truncate w-full">{piece.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Piece Detailed View */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-7 space-y-6 shadow-xl">
            {/* Header info */}
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                  {selectedPiece.scriptureRef}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    toggleSaveItem({
                      type: 'verse',
                      title: selectedPiece.scriptureRef,
                      content: selectedPiece.scriptureText,
                      source: selectedPiece.name,
                      category: 'Armour of God'
                    });
                  }}
                  className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold border transition ${
                    isItemSaved(selectedPiece.scriptureRef) || isItemSaved(selectedPiece.scriptureText)
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                  title="Save this scripture to your library"
                >
                  <Bookmark className={`w-3 h-3 ${isItemSaved(selectedPiece.scriptureRef) || isItemSaved(selectedPiece.scriptureText) ? 'fill-amber-400 text-amber-400' : ''}`} />
                  <span>{isItemSaved(selectedPiece.scriptureRef) || isItemSaved(selectedPiece.scriptureText) ? 'Saved' : 'Save Verse'}</span>
                </button>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-cinzel">
                {selectedPiece.name}
              </h3>
              <p className="text-xs sm:text-sm text-amber-300/90 font-medium">
                {selectedPiece.subtitle}
              </p>
              <blockquote className="text-sm font-serif italic text-slate-300 border-l-2 border-amber-400 pl-3.5 py-1">
                "{selectedPiece.scriptureText}"
              </blockquote>
            </div>

            {/* Purpose In Battle */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Purpose in Spiritual Combat</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                {selectedPiece.purposeInBattle}
              </p>
            </div>

            {/* Biblical Exposition Points */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>Biblical Principles & Applications</span>
              </h4>
              <div className="space-y-2.5">
                {selectedPiece.biblicalTeaching.map((teach, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed flex items-start gap-2.5"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-2" />
                    <span>{teach}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* INTERACTIVE WORKBENCH: BELT OF TRUTH (Lie vs Truth) */}
            {selectedPiece.id === 'belt' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-white font-cinzel">
                    Belt of Truth: Personal Lie vs Truth Workbench
                  </h4>
                </div>
                <p className="text-xs text-slate-400">
                  Write down a recurring lie the enemy whispers to you, then counter it with God's Scripture:
                </p>

                <form onSubmit={handleAddCustomLie} className="space-y-2.5">
                  <input
                    type="text"
                    placeholder="The Enemy's Lie (e.g., 'I will never be free from this lust')..."
                    value={newLie}
                    onChange={(e) => setNewLie(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="God's Biblical Truth (e.g., 'He who began a good work will complete it')..."
                    value={newTruth}
                    onChange={(e) => setNewTruth(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Scripture Reference (e.g., Philippians 1:6)..."
                      value={newScripture}
                      onChange={(e) => setNewScripture(e.target.value)}
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Save Truth</span>
                    </button>
                  </div>
                </form>

                {/* Saved Custom Lies */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-slate-400 block">Your Fastened Truths:</label>
                  {customLies.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="text-red-300 font-medium">
                          <span className="text-[10px] bg-red-950 px-1.5 py-0.5 rounded border border-red-800 mr-1.5 font-mono">
                            LIE
                          </span>
                          "{item.lie}"
                        </div>
                        <div className="text-emerald-300 font-semibold">
                          <span className="text-[10px] bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800 mr-1.5 font-mono">
                            TRUTH
                          </span>
                          "{item.truth}"
                        </div>
                        <div className="text-[11px] text-amber-400 font-mono">{item.scripture}</div>
                      </div>
                      <button
                        onClick={() => deleteCustomLie(item.id)}
                        className="text-slate-500 hover:text-red-400 p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Practical Exercise Box */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {selectedPiece.practicalExercise.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                {selectedPiece.practicalExercise.description}
              </p>
            </div>

            {/* Full Prayer for this piece */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4" />
                  <span>{selectedPiece.prayerTitle}</span>
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      toggleSaveItem({
                        type: 'prayer',
                        title: selectedPiece.prayerTitle,
                        content: selectedPiece.fullPrayer,
                        source: selectedPiece.name,
                        category: 'Armour of God Prayer'
                      });
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                      isItemSaved(selectedPiece.prayerTitle) || isItemSaved(selectedPiece.fullPrayer)
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                    title="Save this prayer to your library"
                  >
                    <Bookmark className={`w-3 h-3 ${isItemSaved(selectedPiece.prayerTitle) || isItemSaved(selectedPiece.fullPrayer) ? 'fill-amber-400 text-amber-400' : ''}`} />
                    <span>{isItemSaved(selectedPiece.prayerTitle) || isItemSaved(selectedPiece.fullPrayer) ? 'Saved' : 'Save Prayer'}</span>
                  </button>
                  <button
                    onClick={() => copyText(selectedPiece.fullPrayer)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-medium transition"
                  >
                    {copiedPrayer ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-amber-500/20 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-serif italic">
                {selectedPiece.fullPrayer}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SWORD OF THE SPIRIT SCRIPTURE ARSENAL */}
      {activeTab === 'sword' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/30 space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-white font-cinzel">
              The Rhema Sword Arsenal (Ephesians 6:17b)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              In combat, do not swing a vague general feeling. Wield the surgical Word of God! Filter by
              the attack you are currently facing, speak the verse aloud, and mark it memorized.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search sword verses (e.g., escape, eyes, satisfy, temple)..."
                value={swordSearch}
                onChange={(e) => setSwordSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'All Verses' },
                { id: 'urge_to_look', label: 'Urge to Look/Click' },
                { id: 'lie_must_give_in', label: 'Must Give In Lie' },
                { id: 'lie_will_satisfy', label: 'Will Satisfy Lie' },
                { id: 'lie_of_secrecy', label: 'Secrecy Lie' },
                { id: 'body_is_not_yours', label: 'Body as Temple' },
                { id: 'shame_after_fall', label: 'Shame After Fall' },
                { id: 'despair_never_change', label: 'Despair & Victory' },
                { id: 'renewing_mind', label: 'Renewing Mind' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSwordCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    swordCategory === cat.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Verses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredSwordVerses.map((verse) => {
              const isMemorized = memorizedVerses.includes(verse.id);
              const isBookmarked = bookmarkedVerses.includes(verse.id);

              return (
                <div
                  key={verse.id}
                  className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3 flex flex-col justify-between hover:border-amber-500/40 transition"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {verse.reference}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            toggleBookmarkedVerse(verse.id);
                            toggleSaveItem({
                              type: 'verse',
                              title: verse.reference,
                              content: verse.text,
                              source: 'Sword of the Spirit',
                              category: verse.categoryLabel
                            });
                          }}
                          className={`p-1.5 rounded-lg border transition ${
                            isBookmarked || isItemSaved(verse.reference)
                              ? 'bg-amber-500/20 border-amber-400 text-amber-400'
                              : 'border-slate-800 text-slate-500 hover:text-slate-300'
                          }`}
                          title={isBookmarked || isItemSaved(verse.reference) ? 'Saved in Library' : 'Save verse to library'}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked || isItemSaved(verse.reference) ? 'fill-amber-400' : ''}`} />
                        </button>
                        <button
                          onClick={() => toggleMemorizedVerse(verse.id)}
                          className={`p-1.5 rounded-lg border transition text-xs font-semibold flex items-center gap-1 ${
                            isMemorized
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                              : 'border-slate-800 text-slate-500 hover:text-slate-300'
                          }`}
                          title={isMemorized ? 'Memorized!' : 'Mark as memorized'}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span className="text-[10px]">{isMemorized ? 'Memorized' : 'Learn'}</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-sm font-serif italic text-white leading-relaxed">
                      "{verse.text}"
                    </p>

                    <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
                      <strong className="text-amber-300">Wielding Instruction: </strong>
                      {verse.wieldExplanation}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if ('speechSynthesis' in window) {
                        const utterance = new SpeechSynthesisUtterance(verse.text);
                        window.speechSynthesis.speak(utterance);
                      }
                    }}
                    className="self-start flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-medium"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen Aloud</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DEVOTIONAL PRAYERS */}
      {activeTab === 'prayers' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-blue-950/40 border border-amber-500/30 space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-white font-cinzel">
              Devotional Prayer Sanctuary (Ephesians 6:18)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Praying at all times in the Spirit. Original devotional prayers inspired by the source themes.
            </p>
          </div>

          <div className="space-y-4">
            {DEVOTIONAL_PRAYERS.map((prayer) => (
              <div
                key={prayer.id}
                className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-white text-base font-cinzel">{prayer.title}</h4>
                    <p className="text-xs text-amber-300 font-medium">{prayer.subtitle}</p>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                    {prayer.scriptureAnchor}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs sm:text-sm text-slate-200 leading-relaxed font-serif italic whitespace-pre-line">
                  {prayer.body}
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      toggleSaveItem({
                        type: 'prayer',
                        title: prayer.title,
                        content: prayer.body,
                        source: prayer.scriptureAnchor,
                        category: prayer.subtitle
                      });
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      isItemSaved(prayer.title) || isItemSaved(prayer.body)
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isItemSaved(prayer.title) || isItemSaved(prayer.body) ? 'fill-amber-400 text-amber-400' : ''}`} />
                    <span>{isItemSaved(prayer.title) || isItemSaved(prayer.body) ? 'Saved' : 'Save Prayer'}</span>
                  </button>

                  <button
                    onClick={() => copyText(prayer.body)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700"
                  >
                    Copy Prayer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DAILY BATTLE RHYTHM */}
      {activeTab === 'plan' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-white font-cinzel">
              Your Daily Battle Plan (Ephesians 6:18)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Spiritual warfare is not fought once a month; it is a continuous posture of vigilance.
              Here is your operational blueprint from morning to night.
            </p>
          </div>

          <div className="space-y-3">
            {DAILY_BATTLE_PLAN_SUMMARY.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    {item.timeOfDay}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{item.action}</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-950 border border-amber-500/30 text-amber-300 whitespace-nowrap self-start sm:self-center">
                  {item.armorPiece}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
