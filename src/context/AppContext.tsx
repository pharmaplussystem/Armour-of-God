import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  UserProfile,
  DailyChecklist,
  HabitLogEntry,
  JournalEntry,
  CustomLieCounter,
  SavedItem
} from '../types';
import { startAlarmSound, stopAlarmSound } from '../utils/alarmAudio';
import {
  safeLocalSet,
  readFromIndexedDB,
  encryptBackup,
  decryptBackup,
  EncryptedBackupPackage
} from '../utils/localPersistence';

interface AppContextType {
  profile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;
  todayChecklist: DailyChecklist;
  toggleChecklistItem: (key: keyof Omit<DailyChecklist, 'date'>) => void;
  daysSinceLastSetback: number;
  totalDaysActive: number;
  recordSetback: (trigger: string, actionPlan: string, notes?: string) => void;
  resetSobrietyDate: (newDateIso?: string) => void;
  habitLogs: HabitLogEntry[];
  addHabitLog: (entry: Omit<HabitLogEntry, 'id' | 'timestamp'>) => void;
  deleteHabitLog: (id: string) => void;
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
  updateJournalEntry: (entry: JournalEntry) => void;
  deleteJournalEntry: (id: string) => void;
  customLies: CustomLieCounter[];
  addCustomLie: (lie: string, truth: string, scripture: string) => void;
  deleteCustomLie: (id: string) => void;
  completedPlanDays: number[];
  togglePlanDay: (dayNumber: number) => void;
  completedLessons: number[];
  toggleLesson: (lessonId: number) => void;
  memorizedVerses: string[];
  toggleMemorizedVerse: (verseId: string) => void;
  bookmarkedVerses: string[];
  toggleBookmarkedVerse: (verseId: string) => void;
  // Saved Verses and Prayers
  savedItems: SavedItem[];
  saveItem: (item: Omit<SavedItem, 'id' | 'savedAt'>) => void;
  removeSavedItem: (id: string) => void;
  updateSavedItemNotes: (id: string, notes: string) => void;
  isItemSaved: (titleOrContent: string) => boolean;
  toggleSaveItem: (item: Omit<SavedItem, 'id' | 'savedAt'>) => boolean;
  // Devotion Time Alarm
  alarmModalOpen: boolean;
  setAlarmModalOpen: (open: boolean) => void;
  isAlarmRinging: boolean;
  triggerDevotionAlarm: () => void;
  stopDevotionAlarm: () => void;
  snoozeDevotionAlarm: (minutes?: number) => void;
  emergencyModalOpen: boolean;
  setEmergencyModalOpen: (open: boolean) => void;
  setbackModalOpen: boolean;
  setSetbackModalOpen: (open: boolean) => void;
  exportAllData: () => string;
  importAllData: (jsonStr: string) => boolean;
  eraseAllData: () => void;
  // Offline & Data Sovereignty
  storageError: string | null;
  dismissStorageError: () => void;
  exportEncryptedBackup: (passphrase: string) => Promise<string>;
  importAnyBackup: (
    content: string,
    passphrase?: string
  ) => Promise<{ success: boolean; requiresPassword?: boolean; error?: string }>;
  // Theme (Dark / Light)
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
}

const STORAGE_KEYS = {
  PROFILE: 'aog_user_profile',
  CHECKLISTS: 'aog_daily_checklists',
  HABIT_LOGS: 'aog_habit_logs',
  JOURNAL: 'aog_journal_entries',
  CUSTOM_LIES: 'aog_custom_lies',
  COMPLETED_PLAN_DAYS: 'aog_completed_plan_days',
  COMPLETED_LESSONS: 'aog_completed_lessons',
  MEMORIZED_VERSES: 'aog_memorized_verses',
  BOOKMARKED_VERSES: 'aog_bookmarked_verses',
  SAVED_ITEMS: 'aog_saved_items'
};

const getTodayDateStr = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

const defaultProfile: UserProfile = {
  displayName: '',
  primaryGoals: ['stop_pornography', 'pursue_sexual_purity'],
  mainGoal: 'stop_pornography',
  customGoalText: '',
  primaryTriggers: ['late_night_phone', 'stress', 'loneliness'],
  devotionalReminderTime: '07:30',
  eveningReminderTime: '21:30',
  reminderNotificationsEnabled: false,
  devotionalAlarmEnabled: true,
  alarmSound: 'cathedral_bell',
  snoozeUntil: null,
  accountabilityType: 'private_self_guided',
  accountabilityPartnerName: '',
  accountabilityPartnerContact: '',
  startDate: new Date().toISOString(),
  lastSetbackDate: new Date().toISOString(),
  theme: 'dark',
  completedOnboarding: false
};

const defaultSavedItems: SavedItem[] = [
  {
    id: 'saved-init-1',
    type: 'verse',
    title: '1 Corinthians 10:13',
    content: 'No temptation has overtaken you that is not common to man. God is faithful, and he will not let you be tempted beyond your ability, but with the temptation he will also provide the way of escape, that you may be able to endure it.',
    source: 'Belt of Truth & Home Dashboard',
    category: 'Way of Escape',
    savedAt: new Date().toISOString(),
    notes: 'God always provides a clean exit door when temptation strikes.'
  },
  {
    id: 'saved-init-2',
    type: 'verse',
    title: 'Romans 8:1',
    content: 'There is therefore now no condemnation for those who are in Christ Jesus.',
    source: 'Breastplate of Righteousness',
    category: 'Freedom & Grace',
    savedAt: new Date().toISOString(),
    notes: 'Satan accuses to destroy; Jesus justifies and frees.'
  },
  {
    id: 'saved-init-3',
    type: 'prayer',
    title: 'Daily Armour of God Prayer',
    content: 'Lord Jesus, I put on the Belt of Truth against every deceptive urge. I put on the Breastplate of Righteousness, guarding my heart and affections. I fit my feet with the readiness of the Gospel of Peace. I take up the Shield of Faith to extinguish every flaming dart of lust and temptation. I put on the Helmet of Salvation to protect my mind, and I wield the Sword of the Spirit, which is Your living Word. In Your holy Name, Amen.',
    source: 'Ephesians 6 Devotional',
    category: 'Spiritual Warfare',
    savedAt: new Date().toISOString(),
    notes: 'Speak aloud each morning to dress in spiritual armour.'
  },
  {
    id: 'saved-init-4',
    type: 'prayer',
    title: 'Prayer for Purity and Cleansed Heart',
    content: 'Create in me a clean heart, O God, and renew a right spirit within me. Deliver my eyes from worthless idols and anchor my deep satisfaction in Your presence. Amen.',
    source: 'Psalm 51:10',
    category: 'Heart Purity',
    savedAt: new Date().toISOString(),
    notes: 'David’s prayer of repentance and restoration.'
  }
];

const defaultChecklist: DailyChecklist = {
  date: getTodayDateStr(),
  morningPrayer: false,
  beltOfTruthTruthDeclared: false,
  breastplateGuardAffection: false,
  shoesReadinessMission: false,
  shieldWordMeditation: false,
  helmetThoughtCaptive: false,
  swordVerseSpoken: false,
  eveningReflection: false
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        const primaryGoals = Array.isArray(parsed.primaryGoals) && parsed.primaryGoals.length > 0
          ? parsed.primaryGoals
          : (parsed.mainGoal ? [parsed.mainGoal] : ['stop_pornography', 'pursue_sexual_purity']);
        return { ...defaultProfile, ...parsed, primaryGoals };
      }
      return defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const [checklists, setChecklists] = useState<Record<string, DailyChecklist>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHECKLISTS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [habitLogs, setHabitLogs] = useState<HabitLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HABIT_LOGS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JOURNAL);
      if (saved) return JSON.parse(saved);
      // Default welcome initial journal entry
      return [
        {
          id: 'j-init-1',
          date: new Date().toISOString(),
          title: 'Stepping Into the Light',
          category: 'victory',
          content: 'Today I took the first step to overcome sexual sin with the Full Armour of God. I renounce the lies of secrecy and commit to walking in the light of Jesus Christ.',
          verseReference: 'Ephesians 6:11',
          tags: ['freedom', 'day1']
        }
      ];
    } catch {
      return [];
    }
  });

  const [customLies, setCustomLies] = useState<CustomLieCounter[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_LIES);
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'cl-1',
          lie: 'I am all alone in this fight and nobody understands my shame.',
          truth: 'No temptation has overtaken you that is not common to man. Christ understands your weakness and provides a way of escape.',
          scripture: '1 Corinthians 10:13; Hebrews 4:15',
          dateAdded: new Date().toISOString()
        }
      ];
    } catch {
      return [];
    }
  });

  const [completedPlanDays, setCompletedPlanDays] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_PLAN_DAYS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completedLessons, setCompletedLessons] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [memorizedVerses, setMemorizedVerses] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMORIZED_VERSES);
      return saved ? JSON.parse(saved) : ['sv-1', 'sv-4'];
    } catch {
      return ['sv-1', 'sv-4'];
    }
  });

  const [bookmarkedVerses, setBookmarkedVerses] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKMARKED_VERSES);
      return saved ? JSON.parse(saved) : ['sv-1', 'sv-15'];
    } catch {
      return ['sv-1', 'sv-15'];
    }
  });

  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_ITEMS);
      return saved ? JSON.parse(saved) : defaultSavedItems;
    } catch {
      return defaultSavedItems;
    }
  });

  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [setbackModalOpen, setSetbackModalOpen] = useState(false);
  const [alarmModalOpen, setAlarmModalOpen] = useState(false);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const lastAlarmMinuteRef = useRef<string>('');

  const dismissStorageError = () => setStorageError(null);

  const onStorageQuotaError = () => {
    setStorageError(
      'Device local storage limit reached. Your data remains in memory and offline IndexedDB. Please export a backup from Settings to prevent data loss.'
    );
  };

  // Double-redundancy: check IndexedDB if localStorage was cleared
  useEffect(() => {
    const recoverFromIndexedDB = async () => {
      try {
        const localProf = localStorage.getItem(STORAGE_KEYS.PROFILE);
        if (!localProf) {
          const idbProfile = await readFromIndexedDB<UserProfile>(STORAGE_KEYS.PROFILE);
          if (idbProfile) {
            setProfile(idbProfile);
            const [
              idbChecklists,
              idbHabitLogs,
              idbJournal,
              idbCustomLies,
              idbPlanDays,
              idbLessons,
              idbMemorized,
              idbBookmarked,
              idbSaved
            ] = await Promise.all([
              readFromIndexedDB<Record<string, DailyChecklist>>(STORAGE_KEYS.CHECKLISTS),
              readFromIndexedDB<HabitLogEntry[]>(STORAGE_KEYS.HABIT_LOGS),
              readFromIndexedDB<JournalEntry[]>(STORAGE_KEYS.JOURNAL),
              readFromIndexedDB<CustomLieCounter[]>(STORAGE_KEYS.CUSTOM_LIES),
              readFromIndexedDB<number[]>(STORAGE_KEYS.COMPLETED_PLAN_DAYS),
              readFromIndexedDB<number[]>(STORAGE_KEYS.COMPLETED_LESSONS),
              readFromIndexedDB<string[]>(STORAGE_KEYS.MEMORIZED_VERSES),
              readFromIndexedDB<string[]>(STORAGE_KEYS.BOOKMARKED_VERSES),
              readFromIndexedDB<SavedItem[]>(STORAGE_KEYS.SAVED_ITEMS)
            ]);

            if (idbChecklists) setChecklists(idbChecklists);
            if (idbHabitLogs) setHabitLogs(idbHabitLogs);
            if (idbJournal) setJournalEntries(idbJournal);
            if (idbCustomLies) setCustomLies(idbCustomLies);
            if (idbPlanDays) setCompletedPlanDays(idbPlanDays);
            if (idbLessons) setCompletedLessons(idbLessons);
            if (idbMemorized) setMemorizedVerses(idbMemorized);
            if (idbBookmarked) setBookmarkedVerses(idbBookmarked);
            if (idbSaved) setSavedItems(idbSaved);
          }
        }
      } catch {
        // Recovery check failed silently without throwing
      }
    };
    recoverFromIndexedDB();
  }, []);

  // Sync state to LocalStorage and IndexedDB
  useEffect(() => {
    safeLocalSet(STORAGE_KEYS.PROFILE, profile, onStorageQuotaError);
  }, [profile]);

  useEffect(() => {
    safeLocalSet(STORAGE_KEYS.SAVED_ITEMS, savedItems, onStorageQuotaError);
  }, [savedItems]);

  useEffect(() => {
    safeLocalSet(STORAGE_KEYS.CHECKLISTS, checklists, onStorageQuotaError);
  }, [checklists]);

  useEffect(() => {
    safeLocalSet(STORAGE_KEYS.HABIT_LOGS, habitLogs, onStorageQuotaError);
  }, [habitLogs]);

  useEffect(() => {
    safeLocalSet(STORAGE_KEYS.JOURNAL, journalEntries, onStorageQuotaError);
  }, [journalEntries]);

  useEffect(() => {
    safeLocalSet(STORAGE_KEYS.CUSTOM_LIES, customLies, onStorageQuotaError);
  }, [customLies]);

  useEffect(() => {
    safeLocalSet(STORAGE_KEYS.COMPLETED_PLAN_DAYS, completedPlanDays, onStorageQuotaError);
  }, [completedPlanDays]);

  useEffect(() => {
    safeLocalSet(STORAGE_KEYS.COMPLETED_LESSONS, completedLessons, onStorageQuotaError);
  }, [completedLessons]);

  useEffect(() => {
    safeLocalSet(STORAGE_KEYS.MEMORIZED_VERSES, memorizedVerses, onStorageQuotaError);
  }, [memorizedVerses]);

  useEffect(() => {
    safeLocalSet(STORAGE_KEYS.BOOKMARKED_VERSES, bookmarkedVerses, onStorageQuotaError);
  }, [bookmarkedVerses]);

  // Today's checklist helper
  const todayStr = getTodayDateStr();
  const todayChecklist = checklists[todayStr] || { ...defaultChecklist, date: todayStr };

  const toggleChecklistItem = (key: keyof Omit<DailyChecklist, 'date'>) => {
    setChecklists((prev) => {
      const current = prev[todayStr] || { ...defaultChecklist, date: todayStr };
      const updated = {
        ...current,
        [key]: !current[key]
      };
      return {
        ...prev,
        [todayStr]: updated
      };
    });
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  // Calculate days since last setback
  const lastSetbackMs = new Date(profile.lastSetbackDate).getTime();
  const nowMs = Date.now();
  const diffDays = Math.max(0, Math.floor((nowMs - lastSetbackMs) / (1000 * 60 * 60 * 24)));
  const daysSinceLastSetback = isNaN(diffDays) ? 0 : diffDays;

  // Total active days
  const startMs = new Date(profile.startDate).getTime();
  const totalDays = Math.max(1, Math.floor((nowMs - startMs) / (1000 * 60 * 60 * 24)) + 1);
  const totalDaysActive = isNaN(totalDays) ? 1 : totalDays;

  const recordSetback = (trigger: string, actionPlan: string, notes?: string) => {
    const nowIso = new Date().toISOString();
    // Reset setback date
    updateProfile({ lastSetbackDate: nowIso });

    // Automatically create a compassionate journal entry
    const newEntry: JournalEntry = {
      id: 'j-setback-' + Date.now(),
      date: nowIso,
      title: `Getting Back Up (Proverbs 24:16) — Trigger: ${trigger}`,
      category: 'setback',
      content: `I stumbled today. But there is now NO condemnation for those who are in Christ Jesus (Romans 8:1).\n\nIdentified Trigger: ${trigger}\nAction Plan for Next Time: ${actionPlan}\n${notes ? `Reflection: ${notes}\n` : ''}\n"For the righteous falls seven times and rises again." (Proverbs 24:16). I receive the cleansing blood of Jesus and rise again to stand firm in the armor!`,
      verseReference: '1 John 1:9'
    };
    setJournalEntries((prev) => [newEntry, ...prev]);

    // Also record in habit tracker
    const habitEntry: HabitLogEntry = {
      id: 'h-' + Date.now(),
      timestamp: nowIso,
      emotionalState: 'Post-Slip Reflection',
      trigger: trigger,
      urgeIntensity: 8,
      actionTaken: actionPlan,
      resisted: false,
      reflection: notes
    };
    setHabitLogs((prev) => [habitEntry, ...prev]);
  };

  const resetSobrietyDate = (newDateIso?: string) => {
    updateProfile({ lastSetbackDate: newDateIso || new Date().toISOString() });
  };

  const addHabitLog = (entry: Omit<HabitLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: HabitLogEntry = {
      ...entry,
      id: 'h-' + Date.now(),
      timestamp: new Date().toISOString()
    };
    setHabitLogs((prev) => [newEntry, ...prev]);
  };

  const deleteHabitLog = (id: string) => {
    setHabitLogs((prev) => prev.filter((item) => item.id !== id));
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'date'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: 'j-' + Date.now(),
      date: new Date().toISOString()
    };
    setJournalEntries((prev) => [newEntry, ...prev]);
  };

  const updateJournalEntry = (entry: JournalEntry) => {
    setJournalEntries((prev) => prev.map((item) => (item.id === entry.id ? entry : item)));
  };

  const deleteJournalEntry = (id: string) => {
    setJournalEntries((prev) => prev.filter((item) => item.id !== id));
  };

  const addCustomLie = (lie: string, truth: string, scripture: string) => {
    const newLie: CustomLieCounter = {
      id: 'cl-' + Date.now(),
      lie,
      truth,
      scripture,
      dateAdded: new Date().toISOString()
    };
    setCustomLies((prev) => [newLie, ...prev]);
  };

  const deleteCustomLie = (id: string) => {
    setCustomLies((prev) => prev.filter((item) => item.id !== id));
  };

  const togglePlanDay = (dayNumber: number) => {
    setCompletedPlanDays((prev) =>
      prev.includes(dayNumber) ? prev.filter((d) => d !== dayNumber) : [...prev, dayNumber]
    );
  };

  const toggleLesson = (lessonId: number) => {
    setCompletedLessons((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  const toggleMemorizedVerse = (verseId: string) => {
    setMemorizedVerses((prev) =>
      prev.includes(verseId) ? prev.filter((id) => id !== verseId) : [...prev, verseId]
    );
  };

  const toggleBookmarkedVerse = (verseId: string) => {
    setBookmarkedVerses((prev) =>
      prev.includes(verseId) ? prev.filter((id) => id !== verseId) : [...prev, verseId]
    );
  };

  // Saved Items Handlers
  const saveItem = (item: Omit<SavedItem, 'id' | 'savedAt'>) => {
    const newItem: SavedItem = {
      ...item,
      id: 'saved-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      savedAt: new Date().toISOString()
    };
    setSavedItems((prev) => [newItem, ...prev]);
  };

  const removeSavedItem = (id: string) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateSavedItemNotes = (id: string, notes: string) => {
    setSavedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes } : item))
    );
  };

  const isItemSaved = (titleOrContent: string) => {
    const query = titleOrContent.trim().toLowerCase();
    return savedItems.some(
      (item) =>
        item.title.toLowerCase() === query ||
        item.content.toLowerCase() === query
    );
  };

  const toggleSaveItem = (item: Omit<SavedItem, 'id' | 'savedAt'>): boolean => {
    const existing = savedItems.find(
      (i) =>
        i.title.toLowerCase() === item.title.trim().toLowerCase() ||
        i.content.toLowerCase() === item.content.trim().toLowerCase()
    );
    if (existing) {
      removeSavedItem(existing.id);
      return false; // Removed
    } else {
      saveItem(item);
      return true; // Added
    }
  };

  // Devotion Alarm Handlers
  const triggerDevotionAlarm = () => {
    startAlarmSound(profile.alarmSound || 'cathedral_bell');
    setIsAlarmRinging(true);
    setAlarmModalOpen(true);

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('Armour of God — Devotion Time', {
          body: 'Rise up and put on the Full Armour of God in prayer and Scripture meditation.',
          icon: '/favicon.png'
        });
      } catch (e) {
        console.warn('Devotion notification error:', e);
      }
    }

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([400, 200, 400, 200, 600]);
      } catch {}
    }
  };

  const stopDevotionAlarm = () => {
    stopAlarmSound();
    setIsAlarmRinging(false);
    setAlarmModalOpen(false);
    if (profile.snoozeUntil) {
      updateProfile({ snoozeUntil: null });
    }
  };

  const snoozeDevotionAlarm = (minutes = 5) => {
    stopAlarmSound();
    setIsAlarmRinging(false);
    setAlarmModalOpen(false);
    const snoozeDate = new Date(Date.now() + minutes * 60 * 1000).toISOString();
    updateProfile({ snoozeUntil: snoozeDate });
  };

  // Periodic alarm checker every 10 seconds
  useEffect(() => {
    const checkAlarm = () => {
      if (!profile.devotionalAlarmEnabled) return;

      const now = new Date();
      const currentHH = String(now.getHours()).padStart(2, '0');
      const currentMM = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHH}:${currentMM}`;
      const todayKey = `${now.toISOString().split('T')[0]}_${currentTimeStr}`;

      // Check if snooze time reached
      if (profile.snoozeUntil) {
        if (Date.now() >= new Date(profile.snoozeUntil).getTime()) {
          updateProfile({ snoozeUntil: null });
          triggerDevotionAlarm();
          return;
        }
      }

      // Check scheduled devotion reminder time
      if (currentTimeStr === profile.devotionalReminderTime && lastAlarmMinuteRef.current !== todayKey) {
        lastAlarmMinuteRef.current = todayKey;
        triggerDevotionAlarm();
      }
    };

    checkAlarm();
    const intervalId = window.setInterval(checkAlarm, 10000);
    return () => window.clearInterval(intervalId);
  }, [profile.devotionalAlarmEnabled, profile.devotionalReminderTime, profile.alarmSound, profile.snoozeUntil]);

  const exportAllData = () => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile,
      checklists,
      habitLogs,
      journalEntries,
      customLies,
      completedPlanDays,
      completedLessons,
      memorizedVerses,
      bookmarkedVerses,
      savedItems
    };
    return JSON.stringify(backup, null, 2);
  };

  const exportEncryptedBackup = async (passphrase: string): Promise<string> => {
    const rawBackup = exportAllData();
    const encryptedPkg = await encryptBackup(rawBackup, passphrase);
    return JSON.stringify(encryptedPkg, null, 2);
  };

  const importAllData = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.profile) setProfile(data.profile);
      if (data.checklists) setChecklists(data.checklists);
      if (data.habitLogs) setHabitLogs(data.habitLogs);
      if (data.journalEntries) setJournalEntries(data.journalEntries);
      if (data.customLies) setCustomLies(data.customLies);
      if (data.completedPlanDays) setCompletedPlanDays(data.completedPlanDays);
      if (data.completedLessons) setCompletedLessons(data.completedLessons);
      if (data.memorizedVerses) setMemorizedVerses(data.memorizedVerses);
      if (data.bookmarkedVerses) setBookmarkedVerses(data.bookmarkedVerses);
      if (data.savedItems) setSavedItems(data.savedItems);
      return true;
    } catch (e) {
      console.warn('Backup parsing encountered an issue:', e);
      return false;
    }
  };

  const importAnyBackup = async (
    content: string,
    passphrase?: string
  ): Promise<{ success: boolean; requiresPassword?: boolean; error?: string }> => {
    try {
      let jsonStr = content.trim();

      // Detect if encrypted backup package
      if (
        jsonStr.includes('"armour-of-god-encrypted-v1"')
      ) {
        if (!passphrase) {
          return { success: false, requiresPassword: true };
        }
        try {
          const pkg = JSON.parse(jsonStr) as EncryptedBackupPackage;
          jsonStr = await decryptBackup(pkg, passphrase);
        } catch {
          return {
            success: false,
            requiresPassword: true,
            error: 'Incorrect decryption password or corrupted encrypted backup.'
          };
        }
      }

      const success = importAllData(jsonStr);
      if (success) {
        return { success: true };
      }
      return { success: false, error: 'Unrecognized backup structure. Please ensure the file is an Armour of God backup.' };
    } catch {
      return { success: false, error: 'Could not read backup file contents.' };
    }
  };

  const eraseAllData = () => {
    localStorage.clear();
    try {
      if (typeof window !== 'undefined' && 'indexedDB' in window) {
        window.indexedDB.deleteDatabase('ArmourOfGodOfflineDB');
      }
    } catch {}
    setProfile({ ...defaultProfile, startDate: new Date().toISOString(), lastSetbackDate: new Date().toISOString() });
    setChecklists({});
    setHabitLogs([]);
    setJournalEntries([]);
    setCustomLies([]);
    setCompletedPlanDays([]);
    setCompletedLessons([]);
    setMemorizedVerses([]);
    setBookmarkedVerses([]);
    setSavedItems(defaultSavedItems);
  };

  // Theme Handlers
  const theme = profile.theme || 'dark';

  const setTheme = (newTheme: 'dark' | 'light') => {
    updateProfile({ theme: newTheme });
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  // Sync theme with HTML document and meta theme-color
  useEffect(() => {
    const currentTheme = profile.theme || 'dark';
    const root = document.documentElement;
    if (currentTheme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    }

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', currentTheme === 'light' ? '#f8fafc' : '#0b132b');
    }
  }, [profile.theme]);

  return (
    <AppContext.Provider
      value={{
        profile,
        updateProfile,
        todayChecklist,
        toggleChecklistItem,
        daysSinceLastSetback,
        totalDaysActive,
        recordSetback,
        resetSobrietyDate,
        habitLogs,
        addHabitLog,
        deleteHabitLog,
        journalEntries,
        addJournalEntry,
        updateJournalEntry,
        deleteJournalEntry,
        customLies,
        addCustomLie,
        deleteCustomLie,
        completedPlanDays,
        togglePlanDay,
        completedLessons,
        toggleLesson,
        memorizedVerses,
        toggleMemorizedVerse,
        bookmarkedVerses,
        toggleBookmarkedVerse,
        savedItems,
        saveItem,
        removeSavedItem,
        updateSavedItemNotes,
        isItemSaved,
        toggleSaveItem,
        alarmModalOpen,
        setAlarmModalOpen,
        isAlarmRinging,
        triggerDevotionAlarm,
        stopDevotionAlarm,
        snoozeDevotionAlarm,
        emergencyModalOpen,
        setEmergencyModalOpen,
        setbackModalOpen,
        setSetbackModalOpen,
        exportAllData,
        importAllData,
        eraseAllData,
        storageError,
        dismissStorageError,
        exportEncryptedBackup,
        importAnyBackup,
        theme,
        setTheme,
        toggleTheme
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
