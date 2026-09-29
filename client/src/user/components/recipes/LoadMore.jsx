import React from "react";

export default function LoadMore({
  pagination,
  loading,
  onLoadMore,
  className = "",
}) {
  if (!pagination) return null;

  const hasMore =
    pagination.hasNext ||
    pagination.hasNextPage ||
    (pagination.page && pagination.page < pagination.totalPages);

  const currentCount =
    pagination.currentCount ||
    pagination.count ||
    (pagination.page && pagination.limit
      ? pagination.page * pagination.limit
      : 0);

  const totalCount = pagination.totalCount || pagination.total || 0;

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={loading}
          className="btn-green min-w-[220px] !rounded-xl !px-8 !py-3.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Đang tải..." : "Tải thêm công thức"}
        </button>
      )}

      {!hasMore && currentCount > 0 && (
        <div className="py-4 text-center text-sm text-hub-muted">
          Bạn đã xem hết tất cả công thức · Tổng cộng {totalCount}
        </div>
      )}
    </div>
  );
}
