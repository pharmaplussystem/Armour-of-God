import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OfflineIndicator } from './components/OfflineIndicator';
import { OnboardingModal } from './components/OnboardingModal';
import { TemptationEmergencyModal } from './components/TemptationEmergencyModal';
import { SetbackModal } from './components/SetbackModal';
import { DevotionAlarmModal } from './components/DevotionAlarmModal';

// Views
import { HomeDashboard } from './views/HomeDashboard';
import { ArmourView } from './views/ArmourView';
import { BibleStudyView } from './views/BibleStudyView';
import { RecoveryJourneyView } from './views/RecoveryJourneyView';
import { JournalView } from './views/JournalView';
import { TrackerView } from './views/TrackerView';
import { QuizView } from './views/QuizView';
import { BoundariesGuideView } from './views/BoundariesGuideView';
import { SettingsView } from './views/SettingsView';
import { MoreView } from './views/MoreView';
import { SavedItemsView } from './views/SavedItemsView';

import { AlertTriangle, X } from 'lucide-react';

function AppShell() {
  const { storageError, dismissStorageError } = useApp();

  return (
    <div className="min-h-screen app-shell bg-[#0b132b] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200 transition-colors duration-200">
      {/* Top Sticky Header */}
      <Header />

      {/* Offline Banner Indicator */}
      <OfflineIndicator />

      {/* Storage Quota Alert Banner */}
      {storageError && (
        <div className="fixed top-16 left-4 right-4 z-50 max-w-lg mx-auto p-3.5 rounded-xl bg-red-950/95 border border-red-500 text-white shadow-2xl flex items-start justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{storageError}</p>
          </div>
          <button
            onClick={dismissStorageError}
            className="p-1 hover:text-red-300 text-slate-400"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-4 sm:pt-6">
        <Routes>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/armour" element={<ArmourView />} />
          <Route path="/study" element={<BibleStudyView />} />
          <Route path="/journey" element={<RecoveryJourneyView />} />
          <Route path="/journal" element={<JournalView />} />
          <Route path="/tracker" element={<TrackerView />} />
          <Route path="/quiz" element={<QuizView />} />
          <Route path="/boundaries" element={<BoundariesGuideView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="/more" element={<MoreView />} />
          <Route path="/saved" element={<SavedItemsView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Bottom Mobile Navigation */}
      <BottomNav />

      {/* Global Modals */}
      <OnboardingModal />
      <TemptationEmergencyModal />
      <SetbackModal />
      <DevotionAlarmModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppShell />
      </HashRouter>
    </AppProvider>
  );
}
