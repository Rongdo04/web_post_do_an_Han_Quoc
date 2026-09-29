import React, { useState, useEffect, useRef, useCallback } from "react";
import { commentsAPI } from "../../../services/commentsAPI.js";
import { useAuthAdapter } from "../../../auth/useAuthAdapter.js";
import Toast from "../Toast.jsx";
import { FaStar } from "react-icons/fa";
export default function CommentList({ recipeId, recipe, initial = [] }) {
  const [comments, setComments] = useState(initial);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [pagination, setPagination] = useState(null);
  const [toast, setToast] = useState({
    open: false,
    type: "info",
    message: "",
  });
  const { user, isAuthenticated } = useAuthAdapter();

  // Dùng ref để tránh stale closure và kiểm soát loading state
  const currentRecipeIdRef = useRef(recipeId);
  const isLoadingRef = useRef(false);
  const lastRecipeIdRef = useRef(null);
  const lastLoadTimeRef = useRef(0);

  // Update ref khi recipeId thay đổi
  useEffect(() => {
    currentRecipeIdRef.current = recipeId;
  }, [recipeId]);

  const loadComments = useCallback(
    async (loadMore = false, currentPagination = null) => {
      const targetRecipeId = currentRecipeIdRef.current;
      const now = Date.now();

      // Kiểm tra các điều kiện để tránh infinite loop
      if (!targetRecipeId || isLoadingRef.current) {
        return;
      }

      // Rate limiting: không cho phép gọi API quá 1 lần trong 500ms
      if (!loadMore && now - lastLoadTimeRef.current < 500) {
        return;
      }

      // Tránh load lại nếu đã load cho recipe này rồi (trừ khi là load more)
      if (!loadMore && lastRecipeIdRef.current === targetRecipeId) {
        return;
      }

      try {
        isLoadingRef.current = true;
        if (!loadMore) {
          lastLoadTimeRef.current = now;
        }

        if (loadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
          setComments([]); // Clear when fresh load
          setPagination(null); // Reset pagination for fresh load
          lastRecipeIdRef.current = targetRecipeId; // Mark as loaded
        }

        const params = {
          status: "approved",
          limit: 10,
          ...(loadMore &&
            currentPagination?.nextCursor && {
              cursor: currentPagination.nextCursor,
            }),
        };

        const response = await commentsAPI.getComments(targetRecipeId, params);
        const commentsData = response?.data || [];
        const pageInfo = response?.pagination || null;

        // Chỉ update state nếu vẫn là cùng recipe
        if (currentRecipeIdRef.current === targetRecipeId) {
          if (loadMore) {
            setComments((prev) => [...prev, ...commentsData]);
          } else {
            setComments(commentsData);
          }
          setPagination(pageInfo);
          setError(null); // Clear any previous errors
        }
      } catch (err) {
        console.error("Error loading comments:", err);
        if (currentRecipeIdRef.current === targetRecipeId) {
          setError("Không thể tải bình luận");
          if (!loadMore) {
            // Use initial prop only on error fallback
            setComments(initial);
          }
        }
      } finally {
        isLoadingRef.current = false;
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  // Chỉ gọi khi recipeId đổi; không reset lastRecipeIdRef để tránh phá guard
  useEffect(() => {
    if (!recipeId) return;
    setComments([]);
    setPagination(null);
    setError(null);
    const timeoutId = setTimeout(() => {
      loadComments(false);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [recipeId]); // cố ý không đưa loadComments vào deps

  const add = async (e) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;

    if (!isAuthenticated) {
      setError("Bạn cần đăng nhập để bình luận");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setFieldErrors({});

      await commentsAPI.addComment(recipeId, content, rating || null);

      // Reset form
      setText("");
      setRating(0);

      // Reload comments to show updated list (including newly approved comments)
      loadComments(false);

      // Show success toast - comment is pending approval
      setToast({
        open: true,
        type: "success",
        message: "Bình luận đã được gửi và chờ duyệt",
      });
    } catch (err) {
      console.error("Error adding comment:", err);

      // Handle 422 validation errors
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setError("Không thể thêm bình luận. Vui lòng thử lại.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const loadMoreComments = () => {
    if (!pagination?.hasNext || loadingMore || isLoadingRef.current) return;
    loadComments(true, pagination);
  };

  return (
    <div className="space-y-6" aria-labelledby="comments-title">
      <h3
        id="comments-title"
        className="font-serif text-2xl text-brand-maroon"
      >
        Cộng đồng thảo luận{" "}
        <span className="text-base font-sans font-normal text-hub-muted">
          ({loading ? "..." : comments.length})
        </span>
      </h3>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={add} className="card space-y-4 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-hub-bg text-sm font-semibold text-brand-maroon">
            {(user?.name || "U").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className={`input min-h-[88px] ${
                  fieldErrors.content ? "border-red-300" : ""
                }`}
                placeholder={
                  isAuthenticated
                    ? "Chia sẻ cảm nhận của bạn..."
                    : "Đăng nhập để bình luận"
                }
                disabled={!isAuthenticated || submitting}
                required
              />
              {fieldErrors.content && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.content}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="mb-1 text-xs font-medium text-hub-muted">
                  Đánh giá (tùy chọn)
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(rating === star ? 0 : star)}
                      disabled={!isAuthenticated || submitting}
                      className={`h-6 w-6 text-lg transition-colors ${
                        star <= rating
                          ? "text-amber-400"
                          : "text-black/20 hover:text-amber-200"
                      } ${
                        !isAuthenticated || submitting
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                    >
                      <FaStar className="inline" />
                    </button>
                  ))}
                </div>
                {fieldErrors.rating && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.rating}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setText("");
                    setRating(0);
                  }}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-hub-muted hover:bg-hub-bg"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={!text.trim() || !isAuthenticated || submitting}
                  className="btn-brand disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? "Đang gửi..."
                    : isAuthenticated
                      ? "Gửi bình luận"
                      : "Đăng nhập để bình luận"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="text-sm text-hub-muted">Đang tải bình luận...</div>
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {comments.map((c, index) => (
              <li
                key={c.id || c._id || `comment-${index}`}
                className="card space-y-2 p-4 text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-hub-bg text-xs font-semibold text-brand-maroon">
                    {(
                      c.userId?.name ||
                      c.author?.name ||
                      c.author ||
                      "A"
                    )
                      .toString()
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-hub-ink">
                      {c.userId?.name || c.author?.name || c.author || "Ẩn danh"}
                    </span>
                    <time
                      className="ml-2 text-xs text-hub-muted"
                      dateTime={c.createdAt}
                    >
                      {new Date(c.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                </div>
                <p className="whitespace-pre-line leading-relaxed text-hub-muted">
                  {c.content}
                </p>
              </li>
            ))}
          </ul>

          {comments.length === 0 && (
            <p className="text-xs text-hub-muted">Chưa có bình luận nào.</p>
          )}

          {pagination?.hasNext && (
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={loadMoreComments}
                disabled={loadingMore}
                className="rounded-full border border-black/10 bg-hub-bg px-6 py-2.5 text-sm font-medium text-hub-ink hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingMore ? "Đang tải..." : "Xem thêm bình luận khác"}
              </button>
            </div>
          )}
        </>
      )}

      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ open: false, type: "info", message: "" })}
      />
    </div>
  );
}
