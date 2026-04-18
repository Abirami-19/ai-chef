import RecipeCard from "../components/RecipeCard";
import { trendingRecipes } from "../data/mockData";

export default function Favorites({ savedIds, onToggleSave }) {
  const savedRecipes = trendingRecipes.filter((recipe) => savedIds.has(recipe.id));

  return (
    <section className="page">
      <section className="section-header">
        <h2>Saved Recipes</h2>
      </section>

      {savedRecipes.length === 0 ? (
        <article className="card empty-state">
          <p>No saved recipes yet. Tap the heart icon to build your collection.</p>
        </article>
      ) : (
        <div className="results-grid">
          {savedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              saved
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      )}
    </section>
  );
}
