import { useState } from "react";

const dietPreferences = ["Vegetarian", "Pescatarian", "Vegan", "None"];
const units = ["Metric", "Imperial"];

export default function Profile() {
  const [diet, setDiet] = useState("Vegetarian");
  const [unit, setUnit] = useState("Metric");
  const [notifications, setNotifications] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);

  return (
    <section className="page">
      <article className="card profile-header-card">
        <img
          src="https://images.unsplash.com/photo-1545167622-3a6ac756afa4?auto=format&fit=crop&w=300&q=80"
          alt="User avatar"
        />
        <div>
          <h2>Jamie Rivera</h2>
          <p>Cuisine Explorer • Home Chef</p>
        </div>
      </article>

      <article className="card settings-card">
        <h3>Dietary Preferences</h3>
        <div className="chip-group">
          {dietPreferences.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip ${diet === item ? "chip-active" : ""}`}
              onClick={() => setDiet(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </article>

      <article className="card settings-card">
        <h3>Measurement System</h3>
        <div className="chip-group">
          {units.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip ${unit === item ? "chip-active" : ""}`}
              onClick={() => setUnit(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </article>

      <article className="card settings-card toggles">
        <label>
          <span>Notifications</span>
          <input type="checkbox" checked={notifications} onChange={() => setNotifications((s) => !s)} />
        </label>
        <label>
          <span>Privacy Mode</span>
          <input type="checkbox" checked={privacyMode} onChange={() => setPrivacyMode((s) => !s)} />
        </label>
      </article>

      <button type="button" className="ghost-btn logout-btn">
        Logout
      </button>
    </section>
  );
}
