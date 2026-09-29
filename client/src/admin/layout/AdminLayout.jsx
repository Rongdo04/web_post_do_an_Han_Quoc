import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useAdminApi } from "../contexts/AdminApiContext.jsx";
import { APIErrorDisplay } from "../components/ErrorBoundary.jsx";
import { t } from "../../i18n/index.js"; // added

const navItems = [
  { to: "/admin", label: t("nav.dashboard", "Bảng điều khiển"), exact: true },
  { to: "/admin/recipes", label: t("nav.recipes", "Công thức") },
  { to: "/admin/posts", label: t("nav.posts", "Bài viết") },
  { to: "/admin/media", label: t("nav.media", "Thư viện media") },
  { to: "/admin/taxonomy", label: t("nav.taxonomy", "Danh mục & Thẻ") },
  { to: "/admin/moderation", label: t("nav.moderation", "Kiểm duyệt") },
  { to: "/admin/reports", label: t("nav.reports", "Báo cáo") },
  { to: "/admin/users", label: t("nav.users", "Người dùng") },
  { to: "/admin/settings", label: t("nav.settings", "Cài đặt") },
  { to: "/admin/api-test", label: "API Test", dev: true }, // Development only
];

function Sidebar({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-1 p-4 text-sm">
      {navItems
        .filter((item) => !item.dev || import.meta.env.DEV) // Only show dev items in development
        .map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            onClick={onNavigate}
            className={({ isActive }) =>
              `inline-flex items-center gap-2 rounded-2xl px-3 py-2.5 font-medium transition ${
                isActive
                  ? "bg-[rgba(255,255,255,0.12)] text-[#f4dcc0] shadow-[0_12px_24px_-18px_rgba(0,0,0,0.45)]"
                  : "text-[#f7ead6]/76 hover:bg-white/8 hover:text-white"
              }`
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${
                item.dev ? "bg-yellow-400/80" : "bg-[#f0c99a]"
              }`}
            />
            {item.label}
            {item.dev && (
              <span className="text-[10px] bg-yellow-400 text-black px-1 rounded">
                DEV
              </span>
            )}
          </NavLink>
        ))}
    </nav>
  );
}

export default function AdminLayout() {
  const { user, logout, isAuthenticated } = useAuth();
  const { handleApiError } = useAdminApi();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Clear API errors when route changes
  useEffect(() => {
    setApiError(null);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // Check if user has admin access
  const hasAdminAccess = isAuthenticated && user?.role === "admin";

  if (!hasAdminAccess) {
    // This shouldn't happen due to RouteGuard, but just in case
    return (
      <div className="min-h-screen flex items-center justify-center">
        <APIErrorDisplay
          error={{
            isForbidden: true,
            message: "Bạn không có quyền truy cập khu vực quản trị",
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[linear-gradient(180deg,#fffdf8_0%,#f5ebde_100%)] text-[#211819]">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 flex-col bg-[linear-gradient(180deg,#2f1818_0%,#4a1717_55%,#7f1d1d_100%)] text-white md:flex">
        <div className="border-b border-white/10 px-4 py-5">
          <Link
            to="/"
            className="block transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f1c89b]/60"
            aria-label="Về trang chủ"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f1c89b]">
              Control Room
            </div>
            <div className="mt-2 font-serif text-xl font-semibold text-[#fff2df]">
              K-FOOD ADMIN
            </div>
          </Link>
        </div>
        <Sidebar />
        <div className="mt-auto p-4 text-xs text-[#f7ead6]/72">
          {user && (
            <div className="mb-4 rounded-[24px] border border-white/10 bg-white/6 p-3">
              <div className="text-sm font-semibold text-[#fff4e7]">
                {user.name}
              </div>
              <div className="text-[#f7ead6]/62">{user.email}</div>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full rounded-2xl border border-white/10 px-3 py-2 text-left text-xs text-[#fff0df] transition hover:bg-white/8"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute bottom-0 left-0 top-0 flex w-64 flex-col bg-[linear-gradient(180deg,#2f1818_0%,#4a1717_55%,#7f1d1d_100%)] text-white transform transition-transform ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="border-b border-white/10 px-4 py-5">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="block transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f1c89b]/60"
              aria-label="Về trang chủ"
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f1c89b]">
                Control Room
              </div>
              <div className="mt-2 font-serif text-xl font-semibold text-[#fff2df]">
                K-FOOD ADMIN
              </div>
            </Link>
          </div>
          <Sidebar onNavigate={() => setOpen(false)} />
          <div className="mt-auto p-4 text-xs text-[#f7ead6]/72">
            {user && (
              <div className="mb-4 rounded-[24px] border border-white/10 bg-white/6 p-3">
                <div className="text-sm font-semibold text-[#fff4e7]">
                  {user.name}
                </div>
                <div className="text-[#f7ead6]/62">{user.email}</div>
              </div>
            )}
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="w-full rounded-2xl border border-white/10 px-3 py-2 text-left text-xs text-[#fff0df] transition hover:bg-white/8"
            >
              Đăng xuất
            </button>
          </div>
        </aside>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="relative z-10 flex h-20 items-center justify-between border-b border-[rgba(74,23,23,0.08)] bg-[rgba(255,250,242,0.88)] px-4 text-[#311818] shadow-[0_10px_28px_-24px_rgba(74,23,23,0.42)] backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgba(74,23,23,0.12)] bg-white/72 transition hover:bg-white md:hidden"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="sr-only">Toggle menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 5.25h16.5M3.75 12h16.5m-16.5 6.75h16.5"
                />
              </svg>
            </button>
            <div className="hidden sm:block">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9a6b47]">
                Admin Workspace
              </p>
              <h1 className="mt-1 text-xl font-semibold tracking-wide text-[#311818]">
                {t("nav.dashboard", "Bảng điều khiển")}
              </h1>
            </div>
          </div>
          <div className="relative flex items-center gap-3 text-sm" ref={menuRef}>
            {user && (
              <span className="hidden max-w-[140px] truncate text-[#6f5b4f] sm:inline">
                {user.name}
              </span>
            )}
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Mở menu người dùng"
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[rgba(74,23,23,0.12)] bg-white ring-offset-2 transition hover:ring-2 hover:ring-[#d4a373]/50 focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
            >
              <img
                src={user?.avatar || "https://placehold.co/40x40?text=A"}
                alt={user?.name || "Admin"}
                className="h-full w-full object-cover"
              />
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-[rgba(74,23,23,0.08)] bg-white p-1.5 shadow-lg"
              >
                <Link
                  to="/profile"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-[#311818] hover:bg-[#f5ebde]"
                >
                  Hồ sơ của tôi
                </Link>
                <Link
                  to="/"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-[#311818] hover:bg-[#f5ebde]"
                >
                  Về trang chủ
                </Link>
                <Link
                  to="/admin"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-[#311818] hover:bg-[#f5ebde]"
                >
                  Trang quản trị
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                    navigate("/");
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </header>
        {/* Content */}
        <main className="space-y-6 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
