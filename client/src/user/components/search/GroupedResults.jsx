import React, { useState, useEffect } from "react";
import { recipesAPI } from "../../../services/recipesAPI.js";
import { FaStar } from "react-icons/fa";
// Real search with API
export default function GroupedResults({ query }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const q = query.trim().toLowerCase();

  useEffect(() => {
    if (!q) {
      setRecipes([]);
      return;
    }

    const searchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await recipesAPI.getRecipes({
          search: q,
          limit: 20,
          page: 1,
        });
        setRecipes(result.data || []);
      } catch (err) {
        console.error("Search error:", err);
        setError(err);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    searchRecipes();
  }, [q]);

  if (!q) return null;

  if (loading) {
    return (
      <div className="rounded-[28px] border border-[rgba(74,23,23,0.08)] bg-[rgba(255,250,242,0.92)] p-8 text-center shadow-[0_18px_44px_-36px_rgba(74,23,23,0.45)]">
        <div className="flex items-center justify-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#7f1d1d] border-t-transparent"></div>
          <span className="text-sm text-[#6f5b4f]">Đang tìm kiếm...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 rounded-[28px] border border-[rgba(74,23,23,0.08)] bg-[rgba(255,250,242,0.92)] p-8 text-center shadow-[0_18px_44px_-36px_rgba(74,23,23,0.45)]">
        <p className="text-sm text-[#6f5b4f]">Có lỗi xảy ra khi tìm kiếm.</p>
        <p className="text-xs text-[#9a6b47]">Vui lòng thử lại sau.</p>
      </div>
    );
  }

  // Extract ingredients from search results
  const ingredientSet = new Set();
  recipes.forEach((r) =>
    r.ingredients?.forEach((ingredient) => {
      const name =
        typeof ingredient === "string" ? ingredient : ingredient.name;
      if (name && name.toLowerCase().includes(q)) {
        ingredientSet.add(name);
      }
    }),
  );
  const ingredients = Array.from(ingredientSet).slice(0, 15);

  // Extract tags and categories
  const tagSet = new Set();
  recipes.forEach((r) => {
    r.tags?.forEach((t) => t.toLowerCase().includes(q) && tagSet.add(t));
    if (r.category && r.category.toLowerCase().includes(q))
      tagSet.add(r.category);
  });
  const tags = Array.from(tagSet).slice(0, 15);

  const empty =
    recipes.length === 0 && ingredients.length === 0 && tags.length === 0;

  if (empty) {
    const tryKeywords = [
      "kimchi",
      "bibimbap",
      "japchae",
      "bulgogi",
      "mandu",
      "tteokguk",
    ];
    return (
      <div className="space-y-4 rounded-[28px] border border-[rgba(74,23,23,0.08)] bg-[rgba(255,250,242,0.92)] p-8 text-center shadow-[0_18px_44px_-36px_rgba(74,23,23,0.45)]">
        <p className="text-sm text-[#6f5b4f]">Không tìm thấy kết quả.</p>
        <p className="text-xs uppercase tracking-[0.18em] text-[#9a6b47]">
          Gợi ý thử
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {tryKeywords.map((k) => (
            <span
              key={k}
              className="rounded-full border border-[rgba(74,23,23,0.08)] bg-[#fff5e8] px-3 py-1.5 text-[11px] font-medium text-[#7f1d1d]"
            >
              {k}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10" aria-label="Kết quả tìm kiếm">
      {/* Recipes */}
      {recipes.length > 0 && (
        <section aria-labelledby="result-recipes-title" className="space-y-4">
          <h2
            id="result-recipes-title"
            className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6b47]"
          >
            Món ({recipes.length})
          </h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((r) => {
              // Handle image URL similar to TrendingGrid
              let imageUrl = null;
              if (r?.images?.[0]) {
                if (typeof r.images[0] === "string") {
                  imageUrl = r.images[0];
                } else if (r.images[0]?.url) {
                  imageUrl = r.images[0].url;
                } else if (r.images[0]?.filename) {
                  imageUrl = `/uploads/${r.images[0].filename}`;
                }
              }

              const totalTime = (r.prepTime || 0) + (r.cookTime || 0);
              const rating = r.ratingAvg || 0;

              return (
                <li key={r._id || r.id} className="group">
                  <a
                    href={`/recipes/${r.slug}`}
                    className="block overflow-hidden rounded-[24px] border border-[rgba(74,23,23,0.08)] bg-[rgba(255,250,242,0.95)] shadow-[0_16px_40px_-34px_rgba(74,23,23,0.42)] transition hover:-translate-y-1 hover:shadow-brand"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-[#d8c5ab]/40">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={r.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-medium text-[#7f1d1d]">
                          IMG
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 p-4">
                      <h3 className="line-clamp-2 font-serif text-base font-semibold leading-snug text-[#311818]">
                        {r.title}
                      </h3>
                      <p className="line-clamp-2 text-[11px] text-[#6f5b4f]">
                        {r.summary || r.description || ""}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="rounded-full bg-[#f4e5d3] px-2.5 py-1 text-[10px] font-medium text-[#5d3029]">
                          {totalTime > 0 ? `${totalTime}′` : "Chưa có"}
                        </span>
                        <span className="rounded-full bg-[#f4e5d3] px-2.5 py-1 text-[10px] font-medium text-[#5d3029]">
                          <FaStar className="mr-1 inline text-[#b45309]" />{" "}
                          {rating > 0 ? rating.toFixed(1) : "0.0"}
                        </span>
                      </div>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Ingredients */}
      {ingredients.length > 0 && (
        <section
          aria-labelledby="result-ingredients-title"
          className="space-y-4"
        >
          <h2
            id="result-ingredients-title"
            className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6b47]"
          >
            Nguyên liệu ({ingredients.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ing) => (
              <span
                key={ing}
                className="rounded-full border border-[rgba(74,23,23,0.08)] bg-[#fff5e8] px-3 py-1.5 text-[11px] font-medium text-[#7f1d1d]"
              >
                {ing}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <section aria-labelledby="result-tags-title" className="space-y-4">
          <h2
            id="result-tags-title"
            className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6b47]"
          >
            Thẻ ({tags.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[rgba(74,23,23,0.08)] bg-[#fff5e8] px-3 py-1.5 text-[11px] font-medium text-[#7f1d1d]"
              >
                {t}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
