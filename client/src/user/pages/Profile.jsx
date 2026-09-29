import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCog,
} from "react-icons/fa";
import MyRecipesTable from "../components/profile/MyRecipesTable";
import FavoritesGrid from "../components/profile/FavoritesGrid";
import AvatarEditor from "../components/profile/AvatarEditor";
import PasswordChanger from "../components/profile/PasswordChanger";
import { useSiteSettings } from "../../contexts/SiteSettingsContext.jsx";

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const { settings } = useSiteSettings();
  const brand = settings.brand || "CulinaryHub";
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("favorites");
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [showPasswordChanger, setShowPasswordChanger] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [recipeCount, setRecipeCount] = useState(0);
  const [favCount] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]").length;
    } catch {
      return 0;
    }
  });

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleLogout = async () => {
    try {
      await logout?.();
      navigate("/auth/login");
    } catch (e) {
      console.error(e);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="card max-w-md space-y-3 p-10 text-center">
          <h1 className="font-serif text-2xl text-brand-maroon">
            Vui lòng đăng nhập
          </h1>
          <p className="text-hub-muted">
            Bạn cần đăng nhập để xem trang cá nhân
          </p>
        </div>
      </div>
    );
  }

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("vi-VN", {
        month: "short",
        year: "numeric",
      })
    : "—";

  const tabs = [
    { id: "favorites", label: "Đã lưu" },
    { id: "recipes", label: "Công thức của tôi" },
    { id: "collections", label: "Bộ sưu tập" },
  ];

  const DEFAULT_COVER =
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80";
  const coverSrc = user.coverImage || DEFAULT_COVER;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Banner + profile — cover fills entire section */}
        <section
          className="relative overflow-hidden rounded-2xl border border-black/5 shadow-sm"
          style={{
            backgroundImage: `url('${coverSrc}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />
          <button
            type="button"
            onClick={() => setShowAvatarEditor(true)}
            className="absolute right-3 top-3 z-10 rounded-lg bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-black/65"
          >
            Đổi ảnh bìa
          </button>

          <div className="relative z-10 px-5 pb-6 pt-16 sm:px-8 sm:pt-20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowAvatarEditor(true)}
                  className="relative shrink-0"
                  aria-label="Đổi avatar"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md sm:h-28 sm:w-28"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-hub-bg text-3xl font-bold text-brand-maroon shadow-md sm:h-28 sm:w-28">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </button>
                <div className="pb-1 text-white">
                  <h1 className="font-serif text-2xl font-bold sm:text-3xl">
                    {user.name}
                  </h1>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {user.role === "admin"
                        ? "Quản trị viên"
                        : `Thành viên ${brand}`}
                    </span>
                    {(user.location || user.city) && (
                      <span className="inline-flex items-center gap-1 text-xs text-white/85">
                        <FaMapMarkerAlt /> {user.location || user.city}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-xs text-white/85">
                      <FaCalendarAlt /> Tham gia {joinDate}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAvatarEditor(true)}
                  className="rounded-xl border border-white/30 bg-white/95 px-4 py-2 text-sm font-medium text-hub-ink hover:bg-white"
                >
                  Chỉnh sửa hồ sơ
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordChanger(true)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/95 text-hub-muted hover:bg-white"
                  aria-label="Cài đặt"
                >
                  <FaCog />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Công thức", value: recipeCount || "—" },
            { label: "Người theo dõi", value: user.followersCount ?? "—" },
            { label: "Đang theo dõi", value: user.followingCount ?? "—" },
            { label: "Lượt yêu thích", value: favCount },
          ].map((stat) => (
            <div
              key={stat.label}
              className="card px-4 py-5 text-center"
            >
              <p className="font-serif text-2xl font-bold text-brand-maroon">
                {stat.value}
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-hub-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="grid gap-8 lg:grid-cols-3">
          <aside className="space-y-5">
            <div className="card space-y-4 p-5">
              <h3 className="font-serif text-lg text-brand-maroon">
                Hoạt động gần đây
              </h3>
              <ul className="space-y-3 text-sm text-hub-muted">
                <li className="flex justify-between gap-2 border-b border-black/5 pb-2">
                  <span>Đã lưu công thức yêu thích</span>
                  <span className="shrink-0 text-xs">Gần đây</span>
                </li>
                <li className="flex justify-between gap-2 border-b border-black/5 pb-2">
                  <span>Cập nhật hồ sơ cá nhân</span>
                  <span className="shrink-0 text-xs">—</span>
                </li>
                <li className="flex justify-between gap-2">
                  <span>Tham gia cộng đồng {brand}</span>
                  <span className="shrink-0 text-xs">{joinDate}</span>
                </li>
              </ul>
            </div>
            <div className="card space-y-3 p-5">
              <h3 className="font-serif text-lg text-brand-maroon">
                Giới thiệu bản thân
              </h3>
              <p className="text-sm italic leading-relaxed text-hub-muted">
                {user.bio ||
                  `Yêu ẩm thực và thích chia sẻ những công thức ngon mỗi ngày trên ${brand}.`}
              </p>
              <p className="text-xs text-hub-muted">{user.email}</p>
            </div>
          </aside>

          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              <div className="border-b border-black/5 px-2">
                <nav className="flex flex-wrap gap-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative px-4 py-3.5 text-sm font-semibold uppercase tracking-wide transition ${
                        activeTab === tab.id
                          ? "text-brand-maroon"
                          : "text-hub-muted hover:text-hub-ink"
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand-maroon" />
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-5">
                {activeTab === "favorites" && (
                  <FavoritesGrid userId={user.id || user._id} />
                )}
                {activeTab === "recipes" && (
                  <MyRecipesTable
                    userId={user.id || user._id}
                    onCountChange={setRecipeCount}
                  />
                )}
                {activeTab === "collections" && (
                  <div className="space-y-4">
                    <p className="text-sm text-hub-muted">
                      Bộ sưu tập công thức đã lưu của bạn.
                    </p>
                    <FavoritesGrid userId={user.id || user._id} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <section className="space-y-4">
          <h2 className="font-serif text-2xl text-brand-maroon">
            Bảo mật & Tài khoản
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card space-y-2 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-hub-muted">
                Hạng thành viên
              </p>
              <p className="font-serif text-xl text-brand-maroon">
                {user.role === "admin" ? "Quản trị" : "Thường"}
              </p>
              <p className="text-sm text-hub-muted">
                Quản lý bảo mật và thông tin đăng nhập của bạn.
              </p>
            </div>
            <div className="card flex flex-col justify-center gap-3 p-5">
              <button
                type="button"
                onClick={() => setShowPasswordChanger(true)}
                className="btn-brand !bg-brand-brown"
              >
                Thay đổi mật khẩu
              </button>
              <button
                type="button"
                onClick={() => setShowAvatarEditor(true)}
                className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-hub-ink hover:bg-hub-bg"
              >
                Cập nhật ảnh đại diện & ảnh bìa
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm font-medium text-rose-600 hover:underline"
              >
                Đăng xuất tài khoản
              </button>
            </div>
          </div>
        </section>

        {showAvatarEditor && (
          <AvatarEditor
            onClose={() => setShowAvatarEditor(false)}
            onSuccess={(message) => showNotification(message, "success")}
          />
        )}

        {showPasswordChanger && (
          <PasswordChanger
            onClose={() => setShowPasswordChanger(false)}
            onSuccess={(message) => showNotification(message, "success")}
          />
        )}

        {notification.show && (
          <div className="fixed right-4 top-4 z-50">
            <div
              className={`rounded-2xl px-6 py-3 shadow-lg ${
                notification.type === "success"
                  ? "border border-brand-green/20 bg-white text-hub-ink"
                  : "border border-red-200 bg-red-50 text-red-800"
              }`}
            >
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
