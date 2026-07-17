import { useCallback, useEffect, useRef, useState } from "react";

const SOUNDS_KEY = "builderCodexSounds";

function loadSetting() {
  try {
    const raw = window.localStorage.getItem(SOUNDS_KEY);
    return raw !== null ? JSON.parse(raw) : true; // default ON
  } catch {
    return true;
  }
}

function saveSetting(val) {
  try {
    window.localStorage.setItem(SOUNDS_KEY, JSON.stringify(val));
  } catch {
    // ignore
  }
}

/**
 * Generates retro RPG sound effects using the Web Audio API — no external
 * files needed. Exposes playChime, playFanfare, playClick, and a toggle.
 */
export function useSounds() {
  const ctxRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(loadSetting);

  // persist toggle
  useEffect(() => {
    saveSetting(soundEnabled);
  }, [soundEnabled]);

  /** Lazily create/resume the AudioContext on first use */
  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      ctxRef.current = new Ctor();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  /** Play a tone at a given frequency for a given duration */
  const playTone = useCallback(
    (freq, duration, type = "sine", volume = 0.18, startOffset = 0) => {
      const ctx = ensureCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startOffset);

      gain.gain.setValueAtTime(volume, ctx.currentTime + startOffset);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + startOffset + duration
      );

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startOffset);
      osc.stop(ctx.currentTime + startOffset + duration);
    },
    [ensureCtx]
  );

  /** Play a sequence of tones (for chime / fanfare) */
  const playSequence = useCallback(
    (notes, type = "sine", volume = 0.18) => {
      notes.forEach(([freq, dur, delay]) => {
        playTone(freq, dur, type, volume, delay);
      });
    },
    [playTone]
  );

  /* ---- public sounds ---- */

  /** Soft click/pop — used for skill tag tracking */
  const playClick = useCallback(() => {
    if (!soundEnabled) return;
    playTone(660, 0.06, "sine", 0.12);
  }, [soundEnabled, playTone]);

  /** Short pleasant chime — used for quest check/uncheck */
  const playChime = useCallback(() => {
    if (!soundEnabled) return;
    playSequence(
      [
        [523, 0.12, 0],    // C5
        [659, 0.12, 0.1],  // E5
        [784, 0.18, 0.2],  // G5
      ],
      "sine",
      0.15
    );
  }, [soundEnabled, playSequence]);

  /** Triumphant fanfare — used for level clear / achievement unlock */
  const playFanfare = useCallback(() => {
    if (!soundEnabled) return;
    playSequence(
      [
        [523, 0.15, 0],     // C5
        [659, 0.15, 0.15],  // E5
        [784, 0.15, 0.3],   // G5
        [1047, 0.35, 0.45], // C6 (held longer)
      ],
      "triangle",
      0.22
    );
  }, [soundEnabled, playSequence]);

  /** Quick "click" for boss toggles */
  const playBossClick = useCallback(() => {
    if (!soundEnabled) return;
    playSequence(
      [
        [440, 0.08, 0],    // A4
        [550, 0.08, 0.07], // C#5
      ],
      "square",
      0.1
    );
  }, [soundEnabled, playSequence]);

  return {
    soundEnabled,
    setSoundEnabled,
    playClick,
    playChime,
    playFanfare,
    playBossClick,
  };
}
