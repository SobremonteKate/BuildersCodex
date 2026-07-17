export const DAILY_QUEST_TYPES = [
  {
    time: "15 min",
    label: "EASY",
    colorKey: "fullstack",
    examples: [
      "Read one doc page / changelog",
      "Write 3 commit messages properly",
      "Update one README section",
      "Watch one short tutorial clip",
    ],
  },
  {
    time: "30 min",
    label: "MEDIUM",
    colorKey: "cloud",
    examples: [
      "Fix one bug end-to-end",
      "Finish one AWS Educate lab",
      "Write one automated test",
      "Style one UI component fully",
    ],
  },
  {
    time: "1–2 hr",
    label: "HARD",
    colorKey: "security",
    examples: [
      "Ship a small feature end-to-end",
      "Set up a CI workflow",
      "Complete a Kali lab exercise",
      "Build one dashboard chart",
    ],
  },
  {
    time: "3hr+",
    label: "DEEP WORK",
    colorKey: "data",
    examples: [
      "Boss Battle work sessions",
      "New project architecture + scaffold",
      "Full deploy pipeline setup",
      "Capstone feature milestone",
    ],
  },
];

export const LOW_ENERGY = {
  colorKey: "career",
  label: "For days you truly can't focus — still counts, no guilt",
  examples: [
    "Re-read your own code from last session (no writing required)",
    "Organize/rename files in a repo",
    "Watch one relevant talk or video passively",
    "Update your quest tracker / plan tomorrow's one task",
    "Star/bookmark 3 resources for later",
  ],
};
