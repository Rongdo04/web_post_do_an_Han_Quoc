import React from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import SearchHero from "../components/search/SearchHero.jsx";
import RecentKeywords from "../components/search/RecentKeywords.jsx";
import GroupedResults from "../components/search/GroupedResults.jsx";

export default function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get("query") || params.get("q") || "";

  return (
    <div className="space-y-12">
      <SearchHero />
      <div className="grid lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-12">
          {query ? (
            <GroupedResults query={query} />
          ) : (
            <div className="space-y-6 rounded-[28px] border border-[rgba(74,23,23,0.08)] bg-[rgba(255,250,242,0.92)] p-8 text-center shadow-[0_18px_44px_-36px_rgba(74,23,23,0.45)]">
              <p className="text-sm text-[#6f5b4f]">
                Nhập từ khóa để bắt đầu tìm kiếm.
              </p>
              <p className="text-xs uppercase tracking-[0.18em] text-[#9a6b47]">
                Gợi ý thử
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "kimchi",
                  "tokbokki",
                  "bibimbap",
                  "bulgogi",
                  "tteokguk",
                  "kimbap",
                ].map((k) => (
                  <span
                    key={k}
                    className="rounded-full border border-[rgba(74,23,23,0.08)] bg-[#fff5e8] px-3 py-1.5 text-[11px] font-medium text-[#7f1d1d]"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <aside className="lg:col-span-1 space-y-10">
          <RecentKeywords
            onSelect={(kw) => {
              window.location.assign(`/search?q=${encodeURIComponent(kw)}`);
            }}
          />
          <div className="space-y-3 rounded-[24px] border border-[rgba(74,23,23,0.08)] bg-[rgba(255,250,242,0.92)] p-5 text-xs text-[#6f5b4f] shadow-[0_18px_44px_-36px_rgba(74,23,23,0.45)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9a6b47]">
              Ghi chú
            </p>
            <p>
              Trang tìm kiếm này hiện chỉ sử dụng dữ liệu mock cục bộ để minh
              họa giao diện nhóm kết quả.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
