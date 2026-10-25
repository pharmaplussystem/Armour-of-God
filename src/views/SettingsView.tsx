import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RecoveryGoal, AccountabilityType } from '../types';
import { PWAInstallButton } from '../components/PWAInstallButton';
import {
  Settings,
  User,
  Bell,
  BellRing,
  Lock,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  FileText,
  Github,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Shield,
  Volume2,
  Sun,
  Moon,
  Palette,
  KeyRound,
  AlertTriangle,
  ShieldCheck,
  X
} from 'lucide-react';
import { playSampleChime } from '../utils/alarmAudio';

export const SettingsView: React.FC = () => {
  const {
    profile,
    updateProfile,
    exportAllData,
    exportEncryptedBackup,
    importAnyBackup,
    eraseAllData,
    daysSinceLastSetback,
    resetSobrietyDate,
    triggerDevotionAlarm,
    theme,
    setTheme
  } = useApp();

  const [displayName, setDisplayName] = useState(profile.displayName || '');
  const [primaryGoals, setPrimaryGoals] = useState<RecoveryGoal[]>(
    profile.primaryGoals && profile.primaryGoals.length > 0
      ? profile.primaryGoals
      : (profile.mainGoal ? [profile.mainGoal] : ['stop_pornography', 'pursue_sexual_purity'])
  );
  const [devotionalTime, setDevotionalTime] = useState(profile.devotionalReminderTime);
  const [eveningTime, setEveningTime] = useState(profile.eveningReminderTime || '21:30');
  const [alarmEnabled, setAlarmEnabled] = useState(profile.devotionalAlarmEnabled ?? true);
  const [alarmSound, setAlarmSound] = useState<'cathedral_bell' | 'gentle_chime' | 'harp_arpeggio'>(
    profile.alarmSound || 'cathedral_bell'
  );
  const [partnerName, setPartnerName] = useState(profile.accountabilityPartnerName || '');
  const [partnerContact, setPartnerContact] = useState(profile.accountabilityPartnerContact || '');
  const [accountabilityType, setAccountabilityType] = useState<AccountabilityType>(
    profile.accountabilityType
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    profile.reminderNotificationsEnabled
  );
  const [statusMessage, setStatusMessage] = useState('');
  const [showEraseConfirm, setShowEraseConfirm] = useState(false);

  const toggleGoal = (goalId: RecoveryGoal) => {
    setPrimaryGoals((prev) => {
      if (prev.includes(goalId)) {
        if (prev.length <= 1) return prev; // Keep at least one
        return prev.filter((g) => g !== goalId);
      }
      return [...prev, goalId];
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName: displayName.trim(),
      primaryGoals,
      mainGoal: primaryGoals[0] || 'stop_pornography',
      devotionalReminderTime: devotionalTime,
      eveningReminderTime: eveningTime,
      devotionalAlarmEnabled: alarmEnabled,
      alarmSound,
      accountabilityPartnerName: partnerName.trim(),
      accountabilityPartnerContact: partnerContact.trim(),
      accountabilityType,
      reminderNotificationsEnabled: notificationsEnabled
    });

    setStatusMessage('Profile and Devotion Alarm preferences saved successfully!');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleNotificationToggle = async () => {
    if (!('Notification' in window)) {
      alert('Browser notifications are not supported on this browser.');
      return;
    }

    if (Notification.permission === 'granted') {
      const next = !notificationsEnabled;
      setNotificationsEnabled(next);
      updateProfile({ reminderNotificationsEnabled: next });
    } else {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        updateProfile({ reminderNotificationsEnabled: true });
        new Notification('Armour of God', {
          body: 'Reminders enabled. Put on the full armour of God daily!',
          icon: '/favicon.png'
        });
      } else {
        setNotificationsEnabled(false);
        updateProfile({ reminderNotificationsEnabled: false });
      }
    }
  };

  const [showEncryptModal, setShowEncryptModal] = useState(false);
  const [encryptPassword, setEncryptPassword] = useState('');
  const [showDecryptModal, setShowDecryptModal] = useState(false);
  const [pendingFileContent, setPendingFileContent] = useState('');
  const [decryptPassword, setDecryptPassword] = useState('');
  const [decryptError, setDecryptError] = useState('');
  const [isProcessingCrypt, setIsProcessingCrypt] = useState(false);

  const handleDownloadPlain = () => {
    const jsonStr = exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `armour_of_god_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage('Plain JSON backup downloaded successfully.');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleDownloadEncrypted = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!encryptPassword || encryptPassword.length < 4) {
      alert('Please enter a password with at least 4 characters to protect your private recovery file.');
      return;
    }
    setIsProcessingCrypt(true);
    try {
      const encryptedStr = await exportEncryptedBackup(encryptPassword);
      const blob = new Blob([encryptedStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `armour_of_god_encrypted_${new Date().toISOString().split('T')[0]}.aog`;
      link.click();
      URL.revokeObjectURL(url);
      setShowEncryptModal(false);
      setEncryptPassword('');
      setStatusMessage('Password-encrypted backup downloaded successfully!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch {
      alert('Encryption failed. Web Crypto API may be unavailable.');
    } finally {
      setIsProcessingCrypt(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (!content) return;
      const res = await importAnyBackup(content);
      if (res.success) {
        setStatusMessage('Local data successfully restored from backup!');
        setTimeout(() => setStatusMessage(''), 3000);
      } else if (res.requiresPassword) {
        setPendingFileContent(content);
        setDecryptPassword('');
        setDecryptError('');
        setShowDecryptModal(true);
      } else {
        alert(res.error || 'Failed to parse backup file. Please ensure it is a valid Armour of God export.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDecryptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decryptPassword) return;
    setIsProcessingCrypt(true);
    setDecryptError('');
    try {
      const res = await importAnyBackup(pendingFileContent, decryptPassword);
      if (res.success) {
        setShowDecryptModal(false);
        setPendingFileContent('');
        setDecryptPassword('');
        setDecryptError('');
        setStatusMessage('Encrypted backup successfully unlocked and restored!');
        setTimeout(() => setStatusMessage(''), 3000);
      } else {
        setDecryptError(res.error || 'Incorrect password.');
      }
    } finally {
      setIsProcessingCrypt(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      {/* Header */}
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
          <Settings className="w-3.5 h-3.5" />
          Settings & Local Data
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-cinzel">
          Preferences & Security
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Customize personal goals, configure local reminders, export backups, or view GitHub Pages deployment settings.
        </p>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-xs sm:text-sm text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Theme & Appearance (Dark / Light) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base font-cinzel">
              Theme & Appearance
            </h3>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full border bg-amber-500/10 text-amber-300 border-amber-500/20">
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Choose your visual sanctuary. All scriptures, battle prayers, and spiritual modules dynamically adjust.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {/* Dark Theme Option */}
          <button
            type="button"
            onClick={() => {
              setTheme('dark');
              setStatusMessage('Active theme set to Dark Theme (Midnight Armour)');
              setTimeout(() => setStatusMessage(''), 3000);
            }}
            className={`p-4 rounded-2xl border text-left transition flex items-start gap-3.5 ${
              theme === 'dark'
                ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg ring-1 ring-amber-400/50'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border transition ${
                theme === 'dark'
                  ? 'bg-slate-900 border-amber-400 text-amber-300 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <Moon className="w-5 h-5 text-amber-400" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white font-cinzel">Dark Theme</span>
                {theme === 'dark' && (
                  <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Midnight Armour — Deep midnight navy with warm golden highlights. Ideal for evening battle vigilance and reducing eye strain.
              </p>
            </div>
          </button>

          {/* Light Theme Option */}
          <button
            type="button"
            onClick={() => {
              setTheme('light');
              setStatusMessage('Active theme set to Light Theme (Alabaster Purity)');
              setTimeout(() => setStatusMessage(''), 3000);
            }}
            className={`p-4 rounded-2xl border text-left transition flex items-start gap-3.5 ${
              theme === 'light'
                ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg ring-1 ring-amber-400/50'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border transition ${
                theme === 'light'
                  ? 'bg-amber-50 border-amber-400 text-amber-600 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <Sun className="w-5 h-5 text-amber-500" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white font-cinzel">Light Theme</span>
                {theme === 'light' && (
                  <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Alabaster Purity — Clean, daylight ivory surfaces with regal bronze accents. Ideal for morning devotions, outdoor reading, and study.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Profile & Goals Form */}
      <form onSubmit={handleSaveProfile} className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <User className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-white text-base font-cinzel">Personal Profile & Goals</h3>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Display Name / Nickname:</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g., David, Soldier, Pilgrim"
            className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              Primary Recovery Goals (Choose all that apply):
            </label>
            <span className="text-[11px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
              {primaryGoals.length} Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'stop_pornography' as const, label: 'Stop Pornography', sub: 'Guard the eyes & mind' },
              { id: 'stop_masturbation' as const, label: 'Stop Masturbation', sub: 'Master body in holiness' },
              { id: 'overcome_lustful_habits' as const, label: 'Overcome Lustful Habits', sub: 'Take thoughts captive' },
              { id: 'reduce_compulsive_behavior' as const, label: 'Reduce Compulsive Urges', sub: 'Break automatic escapes' },
              { id: 'pursue_sexual_purity' as const, label: 'Pursue Overall Purity', sub: 'Honor God\'s covenant design' }
            ].map((g) => {
              const isSelected = primaryGoals.includes(g.id);
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => toggleGoal(g.id)}
                  className={`p-3 rounded-xl border text-left transition flex items-center justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 text-white font-medium shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold">{g.label}</div>
                    <div className="text-[10px] text-slate-400">{g.sub}</div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition ${
                      isSelected ? 'bg-amber-500 border-amber-400 text-slate-950' : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Morning Devotional Time:</label>
            <input
              type="time"
              value={devotionalTime}
              onChange={(e) => setDevotionalTime(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Evening Review Time:</label>
            <input
              type="time"
              value={eveningTime}
              onChange={(e) => setEveningTime(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Accountability Partner */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <label className="text-xs font-semibold text-slate-300">Accountability Partner:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="text"
              placeholder="Partner Name / Role..."
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <input
              type="text"
              placeholder="Partner Phone / Email (Optional)..."
              value={partnerContact}
              onChange={(e) => setPartnerContact(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-400 transition"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Reminders & Devotion Alarm Settings */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base font-cinzel">
              Devotion Time Alarm & Audio Chimes
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              const next = !alarmEnabled;
              setAlarmEnabled(next);
              updateProfile({ devotionalAlarmEnabled: next });
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
              alarmEnabled
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {alarmEnabled ? 'Alarm ON' : 'Alarm OFF'}
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The Devotion Time Alarm rings an audible spiritual chime (synthesized client-side) at your scheduled devotion time to awaken you to prayer and the Full Armour of God.
        </p>

        {/* Alarm Time & Sound Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Devotion Alarm Time:</span>
              <span className="text-[11px] font-mono text-amber-400">{devotionalTime}</span>
            </label>
            <input
              type="time"
              value={devotionalTime}
              onChange={(e) => {
                setDevotionalTime(e.target.value);
                updateProfile({ devotionalReminderTime: e.target.value });
              }}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Alarm Ring Tone:
            </label>
            <select
              value={alarmSound}
              onChange={(e) => {
                const val = e.target.value as 'cathedral_bell' | 'gentle_chime' | 'harp_arpeggio';
                setAlarmSound(val);
                updateProfile({ alarmSound: val });
                playSampleChime(val);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="cathedral_bell">Cathedral Bell Chime (Majestic Harmonics)</option>
              <option value="gentle_chime">Gentle Temple Chime (Soft Silver Bells)</option>
              <option value="harp_arpeggio">Peaceful Harp Arpeggio (Celestial Strings)</option>
            </select>
          </div>
        </div>

        {/* Audio Test Action Bar */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-white block">Test Your Alarm Sound</span>
            <span className="text-[11px] text-slate-400">Hear how your selected chime will sound when it rings.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => playSampleChime(alarmSound)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white hover:border-amber-500/50 transition"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Play Sample</span>
            </button>

            <button
              type="button"
              onClick={() => triggerDevotionAlarm()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Test Full Alarm Ringing</span>
            </button>
          </div>
        </div>

        {/* Browser Notifications Option */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-white block">System Banner Notifications</span>
            <span className="text-[11px] text-slate-400">Receive popup notification banners when the app is in the background.</span>
          </div>
          <button
            type="button"
            onClick={handleNotificationToggle}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex-shrink-0 ${
              notificationsEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {notificationsEnabled ? 'Banners Enabled' : 'Enable Banners'}
          </button>
        </div>
      </div>

      {/* Counter Adjustment */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-bold text-white text-sm sm:text-base font-cinzel">
              Current Freedom Streak Counter
            </h3>
            <p className="text-xs text-slate-400">
              Currently: <strong className="text-amber-400 font-mono">{daysSinceLastSetback} Days</strong> standing firm.
            </p>
          </div>
          <button
            onClick={() => {
              if (confirm('Would you like to reset your freedom start counter to today?')) {
                resetSobrietyDate();
                setStatusMessage('Counter reset to today.');
                setTimeout(() => setStatusMessage(''), 3000);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Counter</span>
          </button>
        </div>
      </div>

      {/* Data Backup & Privacy Section */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Lock className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-white text-base font-cinzel">Data Sovereignty & Local Privacy</h3>
        </div>

        <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
          <p>
            <strong className="text-white">100% Local Storage:</strong> All user records, personal journals, habit trigger logs, daily checklists, milestone streaks, and saved scriptures are stored exclusively on your device using local storage and offline IndexedDB.
          </p>
          <p>
            <strong className="text-emerald-400">Zero Cloud Transmission:</strong> No login or server account is required. No recovery records or private thoughts are ever sent to an external server or third-party analytics.
          </p>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Important Device Storage Advisory:</span>
            </div>
            <p className="text-[11px] text-amber-200/90 leading-normal">
              Local browser storage can be cleared if you wipe site cookies/storage in browser settings, clear application data, uninstall the PWA, or lose your device. We recommend downloading regular backups to safeguard your spiritual journey.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <button
            onClick={handleDownloadPlain}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-semibold hover:border-slate-700 hover:text-white transition"
            title="Download unencrypted plain JSON file"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export Plain (JSON)</span>
          </button>

          <button
            onClick={() => setShowEncryptModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/25 transition"
            title="Download password-protected AES-256-GCM encrypted backup"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Export Encrypted (.aog)</span>
          </button>

          <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-semibold hover:border-slate-700 hover:text-white cursor-pointer transition">
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span>Restore Backup</span>
            <input type="file" accept=".json,.aog" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Modal for Encrypted Export */}
        {showEncryptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-sm rounded-2xl bg-slate-900 border border-amber-500/40 p-5 space-y-4 shadow-2xl text-left">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2 text-amber-400">
                  <KeyRound className="w-4 h-4" />
                  <h4 className="font-bold text-white text-sm font-cinzel">Password-Protected Backup</h4>
                </div>
                <button
                  onClick={() => setShowEncryptModal(false)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Your recovery data will be encrypted client-side using <strong>AES-256-GCM</strong> (PBKDF2 100,000 rounds). Only someone with this password can decrypt it.
              </p>

              <form onSubmit={handleDownloadEncrypted} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Set Backup Password:</label>
                  <input
                    type="password"
                    required
                    minLength={4}
                    value={encryptPassword}
                    onChange={(e) => setEncryptPassword(e.target.value)}
                    placeholder="Enter at least 4 characters..."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowEncryptModal(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingCrypt}
                    className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 disabled:opacity-50"
                  >
                    {isProcessingCrypt ? 'Encrypting...' : 'Download Encrypted File'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for Decrypting Encrypted Backup on Restore */}
        {showDecryptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-sm rounded-2xl bg-slate-900 border border-amber-500/40 p-5 space-y-4 shadow-2xl text-left">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2 text-amber-400">
                  <Lock className="w-4 h-4" />
                  <h4 className="font-bold text-white text-sm font-cinzel">Encrypted Backup Detected</h4>
                </div>
                <button
                  onClick={() => setShowDecryptModal(false)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                This backup is protected with AES-256-GCM encryption. Please enter the password used to create it:
              </p>

              {decryptError && (
                <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-[11px] text-red-200">
                  {decryptError}
                </div>
              )}

              <form onSubmit={handleDecryptSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Decryption Password:</label>
                  <input
                    type="password"
                    required
                    value={decryptPassword}
                    onChange={(e) => setDecryptPassword(e.target.value)}
                    placeholder="Enter backup password..."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowDecryptModal(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingCrypt}
                    className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 disabled:opacity-50"
                  >
                    {isProcessingCrypt ? 'Decrypting...' : 'Unlock & Restore'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Erase All Data */}
        <div className="pt-3 border-t border-slate-800/80">
          {!showEraseConfirm ? (
            <button
              onClick={() => setShowEraseConfirm(true)}
              className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Erase All Local App Data</span>
            </button>
          ) : (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 space-y-2 text-xs">
              <p className="text-red-200 font-medium">
                Are you sure you want to permanently erase all locally saved journals, checklist progress, and habit logs?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    eraseAllData();
                    setShowEraseConfirm(false);
                    setStatusMessage('All local data has been permanently cleared.');
                    setTimeout(() => setStatusMessage(''), 3000);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white font-bold"
                >
                  Yes, Erase Everything
                </button>
                <button
                  onClick={() => setShowEraseConfirm(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Source Document & Credits */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-500/30 space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-white text-sm sm:text-base font-cinzel">
            Primary Biblical Source Document
          </h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          This application's curriculum, theological principles, and battle prayers are drawn directly from the uploaded source:
          <strong> "Fighting the Battle of Sexual Sin with the Armour of God"</strong>.
        </p>
        <a
          href="./assets/aistudio/Sexaul_sin_074d3045.pdf"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20"
        >
          <span>View Source PDF</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* GitHub Pages Deployment Info */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Github className="w-4 h-4 text-slate-300" />
          <h3 className="font-bold text-white text-sm sm:text-base font-cinzel">
            GitHub & GitHub Pages Deployment Ready
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          This codebase is 100% complete and self-contained with no backend requirements.
          It includes GitHub Actions in <code>.github/workflows/deploy.yml</code> for automated deployment to GitHub Pages.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <a
            href="./armour-of-god.zip"
            download="armour-of-god.zip"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-amber-500 shadow-md transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Project ZIP (Complete Source)</span>
          </a>
        </div>
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-amber-300 space-y-1">
          <div>git init && git add .</div>
          <div>git commit -m "Initial commit"</div>
          <div>git push origin main</div>
        </div>
      </div>
    </div>
  );
};
