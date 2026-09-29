import React from "react";
import { FaEllipsisH, FaHeart, FaRegComment, FaShare } from "react-icons/fa";

export default function FeedItem({ post, onReport, onLike }) {
  const userName = post.user?.name || "Người dùng ẩn danh";
  const userAvatar = post.user?.avatar || "";
  const likes = post.likesCount ?? post.likes ?? 0;
  const comments = post.commentsCount ?? post.commentCount ?? 0;
  const image =
    post.image ||
    post.media?.[0]?.url ||
    (typeof post.media?.[0] === "string" ? post.media[0] : null);

  return (
    <article className="card space-y-4 p-5" aria-label={`Bài đăng bởi ${userName}`}>
      <div className="flex items-start gap-3">
        {userAvatar ? (
          <img
            src={userAvatar}
            alt={userName}
            className="h-11 w-11 rounded-full object-cover ring-2 ring-black/5"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-hub-bg ring-2 ring-black/5">
            <span className="text-sm font-semibold text-brand-maroon">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-hub-ink">{userName}</p>
              <p className="text-xs text-hub-muted">
                {post.tag || "Thành viên"} ·{" "}
                <time dateTime={post.createdAt}>
                  {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
                </time>
              </p>
            </div>
            <div className="relative">
              <button
                type="button"
                className="rounded-full p-2 text-hub-muted hover:bg-hub-bg"
                aria-label="Tùy chọn"
                onClick={() => onReport?.(post)}
              >
                <FaEllipsisH />
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="whitespace-pre-line text-sm leading-relaxed text-hub-ink">
        {post.content}
      </p>

      {image && (
        <div className="overflow-hidden rounded-xl border border-black/5">
          <img
            src={image}
            alt=""
            className="max-h-96 w-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/5 pt-3 text-sm text-hub-muted">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onLike?.(post.id || post._id)}
            className="inline-flex items-center gap-1.5 hover:text-brand-maroon"
          >
            <FaHeart className={post.isLiked || post.liked ? "text-brand-maroon" : ""} />
            {likes} lượt thích
          </button>
          <span className="inline-flex items-center gap-1.5">
            <FaRegComment /> {comments} bình luận
          </span>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 hover:text-brand-maroon"
          onClick={() => onReport?.(post)}
        >
          <FaShare /> chia sẻ / báo cáo
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-hub-bg text-xs font-semibold text-brand-maroon">
          U
        </div>
        <input
          type="text"
          placeholder="Viết bình luận..."
          className="input !rounded-full !py-2 text-sm"
          disabled
          aria-label="Viết bình luận"
        />
      </div>
    </article>
  );
}
