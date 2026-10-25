export type RecoveryGoal =
  | 'stop_pornography'
  | 'stop_masturbation'
  | 'overcome_lustful_habits'
  | 'reduce_compulsive_behavior'
  | 'pursue_sexual_purity';

export type TemptationTrigger =
  | 'loneliness'
  | 'boredom'
  | 'stress'
  | 'anxiety'
  | 'rejection'
  | 'late_night_phone'
  | 'social_media'
  | 'fatigue'
  | 'unstructured_time'
  | string;

export type AccountabilityType =
  | 'private_self_guided'
  | 'trusted_christian_partner'
  | 'pastor_or_mentor';

export interface UserProfile {
  displayName: string;
  primaryGoals: RecoveryGoal[];
  mainGoal?: RecoveryGoal; // Deprecated single goal fallback
  customGoalText?: string;
  primaryTriggers: string[];
  devotionalReminderTime: string; // e.g. "07:30"
  eveningReminderTime: string;    // e.g. "21:30"
  reminderNotificationsEnabled: boolean;
  devotionalAlarmEnabled: boolean; // Audible alarm that rings at devotion time
  alarmSound?: 'cathedral_bell' | 'gentle_chime' | 'harp_arpeggio';
  snoozeUntil?: string | null;
  accountabilityType: AccountabilityType;
  accountabilityPartnerName?: string;
  accountabilityPartnerContact?: string;
  startDate: string; // ISO date string
  lastSetbackDate: string; // ISO date string
  theme?: 'dark' | 'light';
  completedOnboarding: boolean;
}

export interface SavedItem {
  id: string;
  type: 'verse' | 'prayer';
  title: string;
  content: string;
  source?: string;
  category?: string;
  savedAt: string;
  notes?: string;
}

export interface HabitLogEntry {
  id: string;
  timestamp: string; // ISO string
  emotionalState: string;
  trigger: string;
  urgeIntensity: number; // 1-10
  actionTaken: string;
  resisted: boolean;
  reflection?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  category: 'reflection' | 'prayer' | 'victory' | 'setback' | 'gratitude';
  content: string;
  verseReference?: string;
  tags?: string[];
}

export interface CustomLieCounter {
  id: string;
  lie: string;
  truth: string;
  scripture: string;
  dateAdded: string;
}

export interface ArmorPiece {
  id: 'belt' | 'breastplate' | 'shoes' | 'shield' | 'helmet' | 'sword' | 'prayer';
  name: string;
  scriptureRef: string;
  scriptureText: string;
  iconName: string;
  subtitle: string;
  purposeInBattle: string;
  biblicalTeaching: string[];
  practicalExercise: {
    title: string;
    description: string;
    actionPrompt: string;
  };
  prayerTitle: string;
  fullPrayer: string;
}

export interface SwordVerse {
  id: string;
  category:
    | 'urge_to_look'
    | 'lie_must_give_in'
    | 'lie_will_satisfy'
    | 'lie_of_secrecy'
    | 'body_is_not_yours'
    | 'shame_after_fall'
    | 'despair_never_change'
    | 'general_temptation'
    | 'renewing_mind';
  categoryLabel: string;
  reference: string;
  text: string;
  wieldExplanation: string;
  memorized?: boolean;
  bookmarked?: boolean;
}

export interface LessonSubSection {
  heading: string;
  paragraphs: string[];
  scriptures?: { ref: string; text: string }[];
}

export interface BibleStudyLesson {
  id: number;
  slug: string;
  title: string;
  part: string;
  pdfSection: string;
  scriptureAnchor: string;
  anchorText: string;
  summary: string;
  keyPoints: string[];
  exposition: string[];
  subsections?: LessonSubSection[];
  reflectionQuestions: string[];
  practicalExercise: string;
  closingPrayer: string;
}

export interface PlanDay {
  dayNumber: number;
  phaseNumber: 1 | 2 | 3 | 4;
  phaseName: string;
  title: string;
  scriptureRef: string;
  scriptureText: string;
  devotional: string;
  armorFocus: string;
  habitTask: string;
  reflectionQuestion: string;
  prayer: string;
}

export interface QuizQuestion {
  id: string;
  quizTopic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  scriptureRef: string;
}

export interface MilestoneBadge {
  id: string;
  daysRequired: number;
  title: string;
  subtitle: string;
  verse: string;
  icon: string;
}

export interface DailyChecklist {
  date: string; // YYYY-MM-DD
  morningPrayer: boolean;
  beltOfTruthTruthDeclared: boolean;
  breastplateGuardAffection: boolean;
  shoesReadinessMission: boolean;
  shieldWordMeditation: boolean;
  helmetThoughtCaptive: boolean;
  swordVerseSpoken: boolean;
  eveningReflection: boolean;
}
