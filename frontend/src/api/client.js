const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.message || `Request failed (${response.status})`);
  }

  return body;
}

export async function searchRecipesByIngredients({ ingredients, cuisine = "All", spiceLevel = "medium", maxCookingTime = 60 }) {
  const query = new URLSearchParams({
    ingredients,
    cuisine,
    spiceLevel,
    maxCookingTime: String(maxCookingTime)
  }).toString();

  return apiFetch(`/recipes?${query}`);
}
