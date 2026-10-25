import React from 'react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import { Shield, Flame, AlertCircle, HeartHandshake, Bookmark, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const { daysSinceLastSetback, setEmergencyModalOpen, savedItems, theme, toggleTheme } = useApp();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0b132b]/95 backdrop-blur-md border-b border-amber-500/20 safe-pt transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md shadow-amber-500/10 group-hover:scale-105 transition">
            <div className="w-full h-full bg-[#0b132b] rounded-[6px] flex items-center justify-center text-amber-400">
              <Shield className="w-4 h-4 fill-amber-400/20" />
            </div>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide text-white font-cinzel leading-none">
              ARMOUR OF GOD
            </h1>
            <p className="text-[10px] text-amber-400 font-medium tracking-tight">Stand Firm in Purity</p>
          </div>
        </Link>

        {/* Quick Actions & Days Badge */}
        <div className="flex items-center gap-2">
          {/* Theme Quick Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full border border-slate-800 bg-slate-900 text-amber-400 hover:text-amber-300 transition"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-amber-600" />
            )}
          </button>

          {/* Saved Items Link */}
          <Link
            to="/saved"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold transition ${
              location.pathname === '/saved'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
            title="Saved Bible Verses & Prayers"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Saved</span>
            <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full">
              {savedItems.length}
            </span>
          </Link>

          {/* Days Clean Badge */}
          <Link
            to="/journey"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-xs font-semibold text-amber-300 hover:border-amber-400 transition"
            title="Days standing firm since chosen last setback"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{daysSinceLastSetback} {daysSinceLastSetback === 1 ? 'Day' : 'Days'}</span>
          </Link>

          {/* Quick Emergency Button */}
          <button
            onClick={() => setEmergencyModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 hover:from-red-500 hover:to-red-600 active:scale-95 transition"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Tempted?</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton compact />
        </div>
      </div>
    </header>
  );
};
