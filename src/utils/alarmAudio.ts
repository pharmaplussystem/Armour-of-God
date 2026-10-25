/**
 * Web Audio API synthesizer for the Devotion Time Alarm.
 * Synthesizes rich, spiritual chimes, cathedral bells, and harp arpeggios
 * entirely client-side without relying on external network assets or MP3s.
 */

let audioCtx: AudioContext | null = null;
let alarmIntervalId: number | null = null;
let isRinging = false;

const getAudioContext = (): AudioContext => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

/**
 * Play a single musical bell/chime strike with natural decay and rich harmonics
 */
const playBellChime = (
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration = 2.5,
  volume = 0.25
) => {
  // Fundamental oscillator
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();

  // Harmonic overtone oscillator for authentic metallic bell resonance
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(freq, startTime);

  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(freq * 2.01, startTime); // Slight detune for shimmer

  // Envelope for fundamental
  gain1.gain.setValueAtTime(0.0001, startTime);
  gain1.gain.exponentialRampToValueAtTime(volume, startTime + 0.03); // Quick strike
  gain1.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  // Envelope for harmonic overtone (dies faster)
  gain2.gain.setValueAtTime(0.0001, startTime);
  gain2.gain.exponentialRampToValueAtTime(volume * 0.45, startTime + 0.02);
  gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.5);

  osc1.connect(gain1);
  osc2.connect(gain2);

  gain1.connect(ctx.destination);
  gain2.connect(ctx.destination);

  osc1.start(startTime);
  osc2.start(startTime);

  osc1.stop(startTime + duration + 0.1);
  osc2.stop(startTime + duration + 0.1);
};

/**
 * Play a chord phrase based on chosen tone
 */
const playAlarmPhrase = (soundType = 'cathedral_bell') => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (soundType === 'gentle_chime') {
      // Soft high chimes: E5, G5, B5, E6
      const notes = [659.25, 783.99, 987.77, 1318.51];
      notes.forEach((freq, idx) => {
        playBellChime(ctx, freq, now + idx * 0.25, 2.0, 0.2);
      });
    } else if (soundType === 'harp_arpeggio') {
      // Ascending harp arpeggio: C4, E4, G4, C5, E5, G5, C6
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        playBellChime(ctx, freq, now + idx * 0.15, 2.2, 0.18);
      });
    } else {
      // Default: Cathedral Bell Chime (Westminster-style Westminster chime notes)
      // E4, C4, D4, G3 then wait, then G3, D4, E4, C4
      const notes = [
        { f: 659.25, t: 0.0 },   // E5
        { f: 523.25, t: 0.45 },  // C5
        { f: 587.33, t: 0.9 },   // D5
        { f: 392.00, t: 1.35 },  // G4
        { f: 523.25, t: 2.1 }    // C5 sustained
      ];
      notes.forEach(({ f, t }) => {
        playBellChime(ctx, f, now + t, 2.8, 0.28);
      });
    }
  } catch (err) {
    console.warn('Audio alarm playback failed:', err);
  }
};

/**
 * Start repeating alarm ringing until stopped
 */
export const startAlarmSound = (soundType = 'cathedral_bell') => {
  if (isRinging) return;
  isRinging = true;

  // Play immediately
  playAlarmPhrase(soundType);

  // Repeat every 3.8 seconds
  if (alarmIntervalId !== null) {
    clearInterval(alarmIntervalId);
  }

  alarmIntervalId = window.setInterval(() => {
    if (!isRinging) {
      if (alarmIntervalId !== null) clearInterval(alarmIntervalId);
      return;
    }
    playAlarmPhrase(soundType);
  }, 3800);
};

/**
 * Stop alarm ringing
 */
export const stopAlarmSound = () => {
  isRinging = false;
  if (alarmIntervalId !== null) {
    clearInterval(alarmIntervalId);
    alarmIntervalId = null;
  }
};

/**
 * Play a single test sample chime (rings once, doesn't loop)
 */
export const playSampleChime = (soundType = 'cathedral_bell') => {
  playAlarmPhrase(soundType);
};

export const isAlarmSounding = () => isRinging;
