import React from "react";
import { Link } from "react-router-dom";
import Hero from "../components/home/Hero.jsx";
import CategoryChips from "../components/home/CategoryChips.jsx";
import TrendingGrid from "../components/home/TrendingGrid.jsx";
import { useSiteSettings } from "../../contexts/SiteSettingsContext.jsx";

const FALLBACK_FOOTER =
  "https://bazantravel.com/cdn/medias/uploads/52/52717-com-tron-han-quoc-700x419.jpg";

export default function HomePageUser() {
  const { settings } = useSiteSettings();
  const brand = settings.brand || "CulinaryHub";
  const footerImage = settings.footerImage || FALLBACK_FOOTER;

  return (
    <div>
      <Hero />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CategoryChips />
        <TrendingGrid limit={6} />

        <section className="relative mb-16 overflow-hidden rounded-2xl">
          <img
            src={footerImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
          <div className="relative max-w-xl space-y-4 px-8 py-14 text-white md:px-12 md:py-16">
            <span className="inline-flex rounded bg-brand-maroon px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]">
              Masterclass trực tuyến
            </span>
            <h2 className="font-serif text-3xl font-bold md:text-4xl">
              Nâng Tầm Kỹ Năng Dao Bếp Của Bạn
            </h2>
            <p className="text-sm leading-relaxed text-white/85 md:text-base">
              Học từ các đầu bếp chuyên nghiệp qua các buổi livestream và hướng
              dẫn chi tiết ngay trên {brand}.
            </p>
            <Link
              to="/community"
              className="inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-hub-ink transition hover:bg-hub-bg"
            >
              Tham gia cộng đồng
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
