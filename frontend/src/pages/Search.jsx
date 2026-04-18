import { useMemo, useState } from "react";
import { searchRecipesByIngredients } from "../api/client";
import FilterChips from "../components/FilterChips";
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";
import { trendingRecipes } from "../data/mockData";

export default function Search({ onToggleSave, savedIds }) {
  const [query, setQuery] = useState("egg, rice, spicy");
  const [cuisine, setCuisine] = useState("All");
  const [spice, setSpice] = useState("All");
  const [time, setTime] = useState("Any");
  const [remoteRecipes, setRemoteRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const source = remoteRecipes.length ? remoteRecipes : trendingRecipes;
    return source.filter((recipe) => {
      const cuisineMatch = cuisine === "All" || recipe.cuisine === cuisine;
      const spiceMatch = spice === "All" || recipe.spiceLevel?.toLowerCase() === spice.toLowerCase();
      const timeMatch =
        time === "Any" ||
        (time === "<20" && recipe.time < 20) ||
        (time === "20-30" && recipe.time >= 20 && recipe.time <= 30) ||
        (time === "30+" && recipe.time > 30);
      return cuisineMatch && spiceMatch && timeMatch;
    });
  }, [remoteRecipes, cuisine, spice, time]);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const maxCookingTime = time === "<20" ? 20 : time === "20-30" ? 30 : 60;
      const data = await searchRecipesByIngredients({
        ingredients: query,
        cuisine,
        spiceLevel: spice === "All" ? "medium" : spice.toLowerCase(),
        maxCookingTime
      });

      const normalized = (data.recipes || []).map((recipe) => ({
        id: recipe.externalId || recipe._id,
        title: recipe.title,
        image: recipe.image,
        cuisine: recipe.cuisine || "Global",
        time: recipe.readyInMinutes || 30,
        rating: Number((recipe.rankingScore || recipe.ingredientMatchScore || 4).toFixed?.(1) || 4.2),
        spiceLevel: recipe.spiceLevel || "medium"
      }));

      setRemoteRecipes(normalized);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <SearchBar value={query} onChange={setQuery} />

      <button className="primary-btn" type="button" onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Recipes"}
      </button>
      {error && <p className="muted">{error}</p>}

      <FilterChips
        label="Cuisine"
        options={["All", "Indian", "Asian", "Global"]}
        value={cuisine}
        onChange={setCuisine}
      />
      <FilterChips
        label="Spice"
        options={["All", "Low", "Medium", "High"]}
        value={spice}
        onChange={setSpice}
      />
      <FilterChips
        label="Time"
        options={["Any", "<20", "20-30", "30+"]}
        value={time}
        onChange={setTime}
      />

      <h2 className="result-title">{filtered.length} Recipes Found</h2>

      <div className="results-grid">
        {filtered.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onToggleSave={onToggleSave}
            saved={savedIds.has(recipe.id)}
          />
        ))}
      </div>
    </section>
  );
}
