import { useEffect } from "react";

/**
 * useKeyboard — declarative keyboard shortcut hook.
 *
 * @param {Array<{key: string, handler: () => void}>} bindings
 *   Array of key-binding objects. `key` is matched case-insensitively against
 *   `event.key`. All bindings are guarded against modifier keys (ctrl/meta/alt)
 *   and active text inputs (INPUT/TEXTAREA/SELECT).
 */
export function useKeyboard(bindings) {
  useEffect(() => {
    const lowerKeyToHandler = new Map();
    bindings.forEach(({ key, handler }) => {
      lowerKeyToHandler.set(key.toLowerCase(), handler);
    });

    function onKey(e) {
      // Guard: skip if modifier or inside a text input
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const handler = lowerKeyToHandler.get(e.key.toLowerCase());
      if (handler) {
        handler(e);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bindings]);
}
