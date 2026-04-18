export default function SearchBar({ value, onChange, placeholder = "Search recipes by ingredients" }) {
  return (
    <label className="search-input-wrap">
      <span>🔎</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}
