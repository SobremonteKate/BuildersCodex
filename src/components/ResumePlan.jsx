import React from "react";
import { RESUME_CARDS } from "../data/careerContent";
import { Reveal } from "../hooks/Reveal";

export default function ResumePlan({ rich }) {
  return (
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
  );
}
