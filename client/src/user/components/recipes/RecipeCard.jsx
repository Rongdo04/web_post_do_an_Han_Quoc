import React from "react";
import { Link } from "react-router-dom";
import { FaClock, FaStar, FaUsers, FaBookmark } from "react-icons/fa";

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

export default function RecipeCard({ recipe }) {
  const images = Array.isArray(recipe?.images) ? recipe.images : [];
  const isVideoItem = (item) => {
    if (!item || typeof item === "string") return false;
    if (item.type === "video") return true;
    if (item.mimeType && String(item.mimeType).startsWith("video")) return true;
    const src = item.url || item.src || item.filename || "";
    return /(\.mp4|\.webm|\.mov|\.avi)$/i.test(String(src));
  };

  const firstVideo = images.find((m) => isVideoItem(m));
  const firstImage = images.find((m) => !isVideoItem(m)) || images[0];
  const videoThumb = firstVideo?.thumbnailUrl || null;
  const videoSrc =
    (typeof firstVideo === "string" ? firstVideo : firstVideo?.url) || null;
  const imageThumb = firstImage?.thumbnailUrl || null;
  const imageSrc =
    (typeof firstImage === "string"
      ? firstImage
      : firstImage?.url ||
        (firstImage?.filename ? `/uploads/${firstImage.filename}` : null)) ||
    null;
  const hasVideo = Boolean(firstVideo);
  const imageUrl =
    (hasVideo ? videoThumb || videoSrc : imageThumb || imageSrc) ||
    recipe?.image ||
    null;

  const totalMins = (recipe.prepTime || 0) + (recipe.cookTime || 0);
  const rating = recipe.ratingAvg || 0;
  const ratingLabel = rating > 0 ? rating.toFixed(1) : "0.0";

  return (
    <Link
      to={`/recipes/${recipe.slug}`}
      className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-brand"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={recipe.title || "Recipe thumbnail"}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
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
        <h3 className="line-clamp-2 font-serif text-lg font-semibold text-hub-ink transition group-hover:text-brand-maroon">
          {recipe.title}
        </h3>
        <p className="text-sm text-hub-muted">
          bởi {recipe.author?.name || recipe.authorName || "Đầu bếp"}
        </p>
        <div className="flex items-center gap-4 text-xs text-hub-muted">
          <span className="inline-flex items-center gap-1.5">
            <FaClock /> {totalMins > 0 ? `${totalMins} phút` : "—"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FaUsers /> {recipe.servings || 2} người
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-black/5 pt-3">
          <span className="inline-flex items-center gap-2 text-sm font-medium">
            <Stars value={rating} />
            <span>{ratingLabel}</span>
          </span>
          <span className="text-sm font-medium text-brand-maroon">
            Xem chi tiết
          </span>
        </div>
      </div>
    </Link>
  );
}
