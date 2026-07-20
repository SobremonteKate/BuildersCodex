import React from "react";
import { COLORS } from "../data/misc";
import { ACADEMIES } from "../data/academies";

export default function Dashboard({ globalStats }) {
  return (
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
  );
}
