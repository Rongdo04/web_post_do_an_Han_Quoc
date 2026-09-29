import React, { useState, useEffect } from "react";
import { taxonomyAPI } from "../../../services/taxonomyAPI.js";

export default function FilterPanel({
  search,
  onSearch,
  category,
  onCategory,
  total,
  onClearAll,
}) {
  const [categories, setCategories] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await taxonomyAPI.getCategories();
        setCategories(categoriesData || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const chips = [
    { id: "", name: "Tất cả" },
    ...categories.map((c) => ({
      id: c.slug || c._id || c.id,
      name: c.name,
    })),
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Tìm kiếm theo tên món ăn hoặc nguyên liệu..."
            className="w-full rounded-xl border border-black/10 bg-white py-3 pl-4 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-maroon/25"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${
            showAdvanced || category
              ? "bg-brand-brown"
              : "bg-brand-brown hover:brightness-110"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 5h18M6 12h12M10 19h4"
            />
          </svg>
          Lọc nâng cao
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-hub-muted">
          Danh mục
        </span>
        {chips.slice(0, 10).map((chip) => {
          const active =
            (!category && !chip.id) ||
            category === chip.id ||
            category === chip.name;
          return (
            <button
              key={chip.id || "all"}
              type="button"
              onClick={() => onCategory(chip.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-brand-brown text-white"
                  : "border border-black/10 bg-white text-hub-ink hover:border-brand-brown/40"
              }`}
            >
              {chip.name}
            </button>
          );
        })}
        {(search || category) && (
          <button
            type="button"
            onClick={onClearAll}
            className="ml-auto text-sm font-medium text-brand-maroon hover:underline"
          >
            Xóa bộ lọc · {total} kết quả
          </button>
        )}
      </div>

      {showAdvanced && (
        <div className="rounded-xl border border-black/8 bg-white p-4 text-sm text-hub-muted">
          Chọn danh mục phía trên để lọc nhanh. Kết quả hiện tại:{" "}
          <strong className="text-hub-ink">{total}</strong>
        </div>
      )}
    </div>
  );
}
