import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export default function LoginRequiredModal({ open, onClose, onLoginRedirect }) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const handleLoginRedirect = () => {
    const currentPath = window.location.pathname;
    const redirectUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
    onLoginRedirect?.(redirectUrl);
    onClose?.();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Yêu cầu đăng nhập"
    >
      <div
        className="fixed inset-0 bg-[rgba(33,24,25,0.72)] backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md space-y-5 rounded-[28px] bg-[rgba(255,250,242,0.98)] p-6 shadow-xl ring-1 ring-[rgba(74,23,23,0.08)]">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f6e1bc_0%,#d7a36d_100%)]">
            <svg
              className="h-6 w-6 text-[#7f1d1d]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[#311818]">
            Cần đăng nhập
          </h2>
          <p className="text-sm leading-relaxed text-[#6f5b4f]">
            Bạn cần đăng nhập để có thể báo cáo bài viết. Đăng nhập ngay để tiếp
            tục.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-[rgba(74,23,23,0.1)] bg-[#fff5e8] px-4 py-2 text-sm font-medium text-[#5d3029] transition-colors hover:bg-[#f4e5d3] focus:outline-none focus:ring-2 focus:ring-[#d4a373]/60"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleLoginRedirect}
            className="flex-1 rounded-2xl bg-brand px-5 py-2 text-sm font-semibold text-white shadow-brand transition-all hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-[#d4a373]/60"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
