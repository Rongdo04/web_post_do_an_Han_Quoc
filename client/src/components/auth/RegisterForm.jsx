import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../ui/LoadingSpinner";
import Toast from "../../user/components/Toast";
import { useSiteSettings } from "../../contexts/SiteSettingsContext.jsx";

const REGISTER_IMG =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQQbRS6EUMUBpjs5jlPu_juWeRnPVCY1h39T9SAHD1VmNOe8rqLVMKoi4e&s=10";

const RegisterForm = () => {
  const { settings } = useSiteSettings();
  const brand = settings.brand || "CulinaryHub";
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [toastState, setToastState] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
    autoHide: 3000,
  });
  const showToast = (type, title, message, autoHide = 3000) =>
    setToastState({ open: true, type, title, message, autoHide });
  const closeToast = () => setToastState((p) => ({ ...p, open: false }));

  const redirectTimer = useRef(null);
  useEffect(
    () => () => redirectTimer.current && clearTimeout(redirectTimer.current),
    [],
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = `${formData.firstName} ${formData.lastName}`.trim();

    if (
      !name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      showToast(
        "error",
        "Thiếu thông tin",
        "Vui lòng điền đầy đủ thông tin",
        2500,
      );
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showToast(
        "error",
        "Mật khẩu không khớp",
        "Mật khẩu xác nhận không khớp",
        3000,
      );
      return;
    }
    if (formData.password.length < 6) {
      showToast(
        "error",
        "Mật khẩu yếu",
        "Mật khẩu phải có ít nhất 6 ký tự",
        3000,
      );
      return;
    }

    try {
      setIsLoading(true);
      const response = await register({
        name,
        email: formData.email,
        password: formData.password,
      });
      const user = response.data.user;
      showToast(
        "success",
        "Đăng ký thành công",
        `Chào mừng ${user.name}!`,
        1800,
      );
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
        "Đăng ký thất bại",
        error.response?.data?.message || "Đăng ký thất bại",
        3000,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toast {...toastState} onClose={closeToast} />
      <div className="overflow-hidden rounded-2xl border border-black/8 bg-white shadow-lg lg:grid lg:grid-cols-2">
        <div className="relative hidden min-h-[640px] lg:block">
          <img
            src={REGISTER_IMG}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          <div className="absolute inset-x-0 bottom-0 space-y-4 p-10 text-white">
            <h2 className="font-serif text-3xl font-bold leading-snug">
              Nâng tầm kỹ năng nấu nướng của bạn
            </h2>
            <p className="text-sm text-white/85">
              Tham gia cộng đồng hơn 50.000 người yêu ẩm thực.
            </p>
            <ul className="space-y-2 text-sm text-white/90">
              {[
                "Lưu trữ công thức yêu thích không giới hạn",
                "Kết nối với các đầu bếp chuyên nghiệp",
                "Nhận thông báo về các món ăn xu hướng",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 text-emerald-300">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-8 sm:p-10 lg:p-12">
          <div className="mb-6">
            <h1 className="font-serif text-3xl font-bold text-hub-ink">
              Tạo tài khoản mới
            </h1>
            <p className="mt-2 text-sm text-hub-muted">
              Chào mừng bạn đến với cộng đồng Bếp Ấm {brand}.
            </p>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="rounded-xl border border-black/10 px-4 py-3 text-sm font-medium hover:bg-hub-bg"
            >
              Google
            </button>
            <button
              type="button"
              className="rounded-xl border border-black/10 px-4 py-3 text-sm font-medium hover:bg-hub-bg"
            >
              Facebook
            </button>
          </div>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 font-semibold uppercase tracking-wider text-hub-muted">
                Hoặc sử dụng email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-hub-muted">
                  Họ và tên đệm
                </label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input"
                  placeholder="Nguyễn Văn"
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-hub-muted">
                  Tên
                </label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input"
                  placeholder="A"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-hub-muted">
                Địa chỉ email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="example@email.com"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-hub-muted">
                Số điện thoại
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input"
                placeholder="0901234567"
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-hub-muted">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="input !pr-12"
                    placeholder="••••••••"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-hub-muted"
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-hub-muted">
                  Xác nhận mật khẩu
                </label>
                <input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input"
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-hub-muted">
              <input
                type="checkbox"
                required
                className="mt-0.5 rounded border-black/20 text-brand-maroon"
              />
              Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của{" "}
              {brand}.
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-brand w-full !rounded-xl !py-3.5"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <LoadingSpinner size="sm" /> Đang đăng ký...
                </span>
              ) : (
                "Đăng ký ngay →"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-hub-muted">
            Bạn đã có tài khoản?{" "}
            <Link
              to="/auth/login"
              className="font-semibold text-brand-maroon hover:underline"
            >
              Đăng nhập tại đây
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
