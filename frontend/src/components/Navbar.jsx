import { NavLink } from "react-router-dom";

const items = [
  ["/", "Home"],
  ["/search", "Search"],
  ["/favorites", "Favorites"],
  ["/profile", "Profile"]
];

export default function Navbar() {
  return (
    <header className="top-nav">
      <h1>AI Chef</h1>
      <nav>
        {items.map(([to, label]) => (
          <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "active" : "") }>
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
