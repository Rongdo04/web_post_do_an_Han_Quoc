import React, { useState } from "react";

export default function StepIngredients({ data, onChange, errors }) {
  const [input, setInput] = useState("");

  const addIng = () => {
    if (!input.trim()) return;

    const newIngredient = {
      name: input.trim(),
      amount: "",
      unit: "",
      notes: "",
    };

    onChange({ ...data, ingredients: [...data.ingredients, newIngredient] });
    setInput("");
  };

  const updateIng = (idx, field, val) => {
    const list = [...data.ingredients];
    if (typeof list[idx] === "string") {
      list[idx] = {
        name: list[idx],
        amount: "",
        unit: "",
        notes: "",
      };
    }
    list[idx] = { ...list[idx], [field]: val };
    onChange({ ...data, ingredients: list });
  };

  const removeIng = (idx) => {
    onChange({
      ...data,
      ingredients: data.ingredients.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="card space-y-5 p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="font-serif text-lg text-brand-maroon">Nguyên liệu *</h3>
          <p className="text-xs text-hub-muted">
            Thêm tối thiểu 1 nguyên liệu. Giữ ngắn gọn và định lượng rõ ràng.
          </p>
          {errors.ingredients && (
            <p className="text-[11px] font-medium text-rose-600">
              {errors.ingredients}
            </p>
          )}
        </div>
        <button type="button" onClick={addIng} className="btn-brand !py-2">
          + Thêm nguyên liệu
        </button>
      </header>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ví dụ: 200g đậu hũ non"
          className="input flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addIng();
            }
          }}
        />
        <button type="button" onClick={addIng} className="btn-brand">
          Thêm
        </button>
      </div>
      {data.ingredients.length === 0 && (
        <p className="text-xs text-hub-muted">Chưa có nguyên liệu nào.</p>
      )}
      <ul className="space-y-2">
        {data.ingredients.map((ing, idx) => {
          const ingredientName = typeof ing === "string" ? ing : ing.name || "";

          return (
            <li key={idx} className="flex flex-wrap gap-2 items-start">
              <input
                value={ingredientName}
                onChange={(e) => updateIng(idx, "name", e.target.value)}
                className="input flex-1 min-w-[140px]"
                placeholder="Tên nguyên liệu"
              />
              <input
                value={
                  typeof ing === "object"
                    ? `${ing.amount || ""}${ing.unit ? ` ${ing.unit}` : ""}`.trim()
                    : ""
                }
                onChange={(e) => {
                  const list = [...data.ingredients];
                  const current =
                    typeof list[idx] === "string"
                      ? { name: list[idx], amount: "", unit: "", notes: "" }
                      : { ...list[idx] };
                  list[idx] = { ...current, amount: e.target.value, unit: "" };
                  onChange({ ...data, ingredients: list });
                }}
                className="input w-36"
                placeholder="Định lượng"
              />
              <button
                type="button"
                onClick={() => removeIng(idx)}
                className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-medium text-white"
              >
                Xoá
              </button>
            </li>
          );
        })}
      </ul>
      {data.ingredients.length > 0 && (
        <button
          type="button"
          onClick={addIng}
          className="w-full rounded-xl border border-dashed border-black/15 py-3 text-sm font-medium text-brand-maroon hover:bg-hub-bg"
        >
          + Thêm nguyên liệu khác
        </button>
      )}
    </div>
  );
}
