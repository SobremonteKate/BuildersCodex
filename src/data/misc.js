// Color tokens per track, keyed the same way as each data item's `colorKey`.
export const COLORS = {
  fullstack: { main: "#5cd6ff", dim: "#1c3a47", fillA: "#5cd6ff", fillB: "#3aa8cc" },
  cloud: { main: "#ff9d5c", dim: "#4a3220", fillA: "#ff9d5c", fillB: "#cc7a3a" },
  security: { main: "#ff5c7c", dim: "#4a1f2b", fillA: "#ff5c7c", fillB: "#cc3a54" },
  data: { main: "#5cffb0", dim: "#1c4535", fillA: "#5cffb0", fillB: "#3acc8a" },
  career: { main: "#b98cff", dim: "#332048", fillA: "#b98cff", fillB: "#8c5cd6" },
  gold: { main: "#ffd166", dim: "#453419", fillA: "#ffd166", fillB: "#cc9f33" },
};

// Table-of-contents links, in on-page order. Also drives scroll-spy tracking.
export const NAV_LINKS = [
  ["dashboard", "Dashboard"],
  ["software", "Software"],
  ["ai", "AI"],
  ["levels", "Levels"],
  ["achievements", "Achievements"],
  ["projects", "Projects"],
  ["github", "GitHub"],
  ["resume", "Resume"],
  ["portfolio", "Portfolio"],
  ["checklist", "Checklist"],
];

export const STORAGE_KEY = "builderCodexProgress";