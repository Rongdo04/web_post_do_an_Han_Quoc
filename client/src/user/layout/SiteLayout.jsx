import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuthAdapter } from "../../auth/useAuthAdapter.js";
import { useSiteSettings } from "../../contexts/SiteSettingsContext.jsx";
import CulinaryHubLogo from "../../components/common/CulinaryHubLogo.jsx";

function IconHeart({ className = "w-5 h-5" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.6"
      stroke="currentColor"
      className={className}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );
}

function IconBell({ className = "w-5 h-5" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.6"
      stroke="currentColor"
      className={className}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
      />
    </svg>
  );
}

function IconSearch({ className = "w-5 h-5" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.6"
      stroke="currentColor"
      className={className}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
}

export default function SiteLayout({ children, bare = false }) {
  const [mobileSearch, setMobileSearch] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const { isAuthenticated, user, role, logout } = useAuthAdapter();
  const { settings } = useSiteSettings();
  const brand = settings.brand || "CulinaryHub";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const submitSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setMobileSearch(false);
  };

  const navLinks = [
    { to: "/", label: "Trang chủ" },
    { to: "/recipes", label: "Danh sách" },
    { to: "/community", label: "Cộng đồng" },
  ];

  const authRedirect = encodeURIComponent(
    location.pathname + location.search,
  );

  return (
    <div className="relative isolate flex min-h-screen flex-col bg-hub-bg text-hub-ink">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:h-[72px] lg:gap-6 lg:px-8">
          <CulinaryHubLogo
            className="shrink-0"
            brand={brand}
            logoUrl={settings.logoUrl}
          />

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `relative px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "text-brand-maroon after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-brand-maroon"
                      : "text-hub-ink/75 hover:text-brand-maroon"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            {role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "text-brand-maroon"
                      : "text-hub-ink/75 hover:text-brand-maroon"
                  }`
                }
              >
                Quản trị
              </NavLink>
            )}
          </nav>

          <form
            onSubmit={submitSearch}
            className="relative ml-auto hidden min-w-0 flex-1 md:block md:max-w-xs lg:max-w-sm"
            role="search"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm công thức..."
              className="w-full rounded-full border border-black/10 bg-[#f4f2ef] py-2.5 pl-10 pr-4 text-sm text-hub-ink placeholder:text-hub-muted focus:border-brand-maroon/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20"
            />
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-hub-muted">
              <IconSearch className="h-4 w-4" />
            </span>
          </form>

          <div className="hidden items-center gap-2 md:flex lg:gap-3">
            <Link
              to={isAuthenticated ? "/submit" : `/auth/login?redirect=${authRedirect}`}
              className="btn-green whitespace-nowrap !rounded-lg !px-3.5 !py-2 text-sm"
            >
              + Đăng bài
            </Link>
            <Link
              to={isAuthenticated ? "/profile" : `/auth/login?redirect=${authRedirect}`}
              className="flex h-10 w-10 items-center justify-center rounded-full text-hub-ink/70 transition hover:bg-black/5 hover:text-brand-maroon"
              aria-label="Yêu thích"
              title="Yêu thích"
            >
              <IconHeart />
            </Link>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-hub-ink/70 transition hover:bg-black/5 hover:text-brand-maroon"
              aria-label="Thông báo"
              title="Thông báo"
            >
              <IconBell />
            </button>

            {!isAuthenticated ? (
              <Link
                to={`/auth/login?redirect=${authRedirect}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-hub-ink/70 transition hover:border-brand-maroon/30 hover:text-brand-maroon"
                aria-label="Đăng nhập"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.6"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </Link>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  aria-label="Mở menu người dùng"
                  className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-black/10 ring-offset-2 transition hover:ring-2 hover:ring-brand-maroon/30"
                >
                  <img
                    src={user?.avatar || "https://placehold.co/40x40?text=U"}
                    alt={user?.name || "Người dùng"}
                    className="h-full w-full object-cover"
                  />
                </button>
                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-black/8 bg-white p-1.5 shadow-lg"
                  >
                    <Link
                      to="/profile"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-hub-ink hover:bg-hub-bg"
                    >
                      Hồ sơ của tôi
                    </Link>
                    {role === "admin" && (
                      <Link
                        to="/admin"
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-hub-ink hover:bg-hub-bg"
                      >
                        Trang quản trị
                      </Link>
                    )}
                    <button
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
            )}
          </div>

          <div className="ml-auto flex items-center gap-2 md:hidden">
            <button
              aria-label="Mở tìm kiếm"
              onClick={() => setMobileSearch(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-hub-ink/70"
            >
              <IconSearch />
            </button>
            <Link
              to={isAuthenticated ? "/submit" : `/auth/login?redirect=${authRedirect}`}
              className="btn-green !rounded-lg !px-3 !py-2 text-xs"
            >
              + Đăng
            </Link>
            {isAuthenticated ? (
              <button
                onClick={() => navigate("/profile")}
                aria-label="Mở hồ sơ"
                className="flex h-10 w-10 overflow-hidden rounded-full border border-black/10"
              >
                <img
                  src={user?.avatar || "https://placehold.co/40x40?text=U"}
                  alt={user?.name || "Người dùng"}
                  className="h-full w-full object-cover"
                />
              </button>
            ) : (
              <Link
                to={`/auth/login?redirect=${authRedirect}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-xs font-semibold text-brand-maroon"
              >
                ĐN
              </Link>
            )}
          </div>
        </div>

        {mobileSearch && (
          <div className="border-t border-black/5 bg-white md:hidden">
            <form
              onSubmit={submitSearch}
              className="flex items-center gap-2 px-4 py-3"
            >
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm công thức..."
                className="flex-1 rounded-full border border-black/10 bg-[#f4f2ef] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-maroon/20"
              />
              <button type="submit" className="btn-brand !rounded-full !px-4">
                Tìm
              </button>
              <button
                type="button"
                onClick={() => setMobileSearch(false)}
                className="rounded-full px-3 py-2 text-sm text-hub-muted"
              >
                Đóng
              </button>
            </form>
          </div>
        )}
      </header>

      <main className={`flex-1 ${bare ? "" : "pb-12 pt-0"}`}>
        {bare ? (
          children
        ) : (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        )}
      </main>

      <footer className="mt-auto border-t border-black/8 bg-[#f0eeeb] text-hub-ink">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div className="space-y-4">
            <CulinaryHubLogo
              linkTo={null}
              brand={brand}
              logoUrl={settings.logoUrl}
            />
            <p className="max-w-xs text-sm leading-relaxed text-hub-muted">
              {settings.siteDesc}
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-hub-ink">
              Khám phá
            </h3>
            <ul className="space-y-2.5 text-sm text-hub-muted">
              <li>
                <Link className="hover:text-brand-maroon" to="/">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link className="hover:text-brand-maroon" to="/recipes">
                  Danh sách công thức
                </Link>
              </li>
              <li>
                <Link className="hover:text-brand-maroon" to="/community">
                  Cộng đồng
                </Link>
              </li>
              <li>
                <Link className="hover:text-brand-maroon" to="/submit">
                  Đăng bài mới
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-hub-ink">
              Hỗ trợ
            </h3>
            <ul className="space-y-2.5 text-sm text-hub-muted">
              <li>
                <Link className="hover:text-brand-maroon" to="/policy">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link className="hover:text-brand-maroon" to="/policy">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link className="hover:text-brand-maroon" to="/contact">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link className="hover:text-brand-maroon" to="/about">
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-hub-ink">
              Kết nối
            </h3>
            <div className="flex gap-3">
              {["IG", "FB", "X", "@"].map((label) => (
                <span
                  key={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green text-xs font-semibold text-white"
                  aria-hidden
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-black/8">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-hub-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p>
              © {new Date().getFullYear()} {brand}. Tất cả các quyền
              được bảo lưu.
            </p>
            <p>Thiết kế bởi Đội ngũ {brand}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
