import React from "react";

// turns `code` and **bold** markers inside plain strings into React nodes
export function rich(str) {
  if (!str) return null;
  const parts = String(str).split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter((p) => p !== "");
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) return <code key={i}>{part.slice(1, -1)}</code>;
    if (part.startsWith("**") && part.endsWith("**")) return <b key={i}>{part.slice(2, -2)}</b>;
    return <span key={i}>{part}</span>;
  });
}
