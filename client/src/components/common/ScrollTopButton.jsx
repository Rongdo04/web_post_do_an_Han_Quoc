import React, { useEffect, useState } from "react";

export default function ScrollTopButton() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      aria-label="Lên đầu trang"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white shadow-brand border border-white/15 transition hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
    >
      ↑
    </button>
  );
}
