import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
// import { toast } from "react-toastify";
import authAPI from "../../services/authAPI";
import LoadingSpinner from "../ui/LoadingSpinner";
import Toast from "../../user/components/Toast";

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Toast state
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

    if (!token) {
      showToast(
        "error",
        "Token không hợp lệ",
        "Token khôi phục không hợp lệ",
        3000,
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
      await authAPI.resetPassword(token, formData.password);
      showToast("success", "Thành công", "Đặt lại mật khẩu thành công!", 1800);
      redirectTimer.current = setTimeout(() => {
        navigate("/login"); // đổi thành /auth/login nếu app bạn dùng path đó
      }, 600);
    } catch (error) {
      showToast(
        "error",
        "Lỗi",
        error.response?.data?.message || "Lỗi khi đặt lại mật khẩu",
        3000,
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <>
        <Toast {...toastState} onClose={closeToast} />
        <div className="text-center">
          <div className="mb-4 text-6xl text-[#b45309]">⚠️</div>
          <h3 className="mb-2 text-xl font-semibold text-[#311818]">
            Token không hợp lệ
          </h3>
          <p className="mb-6 text-[#6f5b4f]">
            Link khôi phục mật khẩu không hợp lệ hoặc đã hết hạn.
          </p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="w-full rounded-2xl bg-brand px-4 py-3 font-medium text-white shadow-brand transition hover:brightness-105"
          >
            Gửi lại email khôi phục
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Toast {...toastState} onClose={closeToast} />
      <div>
        <div className="text-center mb-6">
          <div className="mb-4 text-6xl text-[#b45309]">🔒</div>
          <h3 className="mb-2 text-xl font-semibold text-[#311818]">
            Đặt lại mật khẩu
          </h3>
          <p className="text-sm text-[#6f5b4f]">
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#5d3029]"
            >
              Mật khẩu mới
            </label>
            <div className="relative group">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="peer w-full rounded-2xl border border-[rgba(74,23,23,0.12)] bg-[#fffaf3] px-4 py-3 shadow-sm transition placeholder:text-[#b79b84] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
                placeholder="Nhập mật khẩu mới"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#b79b84] transition hover:text-[#7f1d1d]"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
              <span className="pointer-events-none absolute -top-2 left-2 bg-[rgba(255,250,242,0.98)] px-1 text-[10px] font-medium uppercase tracking-wider text-[#9a6b47] opacity-0 transition peer-focus:opacity-100">
                Mật khẩu mới
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-[#5d3029]"
            >
              Xác nhận mật khẩu
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-2xl border border-[rgba(74,23,23,0.12)] bg-[#fffaf3] px-4 py-3 shadow-sm transition placeholder:text-[#b79b84] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
              placeholder="Nhập lại mật khẩu mới"
              disabled={isLoading}
            />
          </div>

          {/* Password Requirements */}
          <div className="rounded-2xl bg-[#fbf2e5] p-3 ring-1 ring-[rgba(74,23,23,0.05)]">
            <p className="mb-1 text-sm font-medium text-[#311818]">
              Yêu cầu mật khẩu:
            </p>
            <ul className="space-y-1 text-xs text-[#6f5b4f]">
              <li>• Ít nhất 6 ký tự</li>
              <li>• Nên bao gồm chữ hoa, chữ thường và số</li>
              <li>• Tránh sử dụng thông tin cá nhân</li>
            </ul>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full rounded-2xl bg-brand px-4 py-3 font-medium text-white shadow-brand transition focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:ring-offset-2 focus:ring-offset-[rgba(255,250,242,0.98)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-[#f6e1bc]/0 to-white/0 transition group-hover:via-[#f6e1bc]/10" />
            {isLoading ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="sm" />
                <span className="ml-2">Đang xử lý...</span>
              </div>
            ) : (
              <span className="relative">Đặt lại mật khẩu</span>
            )}
          </button>

          {/* Back to Login */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/auth/login")}
              className="text-sm font-semibold text-[#7f1d1d] transition-colors hover:text-[#5d3029]"
            >
              ← Quay lại đăng nhập
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ResetPasswordForm;
