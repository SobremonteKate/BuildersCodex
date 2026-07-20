import React from "react";
import { COLORS } from "../data/misc";

export default function AcademyLevelProgression({
  academies,
  expandedAcademies,
  onToggleAcademy,
  checkedLevelItems,
  onToggleLevelItem,
  rankingItems,
  rich,
}) {
  return academies.map((academy) => {
    const academyColor = COLORS[academy.colorKey] || COLORS.gold;
    const expanded = expandedAcademies.has(academy.id);
    return (
      <div key={`lp-${academy.id}`} className={`lp-academy${expanded ? " expanded" : ""}`} style={{ marginTop: 28 }}>
        <div className="lp-academy-header" onClick={() => onToggleAcademy(academy.id)}>
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
                            return <span key={t} className={`skill-tile${done ? " ranked" : ""}${rankingItems.has(tid) ? " ranking" : ""}`} onClick={() => onToggleLevelItem(tid)}><span className="skill-tile-icon">{done ? "★" : "🛠️"}</span>{t}</span>;
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
                              return <span key={s} className={`skill-tile${done ? " ranked" : ""}${rankingItems.has(sid) ? " ranking" : ""}`} onClick={() => onToggleLevelItem(sid)}><span className="skill-tile-icon">{done ? "★" : "⚡"}</span>{s}</span>;
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
                                      className={`skill-tile mini${checkedLevelItems.has(`${academy.id}/${li}/p/${mp.title}`) ? " ranked" : ""}${rankingItems.has(`${academy.id}/${li}/p/${mp.title}`) ? " ranking" : ""}`}
                                      onClick={(e) => { e.stopPropagation(); onToggleLevelItem(`${academy.id}/${li}/p/${mp.title}`); }}
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
  });
}
