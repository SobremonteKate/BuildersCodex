// Pinned repos shown in the GitHub Plan section. Each item is [repo, purpose].
export const REPOS = [
  ["marlehoteldb", "Flagship — capstone, upgraded through the roadmap"],
  ["sentinelscan", "Security scanning tool"],
  ["datapulse", "Data pipeline + AI dashboard"],
  ["portfolio", "Personal site (also your live resume)"],
];

// GitHub workflow cards. Each item is [heading, body].
export const GITHUB_CARDS = [
  ["Commit Strategy", "Conventional Commits: `feat:` `fix:` `docs:` `refactor:` `test:` `chore:`. Small, frequent commits over rare giant ones — commit history is a story recruiters actually read."],
  ["Branch Strategy", "GitHub Flow: `main` always deployable, feature branches like `feat/ai-concierge`, PR into main, delete branch after merge. No long-lived `dev` branch needed at this scale."],
  ["Issue Template", "Fields: **Summary**, **Steps to Reproduce** (bugs) or **User Story** (features), **Expected vs Actual**, **Priority** label."],
  ["Pull Request Template", "Fields: **What changed**, **Why**, **Screenshots/GIF**, **Testing done**, **Linked issue**."],
];

// Resume plan cards. Each item is [heading, body].
export const RESUME_CARDS = [
  ["Skills Section", "Group by category, not one flat list: **Languages** (PHP, JS/TS, Python, SQL) · **Frontend** (React, Next.js) · **Backend** (Node.js, PHP) · **Cloud/DevOps** (AWS, Docker, GitHub Actions, Terraform basics) · **Security** (OWASP practices, Kali fundamentals) · **Data/AI** (ETL basics, Claude API integration)."],
  ["Projects to List (in order)", "1. MarleHotelDB — Cloud Edition (headline project) · 2. SentinelScan · 3. DataPulse · 4. Portfolio site (as a link in your header, not a bullet)."],
  ["Certifications Worth Including", "AWS Educate completion badges (cloud + analytics paths), CS50 Cybersecurity certificate, OffSec PEN-103 completion if finished. Skip listing every free course — only ones tied to a real cert or badge belong on the resume itself; the rest live in your GitHub/portfolio."],
  ["Structure", "Header (name, links) → Summary (2 lines max) → Projects (with metrics/impact, not just tech lists) → Skills → Education → Certifications. One page. No objective statement."],
];

// Portfolio site structure cards. Each item is [heading, body].
export const PORTFOLIO_CARDS = [
  ["Pages", "Home · Projects · About · Blog/Devlog · Resume (viewable + downloadable)"],
  ["Home Sections", "Hero (name + one-line pitch) → Featured projects (3 cards) → Skill snapshot → Roadmap timeline → Contact"],
  ["Timeline Component", "Visual July→Dec journey, pulled straight from this Codex's Level system — turns your process into content."],
  ["Dark Mode", "Default dark, toggleable light. Keep it simple — a CSS variable swap, not two separate designs."],
  ["Blog / Devlog", "One short post per month minimum: what shipped, what broke, what you learned. This is free interview material."],
  ["Animations", "Restraint over quantity: one orchestrated hero entrance, subtle hover states on project cards. Skip scroll-jacking effects."],
];

// Final December launch checklist.
export const FINAL_CHECKLIST = [
  "Portfolio v2 live, mobile-responsive, dark mode working",
  "MarleHotelDB: cloud-deployed, CI/CD, hardened, AI feature v2",
  "SentinelScan v1 public with real README and demo video",
  "DataPulse v1 public with real README and demo video",
  "All 4 repos: consistent README template, clean commit history",
  "100+ meaningful GitHub commits total",
  "1 merged open source PR on someone else's repo",
  "Resume finalized — one page, metrics-driven bullets",
  "LinkedIn fully updated to match resume + portfolio",
  "15–20 coding problems solved + 3 self system-design walkthroughs",
  "Can explain all 4 projects out loud, unscripted, in under 2 minutes each",
  "First application sent",
];

export const HOWTO_CARDS = [
  ["Design the Story", "Your roadmap should feel like a journey: July is the forge, December is launch. Use the timeline to turn progress into a narrative."],
  ["Keep the UI Readable", "Dark background, restrained glow, and retro terminal-type fonts help the theme stay polished instead of gimmicky."],
  ["Use Real Links", "Link to deployed demo + GitHub repo for each project. Recruiters should click through without searching."],
  ["Highlight Impact", "On every card, mention the problem solved, the tech used, and the outcome or outcome-ready state."],
  ["Document the Process", "A roadmap is more than tasks. Add notes about what you learned, why you chose a path, and what you polished next."],
];

export const SKILL_TAGS = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express", "PHP", "Python", "SQL", "MySQL", "AWS", "Docker", "GitHub Actions", "Terraform", "OWASP", "Kali Linux", "Claude API", "ETL", "Data Visualization", "Responsive Design", "CI/CD",
];

export const UNLOCK_ORDER = [
  ["Portfolio v1", "JUL", "fullstack"],
  ["First AWS deployment", "AUG", "cloud"],
  ["Dockerized capstone", "SEP", "cloud"],
  ["CI/CD pipeline", "SEP", "cloud"],
  ["SentinelScan v1", "OCT", "security"],
  ["Security audit report", "OCT", "security"],
  ["DataPulse v1", "NOV", "data"],
  ["AI feature v2", "NOV", "data"],
  ["Portfolio live demo video", "DEC", "career"],
  ["Resume final", "DEC", "career"],
  ["Application sent", "DEC", "career"],
];