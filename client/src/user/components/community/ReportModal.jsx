import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../../contexts/AuthContext";
import reportsAPI from "../../../services/reportsAPI";

export default function ReportModal({ open, onClose, onReport, post }) {
  const { isAuthenticated } = useAuth();
  const [reason, setReason] = useState("Nội dung không phù hợp");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      const handleKey = (e) => {
        if (e.key === "Escape") onClose?.();
      };
      window.addEventListener("keydown", handleKey, true);
      return () => window.removeEventListener("keydown", handleKey, true);
    }
  }, [open, onClose]);

  // Reset states when modal opens
  useEffect(() => {
    if (open) {
      setReason("Nội dung không phù hợp");
      setIsSubmitting(false);
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      // This shouldn't happen as we check auth before opening modal
      // but good to have as fallback
      onClose?.();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const reportData = {
        targetType: "post", // For community posts
        targetId: post.id.toString(),
        reason: reason,
        description: `Báo cáo bài viết: "${post.content.substring(0, 100)}${
          post.content.length > 100 ? "..." : ""
        }"`,
      };

      const response = await reportsAPI.submitReport(reportData);

      // Call the legacy onReport callback for local state/toast
      onReport?.({
        id: Date.now(),
        postId: post.id,
        reason,
        createdAt: new Date().toISOString(),
        apiResponse: response,
      });

      onClose?.();
    } catch (error) {
      console.error("Error submitting report:", error);
      setError(
        error.message || "Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const reasons = [
    "Nội dung không phù hợp",
    "Spam / Quảng cáo",
    "Ngôn từ tiêu cực",
    "Sai thông tin",
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Báo cáo bài viết"
    >
      <div
        className="fixed inset-0 bg-[rgba(33,24,25,0.72)] backdrop-blur-sm"
        onClick={onClose}
      />
      <form
        onSubmit={submit}
        className="relative z-10 w-full max-w-md space-y-5 rounded-[28px] bg-[rgba(255,250,242,0.98)] p-6 shadow-xl ring-1 ring-[rgba(74,23,23,0.08)]"
      >
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-[#311818]">
            Báo cáo bài viết
          </h2>
          <p className="text-xs leading-snug line-clamp-2 text-[#6f5b4f]">
            {post.content}
          </p>
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-[0.16em] text-[#9a6b47]">
            Lý do
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-2xl border border-[rgba(74,23,23,0.12)] bg-white px-3 py-2.5 text-sm text-[#2f1818] focus:outline-none focus:ring-2 focus:ring-[#d4a373]/60 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {reasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-2xl text-sm font-medium bg-[#fff5e8] text-[#5d3029] border border-[rgba(74,23,23,0.1)] hover:bg-[#f4e5d3] focus:outline-none focus:ring-2 focus:ring-[#d4a373]/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-br from-rose-600 via-rose-600 to-rose-700 text-white focus:outline-none focus:ring-2 focus:ring-rose-400/60 shadow disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center gap-2"
          >
            {isSubmitting && (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {isSubmitting ? "Đang gửi..." : "Gửi báo cáo"}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}
