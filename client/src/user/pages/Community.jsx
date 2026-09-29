import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useReportModal from "../../hooks/useReportModal";
import { usePosts } from "../../hooks/usePosts";
import PostComposer from "../components/community/PostComposer.jsx";
import FeedList from "../components/community/FeedList.jsx";
import GenericReportModal from "../../components/common/GenericReportModal.jsx";
import LoginRequiredModal from "../components/community/LoginRequiredModal.jsx";
import { useSiteSettings } from "../../contexts/SiteSettingsContext.jsx";

const FEED_TABS = [
  { id: "newest", label: "mới nhất" },
  { id: "popular", label: "phổ biến" },
  { id: "following", label: "đang theo dõi" },
];

export default function Community() {
  const { isAuthenticated } = useAuth();
  const { settings } = useSiteSettings();
  const brand = settings.brand || "CulinaryHub";
  const [feedTab, setFeedTab] = useState("newest");
  const [communitySearch, setCommunitySearch] = useState("");

  const {
    posts,
    loading,
    filters,
    createPost,
    updateFilters,
    toggleLike,
    refresh,
  } = usePosts();

  const {
    reportTarget,
    showLoginRequired,
    toast,
    handleReport: handleReportAction,
    handleReportSuccess,
    handleLoginRedirect,
    closeReportModal,
    closeLoginModal,
    clearToast,
  } = useReportModal();

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => clearToast(), 2600);
      return () => clearTimeout(t);
    }
  }, [toast, clearToast]);

  const handleCreatePost = async (postData) => {
    try {
      await createPost(postData);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleReport = (post) => {
    handleReportAction(post, isAuthenticated);
  };

  const handleTagFilter = (tag) => {
    updateFilters({ tag });
  };

  const tags = [
    "Tất cả",
    "Kinh nghiệm",
    "Hỏi đáp",
    "Món mới",
    "Chia sẻ",
    "Tư vấn",
  ];

  const sortedPosts = (() => {
    const list = [...(posts || [])];
    if (feedTab === "popular") {
      return list.sort(
        (a, b) =>
          (b.likesCount || b.likes || 0) - (a.likesCount || a.likes || 0),
      );
    }
    return list;
  })();

  const filteredBySearch = communitySearch.trim()
    ? sortedPosts.filter((p) =>
        (p.content || "")
          .toLowerCase()
          .includes(communitySearch.trim().toLowerCase()),
      )
    : sortedPosts;

  const activeMembers = sortedPosts
    .map((p) => p.user)
    .filter(Boolean)
    .reduce((acc, u) => {
      const id = u.id || u._id || u.name;
      if (!acc.find((x) => (x.id || x._id || x.name) === id)) acc.push(u);
      return acc;
    }, [])
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-6">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          <header className="space-y-2">
            <h1 className="font-serif text-3xl font-bold text-brand-maroon sm:text-4xl">
              Cộng đồng {brand}
            </h1>
            <p className="max-w-prose text-sm leading-relaxed text-hub-muted">
              Chia sẻ mẹo nấu nướng, đặt câu hỏi và trao đổi trải nghiệm bếp núc
              mỗi ngày cùng cộng đồng yêu ẩm thực.
            </p>
          </header>

          <PostComposer onPost={handleCreatePost} />

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5">
            <div className="flex gap-1">
              {FEED_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFeedTab(tab.id)}
                  className={`relative px-4 py-3 text-sm font-medium capitalize transition ${
                    feedTab === tab.id
                      ? "text-brand-maroon"
                      : "text-hub-muted hover:text-hub-ink"
                  }`}
                >
                  {tab.label}
                  {feedTab === tab.id && (
                    <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-brand-maroon" />
                  )}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => refresh?.()}
              className="mb-1 rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-hub-muted hover:bg-hub-bg"
            >
              lọc bài viết
            </button>
          </div>

          {feedTab === "following" && !isAuthenticated && (
            <p className="rounded-2xl border border-black/5 bg-hub-bg px-4 py-3 text-sm text-hub-muted">
              Đăng nhập để xem bài viết từ những người bạn đang theo dõi.
            </p>
          )}

          {loading ? (
            <div className="py-12 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-brand-maroon" />
              <p className="mt-2 text-hub-muted">Đang tải bài viết...</p>
            </div>
          ) : (
            <FeedList
              posts={filteredBySearch}
              filterTag={filters.tag}
              onReport={handleReport}
              onLike={toggleLike}
            />
          )}
        </div>

        {/* Right sidebar */}
        <aside className="space-y-5">
          <div className="card p-4">
            <input
              type="search"
              value={communitySearch}
              onChange={(e) => setCommunitySearch(e.target.value)}
              placeholder="Tìm trong cộng đồng..."
              className="input !rounded-full !py-2.5"
              aria-label="Tìm kiếm cộng đồng"
            />
          </div>

          <div className="card space-y-4 p-5">
            <h3 className="font-serif text-lg text-brand-maroon">
              Thành viên tích cực
            </h3>
            <ul className="space-y-3">
              {activeMembers.length === 0 && (
                <li className="text-sm text-hub-muted">Chưa có dữ liệu.</li>
              )}
              {activeMembers.map((m, i) => (
                <li key={m.id || m._id || i} className="flex items-center gap-3">
                  {m.avatar ? (
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-hub-bg text-sm font-semibold text-brand-maroon">
                      {(m.name || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-hub-ink">
                      {m.name || "Thành viên"}
                    </p>
                    <p className="text-xs text-hub-muted">Thành viên cộng đồng</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card space-y-3 p-5">
            <h3 className="font-serif text-lg text-brand-maroon">
              Chủ đề thảo luận hot
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTagFilter(t)}
                  aria-pressed={filters.tag === t}
                  className={
                    filters.tag === t ? "chip chip-active" : "chip"
                  }
                >
                  {t === "Tất cả" ? t : `#${t.replace(/\s/g, "")}`}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-brand-brown/15 bg-[#faf4ef] p-5">
            <p className="mb-3 text-sm font-semibold text-brand-brown">
              Nguyên tắc cộng đồng
            </p>
            <ul className="space-y-2 text-sm text-hub-muted">
              <li>• Tôn trọng và lịch sự với mọi thành viên</li>
              <li>• Chia sẻ nội dung liên quan đến ẩm thực</li>
              <li>• Không spam hoặc quảng cáo không phù hợp</li>
              <li>• Báo cáo nội dung vi phạm khi cần</li>
            </ul>
          </div>
        </aside>
      </div>

      <GenericReportModal
        key={reportTarget?.id || "report-modal"}
        open={!!reportTarget}
        target={reportTarget}
        targetType="post"
        onClose={closeReportModal}
        onSuccess={handleReportSuccess}
        onLoginRequired={() => {}}
      />

      <LoginRequiredModal
        open={showLoginRequired}
        onClose={closeLoginModal}
        onLoginRedirect={handleLoginRedirect}
      />

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-hub-ink px-5 py-3 text-sm font-medium text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
