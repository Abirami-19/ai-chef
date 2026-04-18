export default function StepCard({ stepNumber, text, active }) {
  return (
    <article className={`step-card ${active ? "step-card-active" : ""}`}>
      <small>STEP {stepNumber}</small>
      <p>{text}</p>
    </article>
  );
}
