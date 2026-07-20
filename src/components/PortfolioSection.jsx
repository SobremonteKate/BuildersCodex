import React from "react";
import { PORTFOLIO_CARDS } from "../data/careerContent";
import { Reveal } from "../hooks/Reveal";

export default function PortfolioSection({ rich }) {
  return (
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
  );
}
