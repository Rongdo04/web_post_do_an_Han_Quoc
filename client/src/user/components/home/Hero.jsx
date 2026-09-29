import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSiteSettings } from "../../../contexts/SiteSettingsContext.jsx";

const FALLBACK_HERO =
  "https://store.longphuong.vn/wp-content/uploads/2025/05/am-thuc-han-quoc-1.webp";

export default function Hero() {
  const { settings, loading } = useSiteSettings();
  const navigate = useNavigate();
  const heroImage = settings.heroImage || FALLBACK_HERO;

  if (loading) {
    return (
      <section className="relative h-[420px] animate-pulse bg-neutral-300 md:h-[520px]" />
    );
  }

  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={heroImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/25" />
      <div className="relative mx-auto flex min-h-[420px] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 md:min-h-[520px] lg:px-8">
        <div className="max-w-2xl space-y-6 text-white">
          <span className="inline-flex rounded bg-brand-maroon px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]">
            Công thức tiêu biểu
          </span>
          <h1 className="font-serif text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            {settings.siteTitle}
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            {settings.siteDesc}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/recipes")}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-maroon px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Khám phá ngay →
            </button>
            <Link
              to="/community"
              className="inline-flex items-center gap-2 rounded-lg border border-white/70 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Tham gia cộng đồng
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
