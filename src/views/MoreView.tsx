import React from 'react';
import { Link } from 'react-router-dom';
import {
  PenLine,
  Layers,
  HelpCircle,
  Lock,
  Settings,
  FileText,
  ChevronRight,
  Shield,
  BookOpen,
  Sparkles,
  Download,
  Bookmark
} from 'lucide-react';
import { PWAInstallButton } from '../components/PWAInstallButton';

export const MoreView: React.FC = () => {
  const sections = [
    {
      to: '/saved',
      title: 'Saved Verses & Prayers Library',
      desc: 'Bookmark scriptures, warrior prayers, audio read-aloud, and custom battle cries.',
      icon: Bookmark,
      color: 'text-amber-400 bg-amber-500/15 border-amber-500/30'
    },
    {
      to: '/journal',
      title: 'Spiritual War Journal',
      desc: 'Private reflections, prayers, victory notes, and meeting questions.',
      icon: PenLine,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      to: '/tracker',
      title: 'Trigger & Urge Tracker',
      desc: 'Weekly pattern analysis, emotional triggers, and resistance rates.',
      icon: Layers,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    },
    {
      to: '/quiz',
      title: 'Bible Quiz & Flashcard Memory',
      desc: 'Doctrinal warfare quizzes and spaced-repetition Scripture flashcards.',
      icon: HelpCircle,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      to: '/boundaries',
      title: 'Device Boundaries & Filter Guide',
      desc: 'Step-by-step instructions for iOS Screen Time, CleanBrowsing DNS, and SafeSearch.',
      icon: Lock,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    {
      to: '/settings',
      title: 'Settings, Reminders & Privacy',
      desc: 'Personal goals, notification alarms, local backup export, and GitHub info.',
      icon: Settings,
      color: 'text-slate-300 bg-slate-800 border-slate-700'
    }
  ];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          Application Hub
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-cinzel">
          More Resources
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Equip yourself with private journaling, pattern tracking, biblical memory drills, and boundary guides.
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <Link
              key={sec.to}
              to={sec.to}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition flex items-center justify-between gap-4 group shadow-md"
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${sec.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 min-w-0 flex-1">
                  <h3 className="font-bold text-white text-sm sm:text-base font-cinzel group-hover:text-amber-300 transition">
                    {sec.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{sec.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition flex-shrink-0" />
            </Link>
          );
        })}
      </div>

      {/* PWA Install Promotion Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-blue-950/40 border border-amber-500/30 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-sm sm:text-base font-cinzel">Install on Phone or Tablet</h3>
          </div>
          <PWAInstallButton compact />
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Install Armour of God directly to your home screen. Operates 100% offline with zero load delay,
          ensuring instant access whenever temptation strikes.
        </p>
      </div>

      {/* Source PDF Card */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Source: <strong>Fighting the Battle of Sexual Sin (PDF)</strong></span>
        </div>
        <a
          href="./assets/aistudio/Sexaul_sin_074d3045.pdf"
          target="_blank"
          rel="noreferrer"
          className="text-amber-400 hover:underline font-semibold"
        >
          View PDF
        </a>
      </div>
    </div>
  );
};
