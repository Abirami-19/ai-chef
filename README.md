# AI Chef - Full-Stack AI Cooking Assistant

AI Chef is a production-style full-stack web application that recommends recipes from user-provided ingredients and enriches recipe experiences using AI.

## Highlights
- Ingredient-first recipe search with intelligent relevance scoring.
- Hybrid recipe pipeline using:
  - External recipe providers (Spoonacular / Edamam-ready adapters)
  - AI enhancements (tips, substitutions, variants, improved instructions)
  - AI recipe fallback when API results are sparse.
- Cuisine-aware ranking (Indian and Asian prioritized by default).
- Rich recipe detail pages (comments, related recipes, cooking intelligence).
- User profiles with favorites, preferences, and comment history.
- Minimal beige + soft-neutral UI with card-based, mobile-first layouts and guided cooking mode.

## Monorepo Structure

```
.
├── backend
│   └── src
└── frontend
    └── src
```

## Tech Stack
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **AI:** Gemini API (default) with Hugging Face fallback-style abstraction
- **External APIs:** Spoonacular-style endpoint integration

## Run Locally

```bash
# install dependencies
npm install --prefix backend
npm install --prefix frontend

# run backend
npm run dev --prefix backend

# run frontend
npm run dev --prefix frontend
```


## Frontend Screens
- Home Discovery (`/`)
- Search Results (`/search`)
- Recipe Details (`/recipe/:id`)
- Favorites (`/favorites`)
- Profile (`/profile`)
- Cooking Mode (`/cooking/:id`)

## API Endpoints (summary)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/recipes/search`
- `GET /api/recipes/:id`
- `POST /api/recipes/:id/comments`
- `GET /api/users/me`
- `PATCH /api/users/me/preferences`
- `POST /api/users/me/favorites/:recipeId`

## Notes
- This codebase is production-oriented and modular, but API keys and external integrations must be configured before end-to-end use.
- For AI usage costs and quotas, configure provider limits and caching in production.
