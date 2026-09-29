import React from "react";

export default function SortBar({ sort, onSort, total }) {
  const sortOptions = [
    { value: "newest", label: "Mới nhất" },
    { value: "oldest", label: "Cũ nhất" },
    { value: "rating", label: "Đánh giá cao" },
    { value: "popular", label: "Phổ biến" },
    { value: "title", label: "A-Z" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-hub-muted">Sắp xếp:</span>
        <select
          value={sort}
          onChange={(e) => onSort(e.target.value)}
          className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-maroon/25"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="text-xs text-hub-muted">{total} công thức</div>
    </div>
  );
}
