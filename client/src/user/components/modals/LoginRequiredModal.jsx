import React from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginRequiredModal({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  if (!open) return null;

  const redirect = encodeURIComponent(location.pathname + location.search);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Cần đăng nhập"
    >
      <div
        className="fixed inset-0 bg-[rgba(33,24,25,0.72)] backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-sm space-y-5 rounded-[28px] bg-[rgba(255,250,242,0.98)] p-6 shadow-xl ring-1 ring-[rgba(74,23,23,0.08)] animate-[fade_.2s_ease]">
        <h2 className="text-base font-semibold text-[#311818]">
          Bạn cần đăng nhập
        </h2>
        <p className="text-sm leading-relaxed text-[#6f5b4f]">
          Vui lòng đăng nhập để sử dụng chức năng này.
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="rounded-2xl border border-[rgba(74,23,23,0.1)] bg-[#fff5e8] px-4 py-2 text-sm font-medium text-[#5d3029] hover:bg-[#f4e5d3] focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
          >
            Đóng
          </button>
          <button
            onClick={() => navigate(`/auth/login?redirect=${redirect}`)}
            className="rounded-2xl bg-brand px-5 py-2 text-sm font-semibold text-[#fff5e8] shadow-brand focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
