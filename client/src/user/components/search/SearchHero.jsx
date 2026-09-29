import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SUGGESTIONS = [
  "kimchi",
  "bibimbap",
  "tteokbokki",
  "kimbap",
  "bulgogi",
  "miyeok-guk",
  "japchae",
  "mandu",
];

export default function SearchHero({ onSubmitKeyword }) {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialQ = params.get("query") || params.get("q") || "";
  const [value, setValue] = useState(initialQ);
  const [focusSug, setFocusSug] = useState(-1);

  useEffect(() => {
    setValue(initialQ);
  }, [initialQ]);

  const doSearch = (kw) => {
    const q = (kw ?? value).trim();
    if (!q) return;
    // store recent keywords
    const recents = JSON.parse(localStorage.getItem("recent_keywords") || "[]");
    const updated = [q, ...recents.filter((k) => k !== q)].slice(0, 8);
    localStorage.setItem("recent_keywords", JSON.stringify(updated));
    if (onSubmitKeyword) onSubmitKeyword(q);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusSug((p) => (p + 1) % SUGGESTIONS.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusSug((p) => (p - 1 < 0 ? SUGGESTIONS.length - 1 : p - 1));
    } else if (e.key === "Enter") {
      if (focusSug >= 0) {
        doSearch(SUGGESTIONS[focusSug]);
      } else {
        doSearch();
      }
    } else if (e.key === "Escape") {
      setFocusSug(-1);
    }
  };

  return (
    <section
      className="relative mb-10 overflow-hidden rounded-[36px] bg-brand p-8 text-[#fff5e8] shadow-brand md:p-14"
      aria-label="Khu vực tìm kiếm chính"
    >
      <div className="max-w-2xl space-y-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f1c89b]">
          Search Tasting Notes
        </p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">
          Tìm kiếm công thức
        </h1>
        <p className="text-sm leading-relaxed text-[#fff0df]/82 md:text-base">
          Gõ từ khóa hoặc chọn gợi ý để khám phá món Hàn theo nguyên liệu, món
          ăn hoặc phong vị bạn muốn nấu.
        </p>
        <div className="space-y-3">
          <div className="relative">
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setFocusSug(-1);
              }}
              onKeyDown={onKeyDown}
              placeholder="Ví dụ: kimchi, tokbokki, canh rong biển..."
              className="w-full rounded-[24px] border border-white/15 bg-white/10 px-5 py-5 pl-14 text-base text-[#fff7ec] shadow-inner shadow-black/10 backdrop-blur placeholder:text-[#f8dfc0]/60 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#f0c99a] md:w-[580px] md:text-lg"
              aria-label="Từ khóa tìm kiếm"
            />
            <span
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#f2d1ad]/76"
              aria-hidden="true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </span>
            <button
              onClick={() => doSearch()}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-2xl bg-[linear-gradient(135deg,#f6e1bc_0%,#d7a36d_100%)] px-6 py-3 text-sm font-semibold text-[#4a1717] shadow-lg focus:outline-none focus:ring-2 focus:ring-[#f6e1bc] md:text-base"
              aria-label="Thực hiện tìm kiếm"
            >
              Tìm
            </button>
          </div>
          <ul className="flex flex-wrap gap-2 text-xs" aria-label="Gợi ý nhanh">
            {SUGGESTIONS.map((s, idx) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => doSearch(s)}
                  className={`rounded-full border px-3 py-1.5 font-medium transition focus:outline-none focus:ring-2 focus:ring-[#f6e1bc]/70 ${
                    focusSug === idx
                      ? "bg-[linear-gradient(135deg,#f6e1bc_0%,#d7a36d_100%)] text-[#4a1717] border-transparent"
                      : "border-white/15 bg-white/10 text-[#fff5e8] hover:bg-white/18"
                  }`}
                  aria-selected={focusSug === idx}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        className="absolute -right-10 -bottom-10 h-72 w-72 rounded-full border border-white/10 bg-[radial-gradient(circle,rgba(255,255,255,0.18),transparent_62%)] blur-2xl md:h-[28rem] md:w-[28rem]"
        aria-hidden="true"
      />
    </section>
  );
}
