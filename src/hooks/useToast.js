import { useCallback, useRef, useState } from "react";

/**
 * Small self-contained toast: call showToast(message) and it auto-hides
 * after ~2.6s. Used for level-cleared / achievement-unlocked notifications.
 */
export function useToast(duration = 2600) {
  const [toast, setToast] = useState({ show: false, msg: "" });
  const timerRef = useRef(null);

  const showToast = useCallback(
    (msg) => {
      setToast({ show: true, msg });
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setToast({ show: false, msg: "" }), duration);
    },
    [duration]
  );

  return { toast, showToast };
}