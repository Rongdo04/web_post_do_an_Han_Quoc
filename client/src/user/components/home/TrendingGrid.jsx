import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { recipesAPI } from "../../../services/recipesAPI.js";
import { FaStar, FaClock, FaUsers, FaBookmark } from "react-icons/fa";

function CardSkeleton() {
  return (
    <div className="animate-pulse space-y-3 overflow-hidden rounded-2xl border border-black/5 bg-white p-3">
      <div className="aspect-[4/3] rounded-xl bg-black/10" />
      <div className="h-4 w-3/4 rounded bg-black/10" />
      <div className="h-3 w-1/2 rounded bg-black/10" />
    </div>
  );
}

function Stars({ value = 0 }) {
  const n = Math.round(Number(value) || 0);
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar
          key={i}
          className={`h-3 w-3 ${i < n ? "opacity-100" : "opacity-25"}`}
        />
      ))}
    </span>
  );
}

export default function TrendingGrid({ limit = 6 }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrendingRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await recipesAPI.getTrending({ limit, sort: "rating" });
      setRecipes(data);
    } catch (err) {
      console.error("Error loading trending recipes:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingRecipes();
  }, [limit]);

  const resolveImage = (recipe) => {
    const img = recipe.images?.[0];
    if (!img) return recipe.image || null;
    if (typeof img === "string") return img;
    return (
      img.url ||
      img.thumbnailUrl ||
      (img.filename ? `/uploads/${img.filename}` : null)
    );
  };

  return (
    <section className="pb-14" aria-labelledby="trending-title">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            id="trending-title"
            className="font-serif text-3xl font-bold text-hub-ink md:text-4xl"
          >
            Công Thức Xu Hướng
          </h2>
          <p className="mt-2 max-w-xl text-sm text-hub-muted">
            Những món ăn được cộng đồng yêu thích và đánh giá cao nhất trong tuần.
          </p>
        </div>
        <Link
          to="/recipes"
          className="text-sm font-semibold uppercase tracking-wide text-brand-maroon hover:underline"
        >
          Xem tất cả công thức &gt;
        </Link>
      </div>

      {error ? (
        <div className="rounded-2xl border border-black/8 bg-white p-8 text-center">
          <p className="mb-3 text-sm text-hub-muted">
            Không thể tải công thức nổi bật
          </p>
          <button type="button" onClick={fetchTrendingRecipes} className="btn-brand">
            Thử lại
          </button>
        </div>
      ) : loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: limit }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="rounded-2xl border border-black/8 bg-white p-10 text-center text-sm text-hub-muted">
          Chưa có công thức nổi bật nào
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => {
            const imageUrl = resolveImage(recipe);
            const total =
              (recipe.prepTime || 0) + (recipe.cookTime || 0);
            const rating = recipe.ratingAvg || 0;
            return (
              <Link
                key={recipe._id}
                to={`/recipes/${recipe.slug}`}
                className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-brand"
              >
                <article>
                  <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={recipe.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-hub-muted">
                        Không có ảnh
                      </div>
                    )}
                    <span className="absolute left-3 top-3 rounded bg-brand-maroon px-2.5 py-1 text-[11px] font-semibold text-white">
                      {recipe.category || "Công thức"}
                    </span>
                    <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-hub-muted shadow-sm">
                      <FaBookmark className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <div className="space-y-3 p-5">
                    <h3 className="line-clamp-2 font-serif text-lg font-semibold text-hub-ink group-hover:text-brand-maroon">
                      {recipe.title}
                    </h3>
                    <p className="text-sm text-hub-muted">
                      bởi {recipe.author?.name || recipe.authorName || "Đầu bếp"}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-hub-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <FaClock /> {total > 0 ? `${total} phút` : "—"}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <FaUsers /> {recipe.servings || 2} người
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-black/5 pt-3">
                      <span className="inline-flex items-center gap-2 text-sm font-medium">
                        <Stars value={rating} />
                        <span className="text-hub-ink">
                          {rating > 0 ? rating.toFixed(1) : "0.0"}
                        </span>
                      </span>
                      <span className="text-sm font-medium text-brand-maroon">
                        Xem chi tiết
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
