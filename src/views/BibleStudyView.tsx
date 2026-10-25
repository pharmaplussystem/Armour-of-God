import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BIBLE_STUDY_LESSONS } from '../data/bibleStudyData';
import { BibleStudyLesson } from '../types';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Footprints,
  Flame,
  Search,
  FileText,
  Volume2,
  VolumeX,
  Bookmark
} from 'lucide-react';

export const BibleStudyView: React.FC = () => {
  const { completedLessons, toggleLesson, toggleSaveItem, isItemSaved } = useApp();
  const [selectedLesson, setSelectedLesson] = useState<BibleStudyLesson | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Stop speech when selecting or unselecting lesson
  const handleSelectLesson = (lesson: BibleStudyLesson | null) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setSelectedLesson(lesson);
  };

  const toggleAudio = (lesson: BibleStudyLesson) => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${lesson.title}. Anchor scripture: ${lesson.scriptureAnchor}. ${lesson.anchorText}. Summary: ${lesson.summary}. Key Biblical Insights: ${lesson.keyPoints.join('. ')}.`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const filteredLessons = BIBLE_STUDY_LESSONS.filter(
    (l) =>
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.scriptureAnchor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      {/* If a lesson is selected, show detail reader */}
      {selectedLesson ? (
        <div className="space-y-6">
          <button
            onClick={() => handleSelectLesson(null)}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All 10 Lessons</span>
          </button>

          <article className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-8 space-y-6 shadow-xl">
            {/* Header */}
            <div className="space-y-2.5 border-b border-slate-800 pb-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                  Lesson {selectedLesson.id} of 10 • {selectedLesson.pdfSection}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAudio(selectedLesson)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                      isPlayingAudio
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                    title={isPlayingAudio ? 'Stop reading' : 'Listen to lesson overview'}
                  >
                    {isPlayingAudio ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Listen</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => toggleLesson(selectedLesson.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition border ${
                      completedLessons.includes(selectedLesson.id)
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {completedLessons.includes(selectedLesson.id) ? 'Completed' : 'Mark as Studied'}
                    </span>
                  </button>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-cinzel leading-tight">
                {selectedLesson.title}
              </h2>
              <p className="text-xs text-slate-400">{selectedLesson.part}</p>

              {/* Anchor Scripture */}
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/25 space-y-1.5 mt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{selectedLesson.scriptureAnchor}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      toggleSaveItem({
                        type: 'verse',
                        title: selectedLesson.scriptureAnchor,
                        content: selectedLesson.anchorText,
                        source: `Lesson ${selectedLesson.id}: ${selectedLesson.title}`,
                        category: selectedLesson.pdfSection
                      });
                    }}
                    className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold border transition ${
                      isItemSaved(selectedLesson.scriptureAnchor) || isItemSaved(selectedLesson.anchorText)
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                    title="Save this anchor verse to library"
                  >
                    <Bookmark className={`w-3 h-3 ${isItemSaved(selectedLesson.scriptureAnchor) || isItemSaved(selectedLesson.anchorText) ? 'fill-amber-400 text-amber-400' : ''}`} />
                    <span>{isItemSaved(selectedLesson.scriptureAnchor) || isItemSaved(selectedLesson.anchorText) ? 'Saved' : 'Save Verse'}</span>
                  </button>
                </div>
                <blockquote className="text-xs sm:text-sm italic text-slate-200 leading-relaxed font-serif">
                  "{selectedLesson.anchorText}"
                </blockquote>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">Overview</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedLesson.summary}
              </p>
            </div>

            {/* Key Biblical Takeaways */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>Key Biblical Insights</span>
              </h4>
              <div className="space-y-2">
                {selectedLesson.keyPoints.map((pt, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs sm:text-sm text-slate-200 leading-relaxed flex items-start gap-2.5"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-2" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deep Theological Exposition Overview */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Foundational Biblical Exposition</span>
              </h4>
              <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedLesson.exposition.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>

            {/* In-Depth Thematic Subsections from Source PDF */}
            {selectedLesson.subsections && selectedLesson.subsections.length > 0 && (
              <div className="space-y-6 pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-1 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 font-cinzel">
                    In-Depth Scripture Analysis & Exposition
                  </h4>
                </div>

                <div className="space-y-6">
                  {selectedLesson.subsections.map((sub, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-4 shadow-inner"
                    >
                      <h5 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-cinzel">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-mono flex items-center justify-center border border-amber-500/30">
                          {sIdx + 1}
                        </span>
                        <span>{sub.heading}</span>
                      </h5>

                      <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {sub.paragraphs.map((p, pIdx) => (
                          <p key={pIdx}>{p}</p>
                        ))}
                      </div>

                      {/* Embedded Scripture Passages */}
                      {sub.scriptures && sub.scriptures.length > 0 && (
                        <div className="space-y-2.5 pt-2">
                          {sub.scriptures.map((sc, scIdx) => (
                            <div
                              key={scIdx}
                              className="p-3.5 rounded-xl bg-slate-900/90 border-l-4 border-amber-500 border-r border-t border-b border-slate-800 space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-mono font-bold text-amber-400 flex items-center gap-1.5">
                                  <Sparkles className="w-3 h-3" />
                                  <span>{sc.ref}</span>
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm italic text-slate-200 font-serif leading-relaxed">
                                "{sc.text}"
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reflection Questions */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-950 border border-indigo-500/30 space-y-3">
              <div className="flex items-center gap-2 text-indigo-300">
                <HelpCircle className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-cinzel">
                  Personal Reflection & Examination
                </h4>
              </div>
              <ul className="space-y-2.5 list-none text-xs sm:text-sm text-slate-200">
                {selectedLesson.reflectionQuestions.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                    <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5 border border-indigo-500/30">
                      {idx + 1}
                    </span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Practical Action Exercise */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wide">
                <Footprints className="w-4 h-4" />
                <span>Today's Practical Application</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
                {selectedLesson.practicalExercise}
              </p>
            </div>

            {/* Closing Prayer */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-serif italic text-xs sm:text-sm text-slate-300">
              <div className="flex items-center justify-between mb-1 not-italic">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Flame className="w-4 h-4" />
                  <span>Closing Prayer</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    toggleSaveItem({
                      type: 'prayer',
                      title: `Lesson ${selectedLesson.id} Closing Prayer`,
                      content: selectedLesson.closingPrayer,
                      source: `Bible Study: ${selectedLesson.title}`,
                      category: selectedLesson.pdfSection
                    });
                  }}
                  className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold border transition ${
                    isItemSaved(`Lesson ${selectedLesson.id} Closing Prayer`) || isItemSaved(selectedLesson.closingPrayer)
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                  title="Save this prayer to library"
                >
                  <Bookmark className={`w-3 h-3 ${isItemSaved(`Lesson ${selectedLesson.id} Closing Prayer`) || isItemSaved(selectedLesson.closingPrayer) ? 'fill-amber-400 text-amber-400' : ''}`} />
                  <span>{isItemSaved(`Lesson ${selectedLesson.id} Closing Prayer`) || isItemSaved(selectedLesson.closingPrayer) ? 'Saved' : 'Save Prayer'}</span>
                </button>
              </div>
              <p>{selectedLesson.closingPrayer}</p>
            </div>

            {/* Next / Prev Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              {selectedLesson.id > 1 ? (
                <button
                  onClick={() =>
                    handleSelectLesson(
                      BIBLE_STUDY_LESSONS.find((l) => l.id === selectedLesson.id - 1) || null
                    )
                  }
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Previous Lesson
                </button>
              ) : (
                <div />
              )}

              {selectedLesson.id < 10 ? (
                <button
                  onClick={() =>
                    handleSelectLesson(
                      BIBLE_STUDY_LESSONS.find((l) => l.id === selectedLesson.id + 1) || null
                    )
                  }
                  className="px-4 py-2 rounded-xl text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20"
                >
                  Next Lesson
                </button>
              ) : (
                <button
                  onClick={() => handleSelectLesson(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20"
                >
                  Return to Library
                </button>
              )}
            </div>
          </article>
        </div>
      ) : (
        <>
          {/* Header & Search */}
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
              <BookOpen className="w-3.5 h-3.5" />
              10-Part Curriculum from Source PDF
            </span>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-cinzel">
                Bible Study Curriculum
              </h2>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                {completedLessons.length} / 10 Completed
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Grounded directly in "Fighting the Battle of Sexual Sin with the Armour of God".
              Distinguishing biblical commands from pastoral wisdom with reverence.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search lessons (e.g. lust, neuroplasticity, shame, covenant)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Lesson Cards */}
          <div className="space-y-3">
            {filteredLessons.map((lesson) => {
              const isCompleted = completedLessons.includes(lesson.id);
              return (
                <div
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson)}
                  className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-4 group ${
                    isCompleted
                      ? 'bg-slate-900/90 border-slate-800/80 hover:border-amber-500/40'
                      : 'bg-slate-900 border-slate-800 hover:border-amber-500/50 shadow-md'
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        Lesson {lesson.id}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate">{lesson.pdfSection}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition font-cinzel">
                      {lesson.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {lesson.summary}
                    </p>

                    <div className="text-[11px] font-mono text-slate-400 pt-1">
                      Anchor: {lesson.scriptureAnchor}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {isCompleted && (
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    )}
                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Link to view uploaded PDF */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Full Source PDF: <strong>Fighting the Battle of Sexual Sin</strong></span>
            </div>
            <a
              href="./assets/aistudio/Sexaul_sin_074d3045.pdf"
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 hover:underline font-semibold"
            >
              Open PDF
            </a>
          </div>
        </>
      )}
    </div>
  );
};
