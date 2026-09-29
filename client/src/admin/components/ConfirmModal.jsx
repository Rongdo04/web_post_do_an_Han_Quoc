/**
 * ConfirmModal (UI-only)
 * Props: { open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel }
 * Story:
 *  <ConfirmModal open title="Delete" message="Are you sure?" onConfirm={()=>{}} onCancel={()=>{}} />
 */
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { t } from "../../i18n";

export default function ConfirmModal({
  open,
  title = t("actions.confirm", "Confirm"),
  message = t("confirm.message", "Bạn có chắc chắn?"),
  confirmLabel = t("actions.confirm", "Confirm"),
  cancelLabel = t("actions.cancel", "Cancel"),
  onConfirm,
  onCancel,
  danger = false,
}) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && open) onCancel && onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => onCancel && onCancel()}
      />
      <div
        className="relative z-10 w-full max-w-sm animate-[scaleIn_.18s_ease] rounded-2xl bg-white p-6 shadow-xl focus:outline-none"
        tabIndex={-1}
      >
        <h3
          id="confirm-title"
          className="mb-2 text-lg font-semibold text-brand-solid"
        >
          {title}
        </h3>
        <p className="mb-6 text-sm text-stone-700/80">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => onCancel && onCancel()}
            className="rounded-xl border border-brand-solid/15 bg-white px-4 py-2 text-sm font-medium hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-brand-ring"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => onConfirm && onConfirm()}
            className={`rounded-xl px-4 py-2 text-sm font-medium text-white shadow-brand focus:outline-none focus:ring-2 focus:ring-brand-ring ${
              danger
                ? "bg-gradient-to-br from-rose-700 via-rose-600 to-rose-500"
                : "bg-gradient-to-br from-brand-from via-brand-solid to-brand-to"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
