import React from "react";
import { Reveal } from "../hooks/Reveal";

export default function Achievements({
  categories,
  unlockedAch,
  onToggleAch,
  totalCount,
}) {
  return (
    <section id="achievements">
      <div className="section-head">
        <div className="section-tag">Trophy Case</div>
        <h2 className="section-title">🏅 Achievements ({totalCount})</h2>
        <p className="section-desc">Unlockable in any order. Screenshot them, track them, put the best ones in your resume bullet points.</p>
      </div>
      {categories.map((cat, ci) => (
        <React.Fragment key={ci}>
          <div className="ach-cat-title">{cat.title}</div>
          <div className="grid grid-4">
            {cat.items.map(([emoji, name, desc], ii) => {
              const id = `${ci}-${ii}`;
              const unlocked = unlockedAch.has(id);
              return (
                <Reveal key={id} className={`ach${unlocked ? " unlocked" : ""}`} onClick={() => onToggleAch(id, name)}>
                  <span className="emoji">{emoji}</span>
                  <div><div className="name">{name}</div><div className="desc">{desc}</div></div>
                </Reveal>
              );
            })}
          </div>
        </React.Fragment>
      ))}
    </section>
  );
}
