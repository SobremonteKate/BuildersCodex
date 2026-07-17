import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LEVELS, ACHIEVEMENT_CATEGORIES, STORAGE_KEY } from "../data";
import { useToast } from "./useToast";

async function readSavedProgress() {
  if (typeof window === "undefined") return null;

  if (window.storage) {
    try {
      const res = await window.storage.get(STORAGE_KEY, false);
      if (res && res.value) return JSON.parse(res.value);
    } catch {
      // ignore and try localStorage
    }
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function writeSavedProgress(state) {
  if (typeof window === "undefined") return;

  const payload = JSON.stringify(state);
  if (window.storage) {
    try {
      await window.storage.set(STORAGE_KEY, payload, false);
      return;
    } catch {
      // ignore and fallback to localStorage
    }
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, payload);
  } catch {
    // ignore storage failures in restricted browsers
  }
}

/**
 * Owns all quest / boss-battle / achievement progress: loading it from
 * window.storage on mount, persisting it on every change, and deriving the
 * per-level and overall stats the rest of the app renders from.
 */
export function useCodexProgress() {
  const [checkedQuests, setCheckedQuests] = useState(() => new Set());
  const [clearedBosses, setClearedBosses] = useState(() => new Set());
  const [unlockedAch, setUnlockedAch] = useState(() => new Set());
  const [checkedLevelItems, setCheckedLevelItems] = useState(() => new Set());
  const [loaded, setLoaded] = useState(false);

  const { toast, showToast } = useToast();
  const prevClearedLevels = useRef(new Set());

  /* ---- load progress once ---- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const state = await readSavedProgress();
      if (!cancelled && state) {
        setCheckedQuests(new Set(state.quests || []));
        setClearedBosses(new Set(state.bosses || []));
        setUnlockedAch(new Set(state.achievements || []));
        setCheckedLevelItems(new Set(state.levelItems || []));
      }
      if (!cancelled) setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ---- save progress on change ---- */
  useEffect(() => {
    if (!loaded) return;
    writeSavedProgress({
      quests: Array.from(checkedQuests),
      bosses: Array.from(clearedBosses),
      achievements: Array.from(unlockedAch),
      levelItems: Array.from(checkedLevelItems),
    });
  }, [checkedQuests, clearedBosses, unlockedAch, checkedLevelItems, loaded]);

  /* ---- derived per-level completion ---- */
  const levelStats = useMemo(() => {
    return LEVELS.map((lvl, li) => {
      const doneQuests = lvl.quests.filter((_, qi) => checkedQuests.has(`${li}-${qi}`)).length;
      const bossDone = clearedBosses.has(li) ? 1 : 0;
      const itemCount = lvl.quests.length + 1;
      const doneItems = doneQuests + bossDone;
      const pct = itemCount ? Math.round((doneItems / itemCount) * 100) : 0;
      const cleared = itemCount > 0 && doneItems === itemCount;
      return { pct, cleared, doneItems, itemCount };
    });
  }, [checkedQuests, clearedBosses]);

  /* ---- toast on newly-cleared level (skip the initial load) ---- */
  useEffect(() => {
    if (!loaded) return;
    const nowCleared = new Set(levelStats.map((s, i) => (s.cleared ? i : null)).filter((i) => i !== null));
    nowCleared.forEach((i) => {
      if (!prevClearedLevels.current.has(i)) showToast(`🎮 Level Cleared: ${LEVELS[i].name}`);
    });
    prevClearedLevels.current = nowCleared;
  }, [levelStats, loaded, showToast]);

  /* ---- global stats ---- */
  const totalAchCount = useMemo(
    () => ACHIEVEMENT_CATEGORIES.reduce((n, c) => n + c.items.length, 0),
    []
  );
  const globalStats = useMemo(() => {
    let totalXP = 0,
      levelsCleared = 0;
    LEVELS.forEach((lvl, li) => {
      const s = levelStats[li];
      totalXP += Math.round((s.doneItems / s.itemCount) * lvl.xp);
      if (s.cleared) levelsCleared++;
    });
    const totalQuests = LEVELS.reduce((n, l) => n + l.quests.length, 0);
    const totalBosses = LEVELS.length;
    const totalItems = totalQuests + totalBosses + totalAchCount;
    const doneItems = checkedQuests.size + clearedBosses.size + unlockedAch.size;
    const overallPct = totalItems ? Math.round((doneItems / totalItems) * 100) : 0;
    return { totalXP, levelsCleared, overallPct };
  }, [levelStats, checkedQuests, clearedBosses, unlockedAch, totalAchCount]);

  /* ---- toggles ---- */
  const toggleQuest = useCallback((li, qi) => {
    const id = `${li}-${qi}`;
    setCheckedQuests((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleBoss = useCallback((li) => {
    setClearedBosses((prev) => {
      const next = new Set(prev);
      next.has(li) ? next.delete(li) : next.add(li);
      return next;
    });
  }, []);

  const toggleAch = useCallback(
    (id, name) => {
      setUnlockedAch((prev) => {
        const next = new Set(prev);
        const wasUnlocked = next.has(id);
        wasUnlocked ? next.delete(id) : next.add(id);
        if (!wasUnlocked) showToast(`🏅 Achievement unlocked: ${name}`);
        return next;
      });
    },
    [showToast]
  );

  const toggleLevelItem = useCallback((id) => {
    setCheckedLevelItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    if (!window.confirm("Reset all progress (quests, boss battles, achievements, level skills)? This cannot be undone.")) return;
    setCheckedQuests(new Set());
    setClearedBosses(new Set());
    setUnlockedAch(new Set());
    setCheckedLevelItems(new Set());
    prevClearedLevels.current = new Set();
    showToast("Progress reset");
  }, [showToast]);

  return {
    checkedQuests,
    clearedBosses,
    unlockedAch,
    checkedLevelItems,
    levelStats,
    globalStats,
    totalAchCount,
    loaded,
    toast,
    toggleQuest,
    toggleBoss,
    toggleAch,
    toggleLevelItem,
    resetProgress,
  };
}