export default function FilterChips({ label, options, value, onChange }) {
  return (
    <section className="chip-group-wrap">
      {label && <h3>{label}</h3>}
      <div className="chip-group">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            className={`chip ${value === option ? "chip-active" : ""}`}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}
