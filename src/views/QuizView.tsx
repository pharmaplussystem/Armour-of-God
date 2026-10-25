import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QUIZ_QUESTIONS } from '../data/quizzesData';
import { SWORD_VERSES } from '../data/swordVersesData';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Check,
  ChevronRight,
  BookOpen,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuizView: React.FC = () => {
  const { memorizedVerses, toggleMemorizedVerse } = useApp();
  const [activeTab, setActiveTab] = useState<'quiz' | 'flashcards'>('quiz');

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Flashcards State
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const activeQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const activeFlashcard = SWORD_VERSES[flashcardIndex] || SWORD_VERSES[0];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === activeQuestion.correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  const nextFlashcard = () => {
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev + 1) % SWORD_VERSES.length);
  };

  const prevFlashcard = () => {
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev - 1 + SWORD_VERSES.length) % SWORD_VERSES.length);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      {/* Header */}
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
          <HelpCircle className="w-3.5 h-3.5" />
          Biblical Wisdom & Memory Training
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-cinzel">
          Quiz & Scripture Memory
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Sharpen your spiritual sword with interactive doctrinal quizzes and Scripture flashcard memory training.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs sm:text-sm font-semibold gap-2 pb-1">
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-4 py-2 rounded-t-xl transition ${
            activeTab === 'quiz'
              ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Spiritual Warfare Quiz
        </button>
        <button
          onClick={() => setActiveTab('flashcards')}
          className={`px-4 py-2 rounded-t-xl transition flex items-center gap-1.5 ${
            activeTab === 'flashcards'
              ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Scripture Memory Flashcards</span>
        </button>
      </div>

      {/* TAB 1: QUIZ */}
      {activeTab === 'quiz' && (
        <div className="space-y-5">
          {!quizFinished ? (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-7 space-y-5 shadow-xl">
              {/* Question metadata */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                  Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}
                </span>
                <span className="text-xs text-slate-400">{activeQuestion.quizTopic}</span>
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-bold text-white font-cinzel leading-relaxed">
                {activeQuestion.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {activeQuestion.options.map((option, idx) => {
                  let styleClass =
                    'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700';

                  if (isAnswerSubmitted) {
                    if (idx === activeQuestion.correctIndex) {
                      styleClass = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 font-bold';
                    } else if (idx === selectedOption) {
                      styleClass = 'bg-red-950/50 border-red-500 text-red-200';
                    } else {
                      styleClass = 'bg-slate-950/40 border-slate-800/40 text-slate-500';
                    }
                  } else if (selectedOption === idx) {
                    styleClass = 'bg-amber-500/15 border-amber-400 text-white font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition flex items-center justify-between gap-3 ${styleClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-xs font-bold text-slate-400">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {isAnswerSubmitted && idx === activeQuestion.correctIndex && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      )}
                      {isAnswerSubmitted &&
                        idx === selectedOption &&
                        idx !== activeQuestion.correctIndex && (
                          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Reveal */}
              {isAnswerSubmitted && (
                <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                    <span>Explanation & Scriptural Insight</span>
                    <span className="font-mono text-slate-400">{activeQuestion.scriptureRef}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {activeQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                <span className="text-xs text-slate-400 font-mono">
                  Score: {quizScore} / {currentQuestionIndex + (isAnswerSubmitted ? 1 : 0)}
                </span>

                {!isAnswerSubmitted ? (
                  <button
                    disabled={selectedOption === null}
                    onClick={handleSubmitAnswer}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-400 transition disabled:opacity-50"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs sm:text-sm hover:from-amber-400 hover:to-amber-500 shadow-md transition"
                  >
                    <span>
                      {currentQuestionIndex + 1 < QUIZ_QUESTIONS.length
                        ? 'Next Question'
                        : 'View Results'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-400 text-amber-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white font-cinzel">Quiz Completed!</h3>
                <p className="text-slate-300 text-sm">
                  You scored <strong className="text-amber-400 text-lg font-mono">{quizScore}</strong> out of{' '}
                  <strong className="text-white text-lg font-mono">{QUIZ_QUESTIONS.length}</strong>.
                </p>
              </div>

              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                "Blessed is the man who walks not in the counsel of the wicked... but his delight is in the
                law of the Lord." (Psalm 1:1-2)
              </p>

              <button
                onClick={restartQuiz}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm mx-auto hover:bg-amber-400 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SCRIPTURE MEMORY FLASHCARDS */}
      {activeTab === 'flashcards' && (
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span>
              Card {flashcardIndex + 1} of {SWORD_VERSES.length} • {activeFlashcard.categoryLabel}
            </span>
            <span className="text-amber-400 font-semibold font-mono">
              {memorizedVerses.length} Memorized
            </span>
          </div>

          {/* Interactive 3D Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[260px] p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-950 border-2 border-amber-500/40 shadow-2xl flex flex-col justify-between cursor-pointer hover:border-amber-400 transition"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                {activeFlashcard.reference}
              </span>
              <span className="text-slate-400 text-[11px]">
                {isFlipped ? 'Tap to view verse' : 'Tap card to flip for context'}
              </span>
            </div>

            <div className="my-auto py-4 text-center">
              {!isFlipped ? (
                <p className="text-base sm:text-xl font-serif italic text-white leading-relaxed max-w-md mx-auto">
                  "{activeFlashcard.text}"
                </p>
              ) : (
                <div className="space-y-2 animate-in fade-in max-w-md mx-auto text-left">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Surgical Application:
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {activeFlashcard.wieldExplanation}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMemorizedVerse(activeFlashcard.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition ${
                  memorizedVerses.includes(activeFlashcard.id)
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>
                  {memorizedVerses.includes(activeFlashcard.id) ? 'Memorized!' : 'Mark as Memorized'}
                </span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(activeFlashcard.text);
                    window.speechSynthesis.speak(utterance);
                  }
                }}
                className="flex items-center gap-1 text-slate-400 hover:text-white"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Speak</span>
              </button>
            </div>
          </div>

          {/* Flashcard Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevFlashcard}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
            >
              Previous Card
            </button>
            <span className="text-xs text-slate-500 font-mono">
              {flashcardIndex + 1} / {SWORD_VERSES.length}
            </span>
            <button
              onClick={nextFlashcard}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400"
            >
              Next Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
