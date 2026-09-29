import React, { useState } from "react";
import { createPortal } from "react-dom";
import authAPI from "../../../services/authAPI";
import { useAuth } from "../../../contexts/AuthContext";

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80";

function isValidUrl(string) {
  if (!string) return true;
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

export default function AvatarEditor({ onClose, onSuccess }) {
  const { user, updateUser } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");
  const [coverUrl, setCoverUrl] = useState(user?.coverImage || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidUrl(avatarUrl)) {
      setError("URL avatar không hợp lệ");
      return;
    }
    if (!isValidUrl(coverUrl)) {
      setError("URL ảnh bìa không hợp lệ");
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.updateProfile({
        avatar: avatarUrl.trim(),
        coverImage: coverUrl.trim(),
      });

      if (response.success) {
        updateUser(response.data.user);
        onSuccess?.("Cập nhật hồ sơ thành công!");
        onClose?.();
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(
        err.response?.data?.message || "Có lỗi xảy ra khi cập nhật hồ sơ",
      );
    } finally {
      setLoading(false);
    }
  };

  const coverPreview = coverUrl.trim() || DEFAULT_COVER;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(33,24,25,0.72)] p-4 backdrop-blur-sm">
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-serif text-xl font-semibold text-hub-ink">
              Chỉnh sửa hồ sơ
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-hub-muted hover:bg-hub-bg hover:text-hub-ink"
              aria-label="Đóng"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Cover preview */}
            <div>
              <label className="mb-2 block text-sm font-medium text-hub-ink">
                Ảnh bìa
              </label>
              <div
                className="mb-3 h-28 overflow-hidden rounded-xl bg-cover bg-center sm:h-32"
                style={{
                  backgroundImage: `linear-gradient(120deg, rgba(139,29,29,0.45), rgba(45,90,39,0.25)), url('${coverPreview}')`,
                }}
              />
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://example.com/cover.jpg"
                className="input"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-hub-muted">
                Dán link ảnh bìa. Để trống để dùng ảnh mặc định.
              </p>
            </div>

            {/* Avatar preview */}
            <div>
              <label className="mb-2 block text-sm font-medium text-hub-ink">
                Ảnh đại diện
              </label>
              <div className="mb-3 flex items-center gap-4">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar preview"
                    className="h-20 w-20 rounded-full object-cover ring-2 ring-black/5"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-hub-bg text-2xl font-bold text-brand-maroon ring-2 ring-black/5">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
                <p className="text-sm text-hub-muted">
                  Nhập URL ảnh từ internet để đổi avatar.
                </p>
              </div>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="input"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-hub-muted">
                Để trống để dùng chữ cái tên làm avatar.
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-hub-ink hover:bg-hub-bg"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-brand flex-1 !rounded-xl disabled:opacity-50"
              >
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
}
