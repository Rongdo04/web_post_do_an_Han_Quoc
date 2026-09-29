import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../ui/LoadingSpinner";
import Toast from "../../user/components/Toast";

const LOGIN_IMG =
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [toastState, setToastState] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
    autoHide: 3000,
  });

  const showToast = (type, title, message, autoHide = 3000) => {
    setToastState({ open: true, type, title, message, autoHide });
  };
  const closeToast = () => setToastState((prev) => ({ ...prev, open: false }));

  const redirectTimer = useRef(null);
  useEffect(() => {
    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      showToast("error", "Thiếu thông tin", "Vui lòng điền đầy đủ thông tin", 2500);
      return;
    }
    try {
      setIsLoading(true);
      const response = await login(formData);
      const user = response.data.user;
      showToast("success", "Đăng nhập thành công", `Chào mừng, ${user.name}!`, 1800);
      redirectTimer.current = setTimeout(() => {
        const params = new URLSearchParams(location.search);
        const redirectParam = params.get("redirect");
        if (redirectParam) navigate(redirectParam, { replace: true });
        else if (user.role === "admin") navigate("/admin", { replace: true });
        else navigate("/dashboard", { replace: true });
      }, 600);
    } catch (error) {
      showToast(
        "error",
        "Đăng nhập thất bại",
        error?.response?.data?.message || "Đăng nhập thất bại",
        3000,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toast
        open={toastState.open}
        type={toastState.type}
        title={toastState.title}
        message={toastState.message}
        autoHide={toastState.autoHide}
        onClose={closeToast}
      />

      <div className="overflow-hidden rounded-2xl border border-black/8 bg-white shadow-lg lg:grid lg:grid-cols-2">
        <div className="relative hidden min-h-[520px] lg:block">
          <img src={LOGIN_IMG} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />
          <div className="absolute inset-x-0 bottom-0 space-y-3 p-10 text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur">
              Cảm hứng từ bếp ấm
            </span>
            <h2 className="font-serif text-3xl font-bold leading-snug">
              Nơi hội ngộ của những tâm hồn yêu bếp.
            </h2>
            <p className="text-sm leading-relaxed text-white/85">
              Tham gia cộng đồng để khám phá công thức độc đáo và chia sẻ bí quyết ẩm thực của riêng bạn.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-hub-ink">Chào mừng trở lại</h1>
            <p className="mt-2 text-sm text-hub-muted">
              Đăng nhập để tiếp tục hành trình khám phá ẩm thực của bạn.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-hub-muted">
                Email
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-hub-muted">✉</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input !pl-10"
                  placeholder="ten@vidu.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-hub-muted">
                  Mật khẩu
                </label>
                <Link to="/auth/forgot-password" className="text-xs font-semibold text-brand-maroon hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-hub-muted">🔒</span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input !pl-10 !pr-12"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-hub-muted hover:text-brand-maroon"
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-hub-muted">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-black/20 text-brand-maroon focus:ring-brand-maroon"
              />
              Ghi nhớ đăng nhập
            </label>

            <button type="submit" disabled={isLoading} className="btn-brand w-full !rounded-xl !py-3.5">
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <LoadingSpinner size="sm" /> Đang đăng nhập...
                </span>
              ) : (
                "Đăng nhập →"
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 font-semibold uppercase tracking-wider text-hub-muted">
                Hoặc đăng nhập với
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium hover:bg-hub-bg">
              Google
            </button>
            <button type="button" className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium hover:bg-hub-bg">
              Facebook
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-hub-muted">
            Chưa có tài khoản?{" "}
            <Link to="/auth/register" className="font-semibold text-brand-maroon hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
