import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterChips from "../components/FilterChips";
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";
import { featuredRecipe, trendingRecipes } from "../data/mockData";

const tags = ["All", "Vegan", "Healthy", "Quick", "Indian", "Asian"];

export default function Home({ onToggleSave, savedIds }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  const filteredTrending = useMemo(() => {
    return trendingRecipes.filter((recipe) => {
      const tagMatch = selectedTag === "All" || recipe.cuisine === selectedTag;
      const textMatch = recipe.title.toLowerCase().includes(search.toLowerCase());
      return tagMatch && textMatch;
    });
  }, [search, selectedTag]);

  return (
    <section className="page home-page">
      <SearchBar value={search} onChange={setSearch} />

      <FilterChips label="Category" options={tags} value={selectedTag} onChange={setSelectedTag} />

      <article className="card hero-card" onClick={() => navigate(`/recipe/${featuredRecipe.id}`)}>
        <img src={featuredRecipe.image} alt={featuredRecipe.title} />
        <div>
          <small>CURATED BY AI</small>
          <h2>{featuredRecipe.title}</h2>
          <p>{featuredRecipe.tags.join(" • ")}</p>
        </div>
      </article>

      <section className="section-header">
        <h2>Trending Recipes</h2>
      </section>
      <div className="horizontal-scroll">
        {filteredTrending.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            compact
            recipe={recipe}
            onToggleSave={onToggleSave}
            saved={savedIds.has(recipe.id)}
          />
        ))}
      </div>

      <section className="card ai-rec-card">
        <h3>💡 Recommended for You</h3>
        <p>
          Based on your saved recipes and preference for medium spice, try combining coconut milk,
          lemongrass, and mushrooms for a fast weeknight Asian curry.
        </p>
      </section>

      <button className="fab" type="button" aria-label="Add recipe">
        +
      </button>
    </section>
  );
}
