import React from "react";
import { COLORS } from "../data/misc";
import { Reveal } from "../hooks/Reveal";

export default function AcademyOverview({ academies }) {
  return academies.map((academy) => (
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
  ));
}
