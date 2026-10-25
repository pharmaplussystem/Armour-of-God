import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, BellOff, BookOpen, Clock, ShieldCheck, Flame, Volume2, VolumeX, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DevotionAlarmModal: React.FC = () => {
  const {
    alarmModalOpen,
    isAlarmRinging,
    stopDevotionAlarm,
    snoozeDevotionAlarm,
    profile,
    toggleChecklistItem,
    todayChecklist
  } = useApp();
  const navigate = useNavigate();

  if (!alarmModalOpen) return null;

  const handleStartDevotion = () => {
    stopDevotionAlarm();
    // Mark morning prayer on checklist if not already checked
    if (!todayChecklist.morningPrayer) {
      toggleChecklistItem('morningPrayer');
    }
    navigate('/armour');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-slate-900 via-[#0b132b] to-slate-950 border-2 border-amber-500/50 shadow-2xl shadow-amber-500/30 overflow-hidden text-center p-6 sm:p-8 space-y-6">
        
        {/* Glowing aura rings */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Dismiss X button */}
        <button
          onClick={stopDevotionAlarm}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Dismiss Alarm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Ringing Bell */}
        <div className="relative flex justify-center pt-2">
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-1 shadow-lg shadow-amber-500/40">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-amber-400">
              <Bell className="w-10 h-10 animate-bounce text-amber-300 fill-amber-400/20" />
            </div>
          </div>
          
          {/* Sound waves pulse */}
          <span className="absolute -inset-1 rounded-full border border-amber-400/40 animate-ping opacity-75" />
        </div>

        {/* Title and Time */}
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Devotion Time • {profile.devotionalReminderTime}</span>
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-cinzel tracking-wide pt-1">
            Rise Up in Faith
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            It is time to seek the Lord, put on the Full Armour of God, and guard your heart for the day ahead.
          </p>
        </div>

        {/* Scripture Reminder */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/20 text-left space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ephesians 6:10–11</span>
            </span>
            <span className="text-[11px] text-slate-400">Morning Anchor</span>
          </div>
          <p className="text-xs italic text-slate-200 font-serif leading-relaxed">
            "Finally, be strong in the Lord and in the strength of his might. Put on the whole armour of God, that you may be able to stand against the schemes of the devil."
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleStartDevotion}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/30 hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-2 font-cinzel"
          >
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            <span>Put on the Armour of God</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => snoozeDevotionAlarm(5)}
              className="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition"
            >
              Snooze 5 Mins
            </button>
            <button
              onClick={stopDevotionAlarm}
              className="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <BellOff className="w-3.5 h-3.5" />
              <span>Stop Alarm</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
