import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { taxonomyAPI } from "../../../services/taxonomyAPI.js";

const FALLBACK = [
  { id: "all", name: "Tất cả", slug: "", icon: "✦" },
  { id: "1", name: "Món nước", slug: "mon-nuoc", icon: "🍜" },
  { id: "2", name: "Ăn kiêng", slug: "an-kieng", icon: "🥗" },
  { id: "3", name: "Nhanh gọn", slug: "nhanh-gon", icon: "⚡" },
  { id: "4", name: "Gia đình", slug: "gia-dinh", icon: "👨‍👩‍👧" },
  { id: "5", name: "Đặc sản", slug: "dac-san", icon: "🏆" },
];

export default function CategoryChips({ limit = 6 }) {
  const [categories, setCategories] = useState(FALLBACK);
  const [active, setActive] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await taxonomyAPI.getCategories();
        if (Array.isArray(data) && data.length > 0) {
          setCategories([
            { id: "all", name: "Tất cả", slug: "", icon: "✦" },
            ...data.slice(0, limit - 1),
          ]);
        }
      } catch (err) {
        console.error("Error loading categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [limit]);

  const handleClick = (category) => {
    setActive(category.id);
    if (!category.slug) {
      navigate("/recipes");
      return;
    }
    navigate(
      `/recipes?category=${encodeURIComponent(category.slug || category.name)}`,
    );
  };

  return (
    <section className="py-10" aria-labelledby="quick-cats-title">
      <div className="mb-6 flex items-center justify-center gap-4">
        <span className="h-px w-16 bg-black/15" />
        <h2
          id="quick-cats-title"
          className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-hub-muted"
        >
          Tìm kiếm theo danh mục
        </h2>
        <span className="h-px w-16 bg-black/15" />
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-11 w-28 animate-pulse rounded-full bg-black/10"
              />
            ))
          : categories.map((category) => {
              const isActive = active === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleClick(category)}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-brand-maroon text-white shadow-brand"
                      : "border border-black/10 bg-white text-hub-ink hover:border-brand-maroon/40 hover:text-brand-maroon"
                  }`}
                >
                  {category.icon && (
                    <span className="text-base">{category.icon}</span>
                  )}
                  {category.name}
                </button>
              );
            })}
      </div>
    </section>
  );
}
