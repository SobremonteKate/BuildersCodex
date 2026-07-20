import React from "react";
import { PROJECTS } from "../data/projects";
import { PROJECT_VAULT } from "../data/academies";
import { Reveal } from "../hooks/Reveal";

export default function Projects({ rich }) {
  return (
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
  );
}
