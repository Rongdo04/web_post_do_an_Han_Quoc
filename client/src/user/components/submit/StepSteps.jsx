import React, { useState } from "react";

export default function StepSteps({ data, onChange, errors }) {
  const [input, setInput] = useState("");

  const addStep = () => {
    if (!input.trim()) return;

    const newStep = {
      order: data.steps.length + 1,
      title: "",
      description: input.trim(),
      duration: 0,
      temperature: "",
      images: [],
    };

    onChange({ ...data, steps: [...data.steps, newStep] });
    setInput("");
  };

  const updateStep = (idx, field, val) => {
    const list = [...data.steps];
    if (typeof list[idx] === "string") {
      list[idx] = {
        order: idx + 1,
        title: "",
        description: list[idx],
        duration: 0,
        temperature: "",
        images: [],
      };
    }
    list[idx] = { ...list[idx], [field]: val };
    onChange({ ...data, steps: list });
  };

  const removeStep = (idx) => {
    const newSteps = data.steps.filter((_, i) => i !== idx);
    const reorderedSteps = newSteps.map((step, index) => {
      if (typeof step === "object") {
        return { ...step, order: index + 1 };
      }
      return step;
    });
    onChange({ ...data, steps: reorderedSteps });
  };

  const move = (idx, dir) => {
    const list = [...data.steps];
    const target = idx + dir;
    if (target < 0 || target >= list.length) return;
    [list[idx], list[target]] = [list[target], list[idx]];

    const reorderedSteps = list.map((step, index) => {
      if (typeof step === "object") {
        return { ...step, order: index + 1 };
      }
      return step;
    });
    onChange({ ...data, steps: reorderedSteps });
  };

  return (
    <div className="card space-y-5 p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="font-serif text-lg text-brand-maroon">
            Các bước thực hiện *
          </h3>
          <p className="text-xs text-hub-muted">
            Mô tả rõ ràng, mỗi hành động một bước.
          </p>
          {errors.steps && (
            <p className="text-[11px] font-medium text-rose-600">
              {errors.steps}
            </p>
          )}
        </div>
        <button type="button" onClick={addStep} className="btn-brand !py-2">
          + Thêm bước
        </button>
      </header>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ví dụ: Phi thơm hành, thêm cà chua..."
          className="input flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addStep();
            }
          }}
        />
        <button type="button" onClick={addStep} className="btn-brand">
          Thêm
        </button>
      </div>
      {data.steps.length === 0 && (
        <p className="text-xs text-hub-muted">Chưa có bước nào.</p>
      )}
      <ol className="space-y-3">
        {data.steps.map((st, idx) => {
          const stepDescription =
            typeof st === "string" ? st : st.description || "";

          return (
            <li key={idx} className="flex items-start gap-3">
              <span className="mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-hub-bg text-sm font-semibold text-hub-muted">
                {idx + 1}
              </span>
              <textarea
                value={stepDescription}
                onChange={(e) =>
                  updateStep(idx, "description", e.target.value)
                }
                className="input min-h-[72px] flex-1"
                placeholder="Mô tả bước thực hiện"
              />
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => move(idx, -1)}
                  className="rounded-lg bg-hub-bg px-2 py-1 text-xs text-hub-ink"
                  aria-label="Lên"
                  disabled={idx === 0}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(idx, 1)}
                  className="rounded-lg bg-hub-bg px-2 py-1 text-xs text-hub-ink"
                  aria-label="Xuống"
                  disabled={idx === data.steps.length - 1}
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeStep(idx)}
                  className="rounded-lg bg-rose-600 px-2 py-1 text-xs text-white"
                >
                  Xoá
                </button>
              </div>
            </li>
          );
        })}
      </ol>
      {data.steps.length > 0 && (
        <button
          type="button"
          onClick={addStep}
          className="w-full rounded-xl border border-dashed border-black/15 py-3 text-sm font-medium text-brand-maroon hover:bg-hub-bg"
        >
          + Tiếp tục thêm bước thực hiện
        </button>
      )}
    </div>
  );
}
