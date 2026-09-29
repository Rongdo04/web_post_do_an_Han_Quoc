import React from "react";
import { FaBolt as FaBoltIcon, FaStar as FaStarIcon } from "react-icons/fa";
import {
  GiBroccoli as GiBroccoliIcon,
  GiCookingPot as GiCookingPotIcon,
} from "react-icons/gi";

const items = [
  {
    id: 1,
    title: "Đúng tinh thần bữa cơm Hàn",
    text: "Công thức bám sát các món quen thuộc như cơm, canh, món phụ và đồ ăn vặt kiểu Hàn.",
    icon: GiBroccoliIcon,
  },
  {
    id: 2,
    title: "Dễ nấu tại nhà",
    text: "Ưu tiên công thức rõ nguyên liệu, thời gian và từng bước để người mới vẫn có thể làm theo.",
    icon: FaBoltIcon,
  },
  {
    id: 3,
    title: "Phù hợp nguyên liệu sẵn có",
    text: "Gợi ý món Hàn với nguyên liệu dễ tìm tại siêu thị và chợ tại Việt Nam.",
    icon: GiCookingPotIcon,
  },
  {
    id: 4,
    title: "Chia sẻ kinh nghiệm thực tế",
    text: "Kết hợp công thức, đánh giá và kinh nghiệm nấu nướng từ cộng đồng yêu ẩm thực Hàn Quốc.",
    icon: FaStarIcon,
  },
];

export default function ValueProps() {
  return (
    <section className="space-y-8" aria-labelledby="usp-title">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9a6b47]">
          Why This Platform
        </p>
        <h2
          id="usp-title"
          className="mt-1 text-2xl font-semibold tracking-tight text-[#311818]"
        >
          Vì sao nên dùng nền tảng này?
        </h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div
            key={it.id}
            className="rounded-[28px] border border-[rgba(74,23,23,0.08)] bg-[rgba(255,250,242,0.92)] p-6 shadow-[0_18px_40px_-34px_rgba(74,23,23,0.42)] transition hover:-translate-y-1 hover:shadow-brand"
          >
            <div
              className="mb-4 inline-flex rounded-2xl bg-[#f4e5d3] p-3 text-[#7f1d1d]"
              aria-hidden="true"
            >
              {React.createElement(it.icon, { className: "h-7 w-7" })}
            </div>
            <h3 className="mb-2 font-serif text-lg font-semibold text-[#311818]">
              {it.title}
            </h3>
            <p className="text-sm leading-relaxed text-[#6f5b4f]">{it.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
