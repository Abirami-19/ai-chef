import { Link, useNavigate, useParams } from "react-router-dom";
import { recipeDetails } from "../data/mockData";

export default function Recipe({ onToggleSave, savedIds }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const recipe = { ...recipeDetails, id };
  const saved = savedIds.has(id);

  return (
    <section className="page">
      <article className="card recipe-detail-hero">
        <img src={recipe.image} alt={recipe.title} />
        <div className="recipe-detail-header">
          <h2>{recipe.title}</h2>
          <p>
            ⭐ {recipe.rating} • {recipe.time} min
          </p>
          <div className="button-row">
            <button className="primary-btn" onClick={() => navigate(`/cooking/${recipe.id}`)}>
              Start Cooking
            </button>
            <button className="ghost-btn" onClick={() => onToggleSave(recipe)}>
              {saved ? "Saved ♥" : "Save"}
            </button>
          </div>
        </div>
      </article>

      <section className="card ingredients-card">
        <h3>Ingredients</h3>
        <ul className="check-list">
          {recipe.ingredients.map((ingredient) => (
            <li key={ingredient}>
              <label>
                <input type="checkbox" /> {ingredient}
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="steps-stack">
        <h3>Preparation</h3>
        {recipe.steps.map((step, index) => (
          <article key={step} className="step-card">
            <small>STEP {index + 1}</small>
            <p>{step}</p>
          </article>
        ))}
      </section>

      <Link to={`/cooking/${recipe.id}`} className="primary-btn sticky-start">
        Start Guided Cooking
      </Link>
    </section>
  );
}
