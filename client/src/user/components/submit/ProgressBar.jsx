import React from "react";

const STEP_LABELS = [
  "Thông tin",
  "Nguyên liệu",
  "Các bước",
  "Hình ảnh",
  "Xem trước",
];

export default function ProgressBar({ current, total }) {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div
      className="mb-2 space-y-3"
      aria-label={`Tiến độ: bước ${current + 1} / ${total}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-hub-muted">
        <span>
          Bước {current + 1} / {total}
          {STEP_LABELS[current] ? ` — ${STEP_LABELS[current]}` : ""}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition ${
              i <= current ? "bg-brand-maroon" : "bg-black/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
