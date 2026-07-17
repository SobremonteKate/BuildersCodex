import { useCallback, useRef, useState } from "react";

let nextId = 0;

/**
 * Manages a pool of floating '+XP' particles.
 * - spawn() creates a new particle with random offset
 * - active list auto-cleans particles older than 1.3s
 * - max 3 concurrent particles (oldest removed if exceeded)
 */
export function useFloatingXP() {
  const [particles, setParticles] = useState([]);
  const timersRef = useRef({});

  const spawn = useCallback(() => {
    const id = ++nextId;
    const particle = {
      id,
      xOffset: (Math.random() - 0.5) * 80, // random horizontal drift -40..40px
      delay: Math.random() * 0.12,          // random stagger 0..0.12s
      createdAt: Date.now(),
    };

    setParticles((prev) => {
      // keep newest max 3
      const updated = [...prev, particle];
      if (updated.length > 3) updated.splice(0, updated.length - 3);
      return updated;
    });

    // auto-remove after animation completes
    const timer = setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
      delete timersRef.current[id];
    }, 1300);
    timersRef.current[id] = timer;

    return id;
  }, []);

  return { particles, spawn };
}
