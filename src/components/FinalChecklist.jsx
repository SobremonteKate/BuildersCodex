import React from "react";
import { FINAL_CHECKLIST } from "../data/careerContent";

export default function FinalChecklist() {
  return (
    <section id="checklist">
      <div className="section-head">
        <div className="section-tag">End Credits</div>
        <h2 className="section-title">✅ Final Checklist — December</h2>
      </div>
      <ul className="check-final">
        {FINAL_CHECKLIST.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </section>
  );
}
