import React from "react";
import { GITHUB_STATS_PLACEHOLDER, REPOS, GITHUB_CARDS } from "../data/careerContent";
import { Reveal } from "../hooks/Reveal";

export default function GitHubPlan({ rich }) {
  return (
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
  );
}
