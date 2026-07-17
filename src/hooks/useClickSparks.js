import { useCallback, useRef, useState } from "react";

let nextId = 0;
const SPARK_COUNT = 5;
const DURATION = 450;
const COLORS = ["#ffd166", "#ff9d5c", "#ffd166", "#b98cff"];

export function useClickSparks() {
  const [sparks, setSparks] = useState([]);
  const timers = useRef({});

  const spawn = useCallback((e) => {
    const { clientX: x, clientY: y } = e;
    const now = performance.now();
    const batch = Array.from({ length: SPARK_COUNT }, (_, i) => {
      const id = ++nextId;
      const angle = (2 * Math.PI * i) / SPARK_COUNT + (Math.random() - 0.5) * 0.6;
      return {
        id,
        x,
        y,
        angle,
        color: COLORS[i % COLORS.length],
        distance: 14 + Math.random() * 8,
        delay: Math.random() * 0.06,
      };
    });

    setSparks((prev) => {
      const next = [...prev, ...batch];
      if (next.length > 30) next.splice(0, next.length - 30);
      return next;
    });

    batch.forEach((s) => {
      const t = setTimeout(() => {
        setSparks((prev) => prev.filter((p) => p.id !== s.id));
        delete timers.current[s.id];
      }, DURATION + s.delay * 1000);
      timers.current[s.id] = t;
    });
  }, []);

  return { sparks, spawn };
}
