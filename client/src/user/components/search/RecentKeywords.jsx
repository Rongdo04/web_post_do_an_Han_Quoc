import React, { useEffect, useState } from "react";

export default function RecentKeywords({ onSelect }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("recent_keywords") || "[]",
      );
      setItems(stored);
    } catch {
      setItems([]);
    }
  }, []);

  if (!items.length) return null;

  return (
    <div
      className="space-y-3 rounded-[24px] border border-[rgba(74,23,23,0.08)] bg-[rgba(255,250,242,0.92)] p-5 shadow-[0_18px_44px_-36px_rgba(74,23,23,0.45)]"
      aria-labelledby="recent-kw-title"
    >
      <h3
        id="recent-kw-title"
        className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9a6b47]"
      >
        Từ khóa gần đây
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((k) => (
          <button
            key={k}
            onClick={() => onSelect?.(k)}
            className="rounded-full border border-[rgba(74,23,23,0.08)] bg-[#fff5e8] px-3 py-1.5 text-[11px] font-medium text-[#7f1d1d] transition hover:bg-[#f4e5d3] focus:outline-none focus:ring-2 focus:ring-[#d4a373]/70"
            aria-label={`Tìm với từ khóa ${k}`}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}
