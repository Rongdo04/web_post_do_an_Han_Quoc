import React, { useMemo } from "react";
import FeedItem from "./FeedItem.jsx";

export default function FeedList({ posts, filterTag, onReport, onLike }) {
  const list = useMemo(
    () =>
      filterTag && filterTag !== "Tất cả"
        ? posts.filter((p) => p.tag === filterTag)
        : posts,
    [posts, filterTag],
  );

  if (!list.length)
    return (
      <p className="rounded-2xl border border-black/5 bg-hub-bg px-4 py-8 text-center text-sm text-hub-muted">
        Không có bài phù hợp.
      </p>
    );

  return (
    <div className="space-y-4">
      {list.map((p) => (
        <FeedItem
          key={p.id || p._id}
          post={p}
          onReport={onReport}
          onLike={onLike}
        />
      ))}
    </div>
  );
}
