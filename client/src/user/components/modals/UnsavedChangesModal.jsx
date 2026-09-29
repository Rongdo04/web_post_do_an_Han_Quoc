import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function UnsavedChangesModal({ open, onCancel, onConfirm }) {
  const dialogRef = useRef();
  const firstBtn = useRef();

  useEffect(() => {
    if (open) {
      const prev = document.activeElement;
      setTimeout(() => firstBtn.current?.focus(), 10);
      const onKey = (e) => {
        if (e.key === "Escape") onCancel();
      };
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("keydown", onKey);
        prev?.focus();
      };
    }
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(33,24,25,0.72)] p-4 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-labelledby="unsaved-title"
    >
      <div
        ref={dialogRef}
        className="relative z-10 mx-auto w-full max-w-md animate-[scaleIn_.25s_ease] rounded-[28px] bg-[rgba(255,250,242,0.98)] p-6 shadow-xl ring-1 ring-[rgba(74,23,23,0.08)]"
      >
        <h2 id="unsaved-title" className="text-sm font-semibold text-[#311818]">
          Rời trang?
        </h2>
        <p className="mt-2 text-xs text-[#6f5b4f]">
          Bạn có thay đổi chưa lưu. Nếu rời đi bản nháp vẫn ở localStorage nhưng
          có thể mất nếu xoá cache.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={firstBtn}
            onClick={onCancel}
            className="rounded-2xl bg-[#f4e5d3] px-4 py-2 text-sm font-medium text-[#5d3029] focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
          >
            Ở lại
          </button>
          <button onClick={onConfirm} className="btn-brand">
            Rời đi
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
