import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import StepCard from "../components/StepCard";
import { recipeDetails } from "../data/mockData";

export default function CookingMode() {
  const { id } = useParams();
  const steps = recipeDetails.steps;
  const [stepIndex, setStepIndex] = useState(0);
  const [seconds, setSeconds] = useState(600);
  const [voiceMode, setVoiceMode] = useState(false);

  const current = useMemo(() => steps[stepIndex], [steps, stepIndex]);

  const timeLabel = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <section className="page cooking-page">
      <header className="card cooking-header">
        <small>COOKING MODE</small>
        <h2>{recipeDetails.title}</h2>
        <p>Recipe ID: {id}</p>
      </header>

      <StepCard stepNumber={stepIndex + 1} text={current} active />

      <article className="card timer-card">
        <h3>Timer</h3>
        <p>{timeLabel}</p>
        <div className="button-row">
          <button className="ghost-btn" onClick={() => setSeconds((s) => Math.max(0, s - 30))}>
            -30s
          </button>
          <button className="ghost-btn" onClick={() => setSeconds((s) => s + 30)}>
            +30s
          </button>
        </div>
      </article>

      <article className="card">
        <label className="voice-toggle">
          <span>Voice Assistant Hint</span>
          <input type="checkbox" checked={voiceMode} onChange={() => setVoiceMode((s) => !s)} />
        </label>
        {voiceMode && <p className="muted">Say: “Next step” or “Repeat instructions”.</p>}
      </article>

      <div className="button-row nav-row">
        <button
          className="ghost-btn"
          disabled={stepIndex === 0}
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
        >
          Previous
        </button>
        <button
          className="primary-btn"
          disabled={stepIndex === steps.length - 1}
          onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}
        >
          Next Step
        </button>
      </div>
    </section>
  );
}
