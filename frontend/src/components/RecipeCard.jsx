import { Link } from "react-router-dom";

export default function RecipeCard({ recipe, compact = false, onToggleSave, saved }) {
  return (
    <article className={`card recipe-card ${compact ? "compact" : ""}`}>
      <img src={recipe.image} alt={recipe.title} />
      <div className="recipe-content">
        <div className="recipe-top-row">
          <h3>{recipe.title}</h3>
          <button type="button" onClick={() => onToggleSave?.(recipe)} className="bookmark-btn">
            {saved ? "♥" : "♡"}
          </button>
        </div>
        <p>{recipe.cuisine}</p>
        <div className="meta-row">
          <span>{recipe.time} min</span>
          <span>⭐ {recipe.rating}</span>
        </div>
        <Link to={`/recipe/${recipe.id}`} className="primary-btn inline-btn">
          View Recipe
        </Link>
      </div>
    </article>
  );
}
