import { useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import CookingMode from "./pages/CookingMode";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Recipe from "./pages/Recipe";
import Search from "./pages/Search";

export default function App() {
  const [saved, setSaved] = useState([]);

  const savedIds = useMemo(() => new Set(saved.map((recipe) => recipe.id)), [saved]);

  const onToggleSave = (recipe) => {
    setSaved((prev) => {
      if (prev.some((item) => item.id === recipe.id)) {
        return prev.filter((item) => item.id !== recipe.id);
      }
      return [recipe, ...prev];
    });
  };

  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home onToggleSave={onToggleSave} savedIds={savedIds} />} />
          <Route path="/search" element={<Search onToggleSave={onToggleSave} savedIds={savedIds} />} />
          <Route path="/recipe/:id" element={<Recipe onToggleSave={onToggleSave} savedIds={savedIds} />} />
          <Route path="/favorites" element={<Favorites savedIds={savedIds} onToggleSave={onToggleSave} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cooking/:id" element={<CookingMode />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
