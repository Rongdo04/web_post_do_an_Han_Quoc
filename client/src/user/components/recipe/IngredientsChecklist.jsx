import React, { useState, useEffect } from "react";
import { FaUtensils, FaUserFriends } from "react-icons/fa";

export default function IngredientsChecklist({ list = [], servings }) {
  const [checked, setChecked] = useState(() => new Set());

  useEffect(() => {
    setChecked(new Set());
  }, [list]);

  const toggle = (item) => {
    setChecked((prev) => {
      const n = new Set(prev);
      if (n.has(item)) n.delete(item);
      else n.add(item);
      return n;
    });
  };

  return (
    <div className="card space-y-5 p-6" aria-labelledby="ingredients-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3
          id="ingredients-title"
          className="flex items-center gap-2 font-serif text-xl text-brand-maroon"
        >
          <FaUtensils className="text-base" />
          Nguyên liệu
        </h3>
        {servings != null && (
          <span className="chip !cursor-default !py-1.5 !text-xs">
            <FaUserFriends />
            {servings} phần ăn
          </span>
        )}
      </div>

      <ul className="grid gap-3 rounded-2xl bg-hub-bg p-4 sm:grid-cols-2">
        {list.map((ing, idx) => {
          const id = `ing-${idx}`;
          const done = checked.has(ing);
          const name =
            typeof ing === "string"
              ? ing
              : ing.name || "Nguyên liệu";
          const amount =
            typeof ing === "string"
              ? ""
              : `${ing.amount || ""}${ing.unit ? ` ${ing.unit}` : ""}${
                  ing.notes ? ` (${ing.notes})` : ""
                }`.trim();

          return (
            <li key={idx} className="flex items-start gap-3">
              <input
                id={id}
                type="checkbox"
                checked={done}
                onChange={() => toggle(ing)}
                className="mt-1 accent-brand-maroon"
                aria-label={`Đánh dấu nguyên liệu: ${name}`}
              />
              <label
                htmlFor={id}
                className={`flex flex-1 items-baseline justify-between gap-2 text-sm select-none ${
                  done ? "line-through opacity-50" : ""
                }`}
              >
                <span className="font-semibold text-hub-ink">{name}</span>
                {amount && (
                  <span className="shrink-0 font-medium text-brand-maroon">
                    {amount}
                  </span>
                )}
              </label>
            </li>
          );
        })}
      </ul>
      {list.length === 0 && (
        <p className="text-xs text-hub-muted">Chưa có thông tin nguyên liệu.</p>
      )}
    </div>
  );
}
