import React from "react";
import { COLORS } from "../data/misc";
import { SKILL_TAGS, UNLOCK_ORDER } from "../data/careerContent";
import { Reveal } from "../hooks/Reveal";

export default function SkillTree() {
  return (
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
  );
}
