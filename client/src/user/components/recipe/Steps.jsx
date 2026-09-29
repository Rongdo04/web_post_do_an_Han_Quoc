import React, { useState, useEffect } from "react";
import { FaCheck, FaClock, FaThermometerHalf } from "react-icons/fa";

export default function Steps({ steps = [], tip }) {
  const [done, setDone] = useState(() => new Set());
  useEffect(() => setDone(new Set()), [steps]);

  const toggle = (id) => {
    setDone((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  return (
    <div className="card space-y-5 p-6" aria-labelledby="steps-title">
      <h3
        id="steps-title"
        className="font-serif text-xl text-brand-maroon"
      >
        Các bước thực hiện
      </h3>
      <ol className="space-y-4">
        {steps.map((s, idx) => {
          const finished = done.has(s.id || idx);
          return (
            <li
              key={s.id || idx}
              className={`flex items-start gap-4 ${finished ? "opacity-60" : ""}`}
            >
              <button
                type="button"
                onClick={() => toggle(s.id || idx)}
                aria-label={
                  finished
                    ? `Bỏ đánh dấu bước ${idx + 1}`
                    : `Đánh dấu hoàn thành bước ${idx + 1}`
                }
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition ${
                  finished
                    ? "bg-brand-maroon text-white"
                    : "bg-hub-bg text-hub-muted hover:bg-brand-maroon/10 hover:text-brand-maroon"
                }`}
              >
                {finished ? <FaCheck className="h-3 w-3" /> : idx + 1}
              </button>
              <div className="flex-1 whitespace-pre-line text-sm leading-relaxed text-hub-ink">
                {s.description ||
                  s.text ||
                  (typeof s === "string" ? s : "Bước thực hiện")}
                {s.duration && s.duration > 0 && (
                  <div className="mt-2 text-xs font-medium text-brand-maroon">
                    <FaClock className="mr-1 inline h-3 w-3" /> {s.duration}{" "}
                    phút
                  </div>
                )}
                {s.temperature && (
                  <div className="mt-1 text-xs text-hub-muted">
                    <FaThermometerHalf className="mr-1 inline h-3 w-3" />{" "}
                    {s.temperature}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {steps.length === 0 && (
        <p className="text-xs text-hub-muted">Chưa có hướng dẫn thực hiện.</p>
      )}
      {tip && (
        <div className="rounded-2xl border border-brand-green/20 bg-brand-green/5 p-4">
          <p className="mb-1 text-sm font-semibold text-brand-green">
            Mẹo nhỏ từ đầu bếp
          </p>
          <p className="text-sm text-hub-ink">{tip}</p>
        </div>
      )}
    </div>
  );
}
