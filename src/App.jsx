import React, { useEffect, useState } from "react";
import BlurText from "./components/BlurText";
import { useCodexProgress } from "./hooks/useCodexProgress";
import { Reveal } from "./hooks/Reveal";

import { LEVELS } from "./data/levels";
import { ACHIEVEMENT_CATEGORIES } from "./data/achievements";
import { PROJECTS } from "./data/projects";
import {
  REPOS,
  GITHUB_CARDS,
  RESUME_CARDS,
  PORTFOLIO_CARDS,
  FINAL_CHECKLIST,
  SKILL_TAGS,
  UNLOCK_ORDER,
} from "./data/careerContent";
import { ACADEMIES, GITHUB_STATS_PLACEHOLDER, PROJECT_VAULT } from "./data/academies";
import { COLORS, NAV_LINKS } from "./data/misc";
import { useSounds } from "./hooks/useSounds";
import { useFloatingXP } from "./hooks/useFloatingXP";
import { useClickSparks } from "./hooks/useClickSparks";

/* ---------- helpers ---------- */

// turns `code` and **bold** markers inside plain strings into React nodes
function rich(str) {
  if (!str) return null;
  const parts = String(str).split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter((p) => p !== "");
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) return <code key={i}>{part.slice(1, -1)}</code>;
    if (part.startsWith("**") && part.endsWith("**")) return <b key={i}>{part.slice(2, -2)}</b>;
    return <span key={i}>{part}</span>;
  });
}

/* ---------- main component ---------- */

export default function BuildersCodex() {
  const {
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
  } = useCodexProgress();

  const [scrollPct, setScrollPct] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const prevClearedLevels = React.useRef(new Set());
  const fireLevelFanfare = React.useRef(false);
  const [activeSection, setActiveSection] = useState("");
  const [expandedAcademies, setExpandedAcademies] = useState(() => new Set(["software", "ai"]));
  const [rankingItems, setRankingItems] = useState(new Set());

  const {
    soundEnabled,
    setSoundEnabled,
    playClick,
    playChime,
    playFanfare,
    playBossClick,
  } = useSounds();

  const { particles, spawn: spawnXP } = useFloatingXP();
  const { sparks, spawn: spawnClick } = useClickSparks();

  // wrapper callbacks that play sounds + spawn XP particles alongside toggles
  const handleToggleQuest = (li, qi) => {
    toggleQuest(li, qi);
    playChime();
    spawnXP();
  };
  const handleToggleBoss = (li) => {
    toggleBoss(li);
    playBossClick();
    spawnXP();
  };
  const handleToggleAch = (id, name) => {
    const isUnlocking = !unlockedAch.has(id);
    toggleAch(id, name);
    if (isUnlocking) playFanfare();
    spawnXP();
  };
  const handleToggleLevelItem = (id) => {
    const isRankingUp = !checkedLevelItems.has(id);
    toggleLevelItem(id);
    playClick();
    spawnXP();
    if (isRankingUp) {
      setRankingItems(prev => new Set(prev).add(id));
      setTimeout(() => {
        setRankingItems(prev => { const next = new Set(prev); next.delete(id); return next; });
      }, 500);
    }
  };

  function toggleAcademyExpansion(id) {
    setExpandedAcademies(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const height = el.scrollHeight - el.clientHeight;
      setScrollPct(height > 0 ? (scrolled / height) * 100 : 0);
      setShowTop(window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // keyboard shortcut: press S to toggle sound (guarded against text inputs)
  useEffect(() => {
    function onKey(e) {
      if (e.key !== "s" && e.key !== "S") return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      setSoundEnabled(prev => !prev);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSoundEnabled]);

  // fanfare when a level is newly cleared (snapshot on first load, play on changes)
  useEffect(() => {
    if (!loaded) return; // wait until saved data is hydrated
    if (prevClearedLevels.current === null) {
      // first run after data loads: snapshot real state, no sound
      prevClearedLevels.current = new Set(
        levelStats.map((s, i) => (s.cleared ? i : null)).filter(i => i !== null)
      );
      return;
    }
    const nowCleared = new Set(
      levelStats.map((s, i) => (s.cleared ? i : null)).filter(i => i !== null)
    );
    nowCleared.forEach(i => {
      if (!prevClearedLevels.current.has(i)) playFanfare();
    });
    prevClearedLevels.current = nowCleared;
  }, [levelStats, playFanfare, loaded]);

  // lightweight click spark — spawns CSS-animated particles on mousedown
  useEffect(() => {
    const handler = (e) => spawnClick(e);
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [spawnClick]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const els = NAV_LINKS.map(([id]) => document.getElementById(id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="codex-root">
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />

      <nav className="toc">
        <div className="toc-inner">
          <span className="toc-brand">⚡ CODEX</span>
          {NAV_LINKS.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={activeSection === id ? "active" : ""}>{label}</a>
          ))}
          <button
            className="sound-toggle"
            onClick={() => setSoundEnabled(prev => !prev)}
            title={`Sound ${soundEnabled ? "ON" : "OFF"} (press S)`}
          >
            {soundEnabled ? "🔊" : "🔇"}
          </button>
        </div>
      </nav>

      {/* COVER */}
      <div className="cover">
        <div className="cover-inner">
          <div className="eyebrow-row">
            <span className="chip fullstack">� SOFTWARE</span>
            <span className="chip data">🤖 AI AUTOMATION</span>
            <span className="chip cloud">🟠 CLOUD</span>
            <span className="chip security">🔴 SECURITY</span>
            <span className="chip career">🟣 CAREER</span>
          </div>
         <BlurText
  text="CAREER OS"
  animateBy="letters"
  delay={45}
  stepDuration={0.55}
  className="codex-title"
  animationFrom={{
    opacity: 0,
    y: -80,
    scale: 1.25,
    filter: "blur(16px)",
  }}
  animationTo={[
    {
      opacity: 0.8,
      y: 8,
      scale: 1.08,
      filter: "blur(5px)",
    },
    {
      opacity: 1,
      y: -3,
      scale: 0.98,
      filter: "blur(0px)",
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
    },
  ]}
/>
          <p className="sub">A dual academy dashboard for tracking Software Engineering and AI Automation progress. Level up, complete quests, and build a project vault while keeping your momentum visible.</p>
          <div className="stat-row">
            <div className="stat-card"><div className="num">6</div><div className="lbl">Levels (Months)</div></div>
            <div className="stat-card"><div className="num">24</div><div className="lbl">Weeks</div></div>
            <div className="stat-card"><div className="num">~480</div><div className="lbl">Total Hours</div></div>
            <div className="stat-card"><div className="num">4</div><div className="lbl">Flagship Projects</div></div>
            <div className="stat-card"><div className="num">{totalAchCount}</div><div className="lbl">Achievements</div></div>
            <div className="stat-card"><div className="num">{globalStats.levelsCleared}/{LEVELS.length}</div><div className="lbl">Levels Cleared</div></div>
            <div className="stat-card"><div className="num">{globalStats.totalXP.toLocaleString()}</div><div className="lbl">XP Earned</div></div>
          </div>
          <div className="overall-progress-wrap">
            <div className="overall-progress-label"><span>Overall Roadmap Progress</span><span>{globalStats.overallPct}%</span></div>
            <div className="overall-progress-track"><div className="overall-progress-fill" style={{ width: `${globalStats.overallPct}%` }} /></div>
            <p className="overall-progress-hint">Click any quest, boss battle, or achievement badge below to track it here. Progress is saved automatically.</p>
          </div>
        </div>
      </div>

      <div className="wrap">
        <section id="dashboard">
          <div className="section-head">
            <div className="section-tag">Mission Control</div>
            <h2 className="section-title">📊 Career OS Dashboard</h2>
            <p className="section-desc">Track both academies in one place: total XP, streaks, today's quests, boss battles, and independent progress summaries.</p>
          </div>
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="dash-label">Overall XP</div>
              <div className="dash-value">{globalStats.totalXP.toLocaleString()}</div>
              <div className="dash-meta">{globalStats.levelsCleared} levels cleared · {globalStats.overallPct}% complete</div>
            </div>
            <div className="dashboard-card streak-card">
              <div className="dash-label">
                <span className="streak-fire">🔥</span> Combined Streak
              </div>
              <div className="dash-value streak-value">
                {ACADEMIES.reduce((sum, academy) => sum + academy.currentStreak, 0)}
                <span className="streak-unit"> days</span>
              </div>
              <div className="dash-meta">Across both academies</div>
            </div>
            <div className="dashboard-card">
              <div className="dash-label">Today's Quests</div>
              <ul className="dash-list">
                {ACADEMIES.flatMap((academy) =>
                  academy.todayQuests.map((quest, qi) => (
                    <li key={`${academy.id}-${qi}`}><span className="dash-emoji">{academy.emoji}</span> {quest}</li>
                  ))
                )}
              </ul>
            </div>
            <div className="dashboard-card card-full">
              <div className="dash-label">Academy Progress</div>
              <div className="academy-summary-grid">
                {ACADEMIES.map((academy) => {
                  const pct = Math.round((academy.currentXP / academy.xpTotal) * 100);
                  const trackColor = COLORS[academy.colorKey] || COLORS.gold;
                  return (
                    <div className="academy-summary" key={academy.id}>
                      <div className="academy-title">{academy.emoji} {academy.name}</div>
                      <div className="academy-stat">Level {academy.currentLevel} · {academy.currentXP.toLocaleString()} XP</div>
                      <div className="pbar"><div className="pbar-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${trackColor.fillA}, ${trackColor.fillB})` }} /></div>
                      <div className="academy-boss">Boss: {academy.currentBoss}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {ACADEMIES.map((academy) => (
          <section id={academy.id} key={academy.id} className="academy-section">
            <div className="section-head">
              <div className="section-tag">{academy.emoji} {academy.name}</div>
              <h2 className="section-title">{academy.name}</h2>
              <p className="section-desc">{academy.description}</p>
            </div>
            <div className="grid grid-2">
              <Reveal className="card">
                <div className="h">⚠ Current Snapshot</div>
                <div className="dash-metrics">
                  <div className="metric"><span>Level</span><strong className="xp-glow">{academy.currentLevel}</strong></div>
                  <div className="metric"><span>XP</span><strong className="xp-glow">{academy.currentXP.toLocaleString()} / {academy.xpTotal.toLocaleString()}</strong></div>
                  <div className="metric"><span>Streak</span><strong className="xp-glow">{academy.currentStreak > 0 ? `🔥 ${academy.currentStreak}` : academy.currentStreak} days</strong></div>
                  <div className="metric"><span>Boss</span><strong>{academy.currentBoss}</strong></div>
                </div>
              </Reveal>
              <Reveal className="card">
                <div className="h">Weekly Goals</div>
                <ul className="academy-goals">
                  {academy.weeklyGoals.map((goal, gi) => <li key={gi}>{goal}</li>)}
                </ul>
              </Reveal>
            </div>
          </section>
        ))}

        {/* ACADEMY LEVEL PROGRESSION — collapsed under each academy */}
        {ACADEMIES.map(academy => {
          const academyColor = COLORS[academy.colorKey] || COLORS.gold;
          const expanded = expandedAcademies.has(academy.id);
          return (
            <div key={`lp-${academy.id}`} className={`lp-academy${expanded ? " expanded" : ""}`} style={{ marginTop: 28 }}>
              <div className="lp-academy-header" onClick={() => toggleAcademyExpansion(academy.id)}>
                <div className="lp-academy-badge" style={{ background: academyColor.dim, color: academyColor.main }}>
                  {academy.emoji}
                </div>
                <div className="lp-academy-info">
                  <div className="lp-academy-name">{academy.name} — Level Progression</div>
                  <div className="lp-academy-meta">{academy.levels.length} levels · {academy.levels.reduce((s, l) => s + l.xp, 0).toLocaleString()} total XP</div>
                </div>
                <span className="lp-chevron" style={{ color: expanded ? academyColor.main : "var(--text-faint)" }}>
                  {expanded ? "▲" : "▼"}
                </span>
              </div>
              <div className="lp-academy-body">
                {academy.levels.map((lvl, li) => {
                  const lvlColor = COLORS[lvl.colorKey] || COLORS.gold;
                  const hasRightContent = lvl.skillsUnlocked?.length > 0 || lvl.miniProjects?.length > 0;
                  // per-level progress stats
                  const techTot = lvl.technologies?.length || 0;
                  const skillTot = lvl.skillsUnlocked?.length || 0;
                  const projTot = lvl.miniProjects?.length || 0;
                  const totalItems = techTot + skillTot + projTot;
                  const techChk = techTot ? lvl.technologies.filter(t => checkedLevelItems.has(`${academy.id}/${li}/t/${t}`)).length : 0;
                  const skillChk = skillTot ? lvl.skillsUnlocked.filter(s => checkedLevelItems.has(`${academy.id}/${li}/s/${s}`)).length : 0;
                  const projChk = projTot ? lvl.miniProjects.filter(mp => checkedLevelItems.has(`${academy.id}/${li}/p/${mp.title}`)).length : 0;
                  const totalChecked = techChk + skillChk + projChk;
                  const progressPct = totalItems > 0 ? Math.round((totalChecked / totalItems) * 100) : 0;
                  return (
                    <div key={li} className={`lp-level${expanded ? " show" : ""}`} style={{ transitionDelay: `${li * 60}ms` }}>
                      <div className="academy-level-card" style={{ borderLeftColor: lvlColor.dim }}>
                        <div className="academy-level-header">
                          <div className="academy-level-badge" style={{ background: lvlColor.dim, color: lvlColor.main }}>{lvl.num}</div>
                          <div className="academy-level-info">
                            <div className="academy-level-name">{lvl.name}</div>
                            <div className="academy-level-meta">{lvl.track} · {lvl.xp.toLocaleString()} XP · Unlocks: {lvl.unlocks}</div>
                          </div>
                        </div>
                        {totalItems > 0 && (
                          <div className="academy-level-progress">
                            <div className="academy-level-progress-stats">
                              {techTot > 0 && <span className="alp-stat">🛠️ {techChk}/{techTot}</span>}
                              {skillTot > 0 && <span className="alp-stat">⚡ {skillChk}/{skillTot}</span>}
                              {projTot > 0 && <span className="alp-stat">🏗️ {projChk}/{projTot}</span>}
                              <span className="alp-pct">{progressPct}%</span>
                            </div>
                            <div className="alp-track"><div className="alp-fill" style={{ width: `${progressPct}%`, background: `linear-gradient(90deg, ${lvlColor.fillA}, ${lvlColor.fillB})` }} /></div>
                          </div>
                        )}
                        <div className="academy-level-body" style={{
                          gridTemplateColumns: hasRightContent ? '1fr 1fr' : '1fr'
                        }}>
                          <div className="alc-left">
                            {lvl.objective && (
                              <div className="academy-level-field">
                                <span className="academy-level-label">🎯 Objective</span>
                                <p className="academy-level-text">{lvl.objective}</p>
                              </div>
                            )}
                            {lvl.technologies && lvl.technologies.length > 0 && (
                              <div className="academy-level-field">
                                <span className="academy-level-label">🛠️ Tech Stack</span>
                                <div className="skill-board">{lvl.technologies.map(t => {
                                  const tid = `${academy.id}/${li}/t/${t}`;
                                  const done = checkedLevelItems.has(tid);
                                  return <span key={t} className={`skill-tile${done ? " ranked" : ""}${rankingItems.has(tid) ? " ranking" : ""}`} onClick={() => handleToggleLevelItem(tid)}><span className="skill-tile-icon">{done ? "★" : "🛠️"}</span>{t}</span>;
                                })}</div>
                              </div>
                            )}
                            {lvl.resumeOutcome && (
                              <div className="academy-level-field">
                                <span className="academy-level-label">📄 Resume Impact</span>
                                <p className="academy-level-resume">{rich(lvl.resumeOutcome)}</p>
                              </div>
                            )}
                            {lvl.githubRepo && (
                              <div className="academy-level-field">
                                <span className="academy-level-label">📦 Repo</span>
                                <div className="academy-level-github"><code>{lvl.githubRepo}</code></div>
                              </div>
                            )}
                          </div>
                          {hasRightContent && (
                            <div className="alc-right">
                              {lvl.skillsUnlocked && lvl.skillsUnlocked.length > 0 && (
                                <div className="academy-level-field">
                                  <span className="academy-level-label">⚡ Skills Unlocked</span>
                                  <div className="skill-board">{lvl.skillsUnlocked.map(s => {
                                    const sid = `${academy.id}/${li}/s/${s}`;
                                    const done = checkedLevelItems.has(sid);
                                    return <span key={s} className={`skill-tile${done ? " ranked" : ""}${rankingItems.has(sid) ? " ranking" : ""}`} onClick={() => handleToggleLevelItem(sid)}><span className="skill-tile-icon">{done ? "★" : "⚡"}</span>{s}</span>;
                                  })}</div>
                                </div>
                              )}
                              {lvl.miniProjects && lvl.miniProjects.length > 0 && (
                                <div className="academy-level-field">
                                  <span className="academy-level-label">🏗️ Mini Projects</span>
                                  <div className="academy-level-mini-grid">
                                    {lvl.miniProjects.map((mp, mpi) => (
                                      <details key={mpi} className="academy-level-mini">
                                        <summary className="academy-level-mini-summary">
                                          <span
                                            className={`skill-tile mini${checkedLevelItems.has(`${academy.id}/${li}/p/${mp.title}`) ? " ranked" : ""}${rankingItems.has(`${academy.id}/${li}/p/${mp.title}`) ? " ranking" : ""}`}                                          onClick={(e) => { e.stopPropagation(); handleToggleLevelItem(`${academy.id}/${li}/p/${mp.title}`); }}
                                            >
                                              <span className="skill-tile-icon">{checkedLevelItems.has(`${academy.id}/${li}/p/${mp.title}`) ? "★" : "🏗️"}</span>{mp.title}
                                          </span>
                                        </summary>
                                        <div className="academy-level-mini-body">
                                          <div className="proj-block"><div className="h">Purpose</div>{mp.purpose}</div>
                                          <div className="proj-block"><div className="h">Features</div>{mp.features}</div>
                                          <div className="proj-block"><div className="h">Tech</div>{mp.tech}</div>
                                          <div className="proj-block"><div className="h">Skills</div>{mp.skillsLearned}</div>
                                          <div className="proj-block"><div className="h">Portfolio</div>{mp.portfolioValue}</div>
                                        </div>
                                      </details>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* SKILL TREE */}
        <section id="skilltree">
          <div className="section-head">
            <div className="section-tag">Character Build</div>
            <h2 className="section-title">🌳 Skill Tree</h2>
            <p className="section-desc">What you're keeping from your current build, and the branches you're unlocking, in order.</p>
          </div>
          <div className="grid grid-2">
            <Reveal className="card">
              <div className="h" style={{ color: "var(--fullstack)" }}>✅ Already Unlocked</div>
              <div className="tag-row">{SKILL_TAGS.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
            </Reveal>
            <Reveal className="card">
              <div className="h" style={{ color: "var(--gold)" }}>🔓 Unlock Order (Jul → Dec)</div>
              <ol style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: "var(--text-dim)", display: "flex", flexDirection: "column", gap: 6 }}>
                {UNLOCK_ORDER.map(([text, month, colorKey], i) => (
                  <li key={i}>{text} <span className="pill" style={{ borderColor: COLORS[colorKey].dim, color: COLORS[colorKey].main }}>{month}</span></li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>

        {/* LEVELS */}
        <section id="levels">
          <div className="section-head">
            <div className="section-tag">Progression System</div>
            <h2 className="section-title">🎮 The 6 Levels</h2>
            <p className="section-desc">Every level = one month. Clear the Quests, clear the Boss Battle, unlock the next track.</p>
          </div>
          {LEVELS.map((lvl, li) => {
            const c = COLORS[lvl.colorKey];
            const stats = levelStats[li];
            const bossCleared = clearedBosses.has(li);
            return (
              <Reveal key={li} className="level">
                <div className="level-head">
                  <div className="level-head-left">
                    <div className={`level-badge${stats.cleared ? " cleared" : ""}`} style={{ background: c.dim, color: c.main }}>{lvl.num}</div>
                    <div>
                      <p className="level-name">{lvl.name}</p>
                      <p className="level-meta">{lvl.month} · {lvl.track} · {lvl.xp.toLocaleString()} XP</p>
                    </div>
                  </div>
                  <span className="pill">Unlocks: {lvl.unlocks}</span>
                </div>
                <div className="level-body">
                  <div className="pbar"><div className="pbar-fill" style={{ width: `${stats.pct}%`, background: `linear-gradient(90deg, ${c.fillA}, ${c.fillB})` }} /></div>
                  <div style={{ height: 18 }} />
                  <ul className="quest-list">
                    {lvl.quests.map((q, qi) => {
                      const checked = checkedQuests.has(`${li}-${qi}`);
                      return (
                        <li key={qi} className={checked ? "q-checked" : ""} onClick={() => handleToggleQuest(li, qi)}>
                          {rich(q)}
                        </li>
                      );
                    })}
                  </ul>
                  <div className={`boss${bossCleared ? " b-cleared" : ""}`} onClick={() => handleToggleBoss(li)}>
                    <div className="lbl">⚔ BOSS BATTLE{bossCleared ? " · CLEARED ✔" : ""}</div>
                    {rich(lvl.boss)}
                  </div>
                  <div className="reward">{lvl.rewardIcon} <b>{lvl.isFinal ? "Final Reward:" : "Reward:"}</b> {rich(lvl.reward)}</div>
                </div>
              </Reveal>
            );
          })}
        </section>

        {/* ACHIEVEMENTS */}
        <section id="achievements">
          <div className="section-head">
            <div className="section-tag">Trophy Case</div>
            <h2 className="section-title">🏅 Achievements ({totalAchCount})</h2>
            <p className="section-desc">Unlockable in any order. Screenshot them, track them, put the best ones in your resume bullet points.</p>
          </div>
          {ACHIEVEMENT_CATEGORIES.map((cat, ci) => (
            <React.Fragment key={ci}>
              <div className="ach-cat-title">{cat.title}</div>
              <div className="grid grid-4">
                {cat.items.map(([emoji, name, desc], ii) => {
                  const id = `${ci}-${ii}`;
                  const unlocked = unlockedAch.has(id);
                  return (
                    <Reveal key={id} className={`ach${unlocked ? " unlocked" : ""}`} onClick={() => handleToggleAch(id, name)}>
                      <span className="emoji">{emoji}</span>
                      <div><div className="name">{name}</div><div className="desc">{desc}</div></div>
                    </Reveal>
                  );
                })}
              </div>
            </React.Fragment>
          ))}
        </section>

      </div>

      {/* PROJECTS */}
      <div className="wrap">
        <section id="projects">
          <div className="section-head">
            <div className="section-tag">Inventory</div>
            <h2 className="section-title">🏗️ Project Vault — Software vs AI</h2>
            <p className="section-desc">Projects are grouped by academy to keep software engineering work separate from AI automation workflows.</p>
          </div>
          {[
            { id: "software", title: "💻 Software Engineering" },
            { id: "ai", title: "🤖 AI Automation" },
          ].map((group) => {
            const items = PROJECTS.filter((project) => project.academy === group.id);
            return (
              <div key={group.id} className="project-group">
                <div className="project-group-title">{group.title}</div>
                <p className="project-group-desc">{PROJECT_VAULT.find((vault) => vault.title === group.title)?.description}</p>
                {items.map((p, pi) => (
                  <Reveal key={pi} className="proj">
                    <div className="proj-head">
                      <div><p className="proj-title">{p.title} <span className="pill" style={{ marginLeft: 8 }}>{p.badge}</span></p><span className="stars">{"★".repeat(p.stars)}{"☆".repeat(5 - p.stars)}</span></div>
                      <div className="tag-row">{p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
                    </div>
                    <div className="proj-body">
                      {p.blocks.map(([h, body], bi) => (
                        <div className="proj-block" key={bi}><div className="h">{h}</div>{rich(body)}</div>
                      ))}
                    </div>
                  </Reveal>
                ))}
              </div>
            );
          })}
        </section>

        {/* GITHUB */}
        <section id="github">
          <div className="section-head">
            <div className="section-tag">Base Camp</div>
            <h2 className="section-title">🐙 GitHub Plan</h2>
          </div>
          <div className="dashboard-grid github-stats-grid">
            {GITHUB_STATS_PLACEHOLDER.map((stat) => (
              <div key={stat.label} className="dashboard-card github-stat">
                <div className="dash-label">{stat.label}</div>
                <div className="dash-value">{stat.value}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-2">
            <Reveal className="card">
              <h3 className="sub-h">Repositories (pin these 4)</h3>
              <table>
                <tbody>
                  <tr><th>Repo</th><th>Purpose</th></tr>
                  {REPOS.map(([repo, purpose]) => (
                    <tr key={repo}><td><code>{repo}</code></td><td>{purpose}</td></tr>
                  ))}
                </tbody>
              </table>
              <p style={{ fontSize: 12.5, color: "var(--text-faint)", marginTop: 10 }}>Optional 5th: a <code>devlog</code> repo for weekly progress notes — cheap way to build commit consistency.</p>
            </Reveal>
            <Reveal className="card">
              <h3 className="sub-h">README Template</h3>
              <p style={{ fontSize: 13, color: "var(--text-dim)" }}>Every pinned repo needs: one-line pitch → live demo link → screenshot/GIF → tech stack badges → "Features" → "Getting Started" → "Architecture" (1 diagram) → "What I'd improve next".</p>
            </Reveal>
          </div>
          <div className="grid grid-3" style={{ marginTop: 28 }}>
            {GITHUB_CARDS.map(([h, body], i) => (
              <Reveal key={i} className="card">
                <h3 className="sub-h">{h}</h3>
                <p style={{ fontSize: 13, color: "var(--text-dim)" }}>{rich(body)}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* RESUME */}
        <section id="resume">
          <div className="section-head">
            <div className="section-tag">Character Sheet</div>
            <h2 className="section-title">📄 Resume Plan — By December</h2>
          </div>
          <div className="grid grid-2">
            {RESUME_CARDS.map(([h, body], i) => (
              <Reveal key={i} className="card">
                <h3 className="sub-h">{h}</h3>
                <p style={{ fontSize: 13, color: "var(--text-dim)" }}>{rich(body)}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* PORTFOLIO */}
        <section id="portfolio">
          <div className="section-head">
            <div className="section-tag">Home Base</div>
            <h2 className="section-title">🖥️ Portfolio Website Structure</h2>
          </div>
          <div className="grid grid-3">
            {PORTFOLIO_CARDS.map(([h, body], i) => (
              <Reveal key={i} className="card">
                <h3 className="sub-h">{h}</h3>
                <p style={{ fontSize: 13, color: "var(--text-dim)" }}>{body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FINAL CHECKLIST */}
        <section id="checklist">
          <div className="section-head">
            <div className="section-tag">End Credits</div>
            <h2 className="section-title">✅ Final Checklist — December</h2>
          </div>
          <ul className="check-final">
            {FINAL_CHECKLIST.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </section>
      </div>

      <footer>Built for the road from July to December. Track it, don't perfect it — a done week beats a perfect week.</footer>

      <div className="fab-group">
        <div className={`fab${showTop ? " show" : ""}`} title="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</div>
        <div className="fab show" title="Reset progress" onClick={resetProgress}>↺</div>
      </div>

      {/* Floating XP particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="xp-particle"
          style={{
            '--x-offset': `${p.xOffset}px`,
            '--delay': `${p.delay}s`,
          }}
        >
          +XP
        </div>
      ))}

      {/* Click spark particles */}
      {sparks.map((s) => (
        <div
          key={s.id}
          className="click-spark"
          style={{
            left: s.x,
            top: s.y,
            '--angle': `${s.angle}rad`,
            '--color': s.color,
            '--dist': `${s.distance}px`,
            '--s-delay': `${s.delay}s`,
          }}
        />
      ))}

      <div className={`toast${toast.show ? " show" : ""}`}>{toast.msg}</div>

    </div>
  );
}