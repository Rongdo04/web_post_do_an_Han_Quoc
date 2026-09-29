import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaClock,
  FaFire,
  FaStar,
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaShareAlt,
  FaPrint,
  FaUtensils,
} from "react-icons/fa";
import { recipesAPI } from "../../services/recipesAPI.js";
import { useAuthAdapter } from "../../auth/useAuthAdapter.js";
import useReportModal from "../../hooks/useReportModal";
import IngredientsChecklist from "../components/recipe/IngredientsChecklist";
import Steps from "../components/recipe/Steps";
import MediaGallery from "../components/recipe/MediaGallery";
import CommentList from "../components/recipe/CommentList";
import LoginRequiredModal from "../components/modals/LoginRequiredModal.jsx";
import GenericReportModal from "../../components/common/GenericReportModal.jsx";
import { default as ReportLoginModal } from "../components/community/LoginRequiredModal.jsx";

function getImageSrc(img) {
  if (!img) return null;
  if (typeof img === "string") return img;
  return img.url || img.src || null;
}

export default function RecipeDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const { isAuthenticated } = useAuthAdapter();
  const [fav, setFav] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const {
    reportTarget,
    showLoginRequired: showReportLoginRequired,
    toast: reportToast,
    handleReport: handleReportAction,
    handleReportSuccess,
    handleLoginRedirect: handleReportLoginRedirect,
    closeReportModal,
    closeLoginModal: closeReportLoginModal,
    clearToast: clearReportToast,
  } = useReportModal();

  const hasFetchedRef = useRef(false);
  const currentSlugRef = useRef(slug);

  useEffect(() => {
    if (currentSlugRef.current !== slug) {
      hasFetchedRef.current = false;
      currentSlugRef.current = slug;
    }

    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchRecipe = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);
        setNotFound(false);

        const recipeData = await recipesAPI.getRecipeBySlug(slug);

        if (!recipeData) {
          setNotFound(true);
          return;
        }

        setRecipe(recipeData);

        if (recipeData.authorId) {
          setAuthor(recipeData.authorId);
        }
      } catch (err) {
        console.error("Error fetching recipe:", err);

        if (err.response?.status === 404 || err.status === 404) {
          setNotFound(true);
        } else {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [slug]);

  useEffect(() => {
    if (!recipe) return;
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFav(stored.includes(recipe._id));
  }, [recipe]);

  const toggleFav = () => {
    if (!recipe) return;
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setFav((prev) => {
      const next = !prev;
      const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
      let updated;
      if (next) updated = Array.from(new Set([recipe._id, ...stored]));
      else updated = stored.filter((id) => id !== recipe._id);
      localStorage.setItem("favorites", JSON.stringify(updated));
      return next;
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  useEffect(() => {
    if (reportToast) {
      const t = setTimeout(() => clearReportToast(), 2600);
      return () => clearTimeout(t);
    }
  }, [reportToast, clearReportToast]);

  const handleReport = () => {
    if (!recipe) return;
    handleReportAction(recipe, isAuthenticated);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe?.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-1/3 rounded bg-black/10" />
          <div className="grid gap-8 md:grid-cols-2">
            <div className="aspect-[4/3] rounded-2xl bg-black/10" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded bg-black/10" />
              <div className="h-4 w-full rounded bg-black/10" />
              <div className="h-20 rounded-2xl bg-black/10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20">
        <div className="card space-y-6 p-10 text-center">
          <h1 className="font-serif text-2xl text-brand-maroon">
            Không tìm thấy công thức
          </h1>
          <p className="mx-auto max-w-md text-hub-muted">
            Công thức bạn đang tìm kiếm không tồn tại hoặc đã được gỡ bỏ.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/recipes" className="btn-brand">
              Xem tất cả công thức
            </Link>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-black/10 bg-white px-6 py-2.5 text-sm font-semibold text-hub-ink hover:bg-hub-bg"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="card space-y-4 p-6 text-center">
          <h1 className="font-serif text-xl text-brand-maroon">
            {error ? "Có lỗi xảy ra" : "Không tìm thấy công thức"}
          </h1>
          <p className="text-sm text-hub-muted">
            {error
              ? "Vui lòng thử lại sau."
              : "Có thể công thức đã được đổi tên hoặc chưa được tạo."}
          </p>
          <Link to="/recipes" className="btn-brand inline-flex">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  const heroSrc =
    getImageSrc(recipe.images?.[0]) ||
    getImageSrc(recipe.coverImage) ||
    null;
  const categoryLabel =
    (typeof recipe.category === "object"
      ? recipe.category?.name
      : recipe.category) ||
    recipe.tags?.[0] ||
    "Công thức";
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
  const kcal =
    recipe.nutrition?.calories ||
    recipe.calories ||
    recipe.nutritionInfo?.energy ||
    null;

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 lg:px-6">
      {/* Breadcrumbs */}
      <nav className="text-sm text-hub-muted" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link to="/" className="hover:text-brand-maroon">
              Trang chủ
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <Link to="/recipes" className="hover:text-brand-maroon">
              Danh sách công thức
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li className="line-clamp-1 font-medium text-hub-ink">
            {recipe.title}
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="grid items-start gap-8 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
          {heroSrc ? (
            <img
              src={heroSrc}
              alt={recipe.title}
              className="aspect-[4/3] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center bg-hub-bg text-hub-muted">
              <FaUtensils className="h-12 w-12 opacity-40" />
            </div>
          )}
          <span className="badge-brand absolute left-4 top-4 !rounded-full">
            {categoryLabel}
          </span>
        </div>

        <div className="space-y-5">
          <div className="space-y-3">
            <div className="flex flex-wrap items-start gap-3">
              <h1 className="font-serif text-3xl font-bold leading-tight text-brand-maroon sm:text-4xl">
                {recipe.title}
              </h1>
              {recipe.blockchain?.isVerified &&
                recipe.blockchain?.transactionHash && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-green px-3 py-1.5 text-xs font-medium text-white">
                    Verified on Blockchain
                  </span>
                )}
              {recipe.blockchain?.recipeHash &&
                !recipe.blockchain?.isVerified &&
                recipe.blockchain?.verificationReason ===
                  "hash_already_exists" && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white">
                    Trùng lặp - Chưa xác minh
                  </span>
                )}
            </div>
            <p className="text-base italic leading-relaxed text-hub-muted">
              {recipe.summary || recipe.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={author?.avatar || "/api/placeholder/40/40"}
              alt={author?.name || "Tác giả"}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-black/5"
              loading="lazy"
            />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-maroon">
                Tác giả
              </p>
              <p className="font-semibold text-hub-ink">
                {author?.name || "Không rõ"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-black/5 bg-hub-bg px-4 py-3 text-center">
              <div className="mb-1 flex justify-center text-brand-maroon">
                <FaClock />
              </div>
              <p className="text-[11px] uppercase tracking-wide text-hub-muted">
                Chuẩn bị
              </p>
              <p className="font-semibold text-hub-ink">
                {totalTime || recipe.prepTime || 0} phút
              </p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-hub-bg px-4 py-3 text-center">
              <div className="mb-1 flex justify-center text-brand-maroon">
                <FaFire />
              </div>
              <p className="text-[11px] uppercase tracking-wide text-hub-muted">
                Năng lượng
              </p>
              <p className="font-semibold text-hub-ink">
                {kcal ? `${kcal} kcal` : `${recipe.servings || 1} khẩu phần`}
              </p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-hub-bg px-4 py-3 text-center">
              <div className="mb-1 flex justify-center text-amber-500">
                <FaStar />
              </div>
              <p className="text-[11px] uppercase tracking-wide text-hub-muted">
                Đánh giá
              </p>
              <p className="font-semibold text-hub-ink">
                {recipe.ratingAvg || 0} ({recipe.ratingCount || 0})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleFav}
              aria-pressed={fav}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                fav
                  ? "bg-brand-maroon text-white"
                  : "border border-black/10 bg-white text-hub-ink hover:bg-hub-bg"
              }`}
              aria-label={fav ? "Bỏ yêu thích" : "Yêu thích"}
            >
              {fav ? <FaHeart /> : <FaRegHeart />}
              {fav ? "Đã yêu thích" : "Yêu thích"}
            </button>
            <button
              type="button"
              onClick={toggleFav}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-hub-ink hover:bg-hub-bg"
              aria-label={fav ? "Bỏ lưu" : "Lưu"}
              title="Lưu"
            >
              {fav ? (
                <FaStar className="text-amber-500" />
              ) : (
                <FaBookmark className="text-hub-muted" />
              )}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-hub-ink hover:bg-hub-bg"
              aria-label="Chia sẻ"
            >
              <FaShareAlt />
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="ml-auto inline-flex items-center gap-1 rounded-full border border-rose-200 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
              aria-label="Báo cáo công thức"
            >
              Báo cáo
            </button>
          </div>

          {recipe.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <span key={tag} className="chip !py-1 !text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main content */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <IngredientsChecklist
            list={recipe.ingredients}
            servings={recipe.servings}
          />
          <Steps steps={recipe.steps} tip={recipe.tips || recipe.chefTip} />
          <div className="lg:hidden">
            <MediaGallery images={recipe.images} videoUrl={recipe.videoUrl} />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card space-y-4 p-5">
            <h3 className="font-serif text-lg text-brand-maroon">
              Thông tin dinh dưỡng
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-black/5 pb-2">
                <dt className="text-hub-muted">Năng lượng</dt>
                <dd className="font-semibold text-hub-ink">
                  {kcal ? `${kcal} kcal` : "—"}
                </dd>
              </div>
              <div className="flex justify-between border-b border-black/5 pb-2">
                <dt className="text-hub-muted">Khẩu phần</dt>
                <dd className="font-semibold text-hub-ink">
                  {recipe.servings || 1}
                </dd>
              </div>
              <div className="flex justify-between border-b border-black/5 pb-2">
                <dt className="text-hub-muted">Độ khó</dt>
                <dd className="font-semibold text-hub-ink">
                  {recipe.difficulty || "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-hub-muted">Chế độ ăn</dt>
                <dd className="font-semibold text-hub-ink">
                  {recipe.dietType || "—"}
                </dd>
              </div>
            </dl>
          </div>

          {recipe.blockchain?.isVerified && (
            <div className="card space-y-2 border-brand-green/20 bg-brand-green/5 p-4">
              <p className="text-xs font-semibold text-brand-green">
                Đã xác minh trên Blockchain
              </p>
              {recipe.blockchain.transactionHash && (
                <p className="font-mono text-[10px] text-hub-muted">
                  TX: {recipe.blockchain.transactionHash.slice(0, 10)}...
                  {recipe.blockchain.transactionHash.slice(-8)}
                </p>
              )}
              {recipe.blockchain.blockNumber && (
                <p className="text-[10px] text-hub-muted">
                  Block: {recipe.blockchain.blockNumber}
                </p>
              )}
              {recipe.blockchain.timestamp && (
                <p className="text-[10px] text-hub-muted">
                  Đăng ký:{" "}
                  {new Date(recipe.blockchain.timestamp).toLocaleDateString(
                    "vi-VN",
                  )}
                </p>
              )}
            </div>
          )}
          {recipe.blockchain?.recipeHash && !recipe.blockchain?.isVerified && (
            <div className="card space-y-2 border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-semibold text-amber-900">
                {recipe.blockchain.verificationReason === "hash_already_exists"
                  ? "Công thức trùng lặp"
                  : recipe.blockchain.verificationReason === "no_wallet_address"
                    ? "Chưa kết nối MetaMask"
                    : "Chưa xác minh trên Blockchain"}
              </p>
              {recipe.blockchain.verificationReason ===
                "hash_already_exists" && (
                <p className="text-[10px] text-amber-800/80">
                  Công thức này có nội dung trùng với một công thức đã được đăng
                  ký trước đó trên blockchain.
                </p>
              )}
              {recipe.blockchain.verificationReason === "no_wallet_address" && (
                <p className="text-[10px] text-amber-800/80">
                  Kết nối MetaMask khi tạo công thức để đăng ký trên blockchain.
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-hub-ink hover:bg-hub-bg"
            >
              <FaPrint /> In công thức này
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-hub-ink hover:bg-hub-bg"
            >
              <FaShareAlt /> Chia sẻ cho bạn bè
            </button>
          </div>

          <div className="card space-y-3 p-5">
            <h3 className="font-serif text-lg text-brand-maroon">Ghi chú nhanh</h3>
            <textarea
              placeholder="Ghi lại biến tấu, thời gian nấu thực tế... (chỉ lưu tại trình duyệt)"
              className="input min-h-[100px]"
              onChange={(e) => {
                if (!recipe) return;
                const notes = JSON.parse(localStorage.getItem("notes") || "{}");
                notes[recipe._id] = e.target.value;
                localStorage.setItem("notes", JSON.stringify(notes));
              }}
              defaultValue={(() => {
                if (!recipe) return "";
                const notes = JSON.parse(localStorage.getItem("notes") || "{}");
                return notes[recipe._id] || "";
              })()}
            />
            <p className="text-[11px] text-hub-muted">
              Những ghi chú này sẽ không được đồng bộ lên máy chủ.
            </p>
          </div>

          <div className="hidden lg:block">
            <MediaGallery images={recipe.images} videoUrl={recipe.videoUrl} />
          </div>

          <div className="card space-y-3 p-5">
            <h3 className="font-serif text-lg text-brand-maroon">
              Công thức liên quan
            </h3>
            <Link
              to="/recipes"
              className="text-sm font-semibold text-brand-maroon hover:underline"
            >
              Khám phá thêm...
            </Link>
          </div>
        </aside>
      </div>

      {/* Comments */}
      <section className="border-t border-black/5 pt-10">
        <CommentList recipeId={recipe._id} recipe={recipe} />
      </section>

      <LoginRequiredModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <GenericReportModal
        open={!!reportTarget}
        target={reportTarget}
        targetType="recipe"
        onClose={closeReportModal}
        onSuccess={handleReportSuccess}
        onLoginRequired={() => {}}
      />

      <ReportLoginModal
        open={showReportLoginRequired}
        onClose={closeReportLoginModal}
        onLoginRedirect={handleReportLoginRedirect}
      />

      {reportToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-hub-ink px-5 py-3 text-sm font-medium text-white shadow-lg"
        >
          {reportToast}
        </div>
      )}
    </div>
  );
}
