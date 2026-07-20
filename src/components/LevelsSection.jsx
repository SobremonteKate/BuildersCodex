import React from "react";
import { COLORS } from "../data/misc";
import { Reveal } from "../hooks/Reveal";

export default function LevelsSection({
  levels,
  levelStats,
  clearedBosses,
  checkedQuests,
  onToggleQuest,
  onToggleBoss,
  rich,
}) {
  return (
    <section id="levels">
      <div className="section-head">
        <div className="section-tag">Progression System</div>
        <h2 className="section-title">🎮 The 6 Levels</h2>
        <p className="section-desc">Every level = one month. Clear the Quests, clear the Boss Battle, unlock the next track.</p>
      </div>
      {levels.map((lvl, li) => {
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
                    <li key={qi} className={checked ? "q-checked" : ""} onClick={() => onToggleQuest(li, qi)}>
                      {rich(q)}
                    </li>
                  );
                })}
              </ul>
              <div className={`boss${bossCleared ? " b-cleared" : ""}`} onClick={() => onToggleBoss(li)}>
                <div className="lbl">⚔ BOSS BATTLE{bossCleared ? " · CLEARED ✔" : ""}</div>
                {rich(lvl.boss)}
              </div>
              <div className="reward">{lvl.rewardIcon} <b>{lvl.isFinal ? "Final Reward:" : "Reward:"}</b> {rich(lvl.reward)}</div>
            </div>
          </Reveal>
        );
      })}
    </section>
  );
}
