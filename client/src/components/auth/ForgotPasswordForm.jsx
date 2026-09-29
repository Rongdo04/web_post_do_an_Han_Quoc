import React, { useState } from "react";
import { Link } from "react-router-dom";
import authAPI from "../../services/authAPI";
import LoadingSpinner from "../ui/LoadingSpinner";
import Toast from "../../user/components/Toast";

const FORGOT_IMG =
  "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1200&q=80";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast("error", "Thiếu email", "Vui lòng nhập email", 2500);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast("error", "Email không hợp lệ", "Email không hợp lệ", 3000);
      return;
    }
    try {
      setIsLoading(true);
      await authAPI.forgotPassword(email);
      setIsEmailSent(true);
      showToast("success", "Đã gửi email", "Email khôi phục đã được gửi!", 2500);
    } catch (error) {
      showToast(
        "error",
        "Gửi thất bại",
        error.response?.data?.message || "Lỗi khi gửi email khôi phục",
        3000,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toast {...toastState} onClose={closeToast} />
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-black/8 bg-white shadow-lg lg:grid lg:grid-cols-2">
        <div className="relative hidden min-h-[420px] lg:block">
          <img src={FORGOT_IMG} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 space-y-2 p-8 text-white">
            <p className="font-serif text-xl font-semibold leading-snug">
              &ldquo;Nơi mọi công thức đều bắt đầu từ sự sẻ chia.&rdquo;
            </p>
            <p className="text-sm text-white/80">
              Lấy lại quyền truy cập vào kho tàng ẩm thực của riêng bạn.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center p-8 sm:p-10">
          {isEmailSent ? (
            <div className="space-y-5 text-center">
              <div className="text-5xl">📧</div>
              <h1 className="font-serif text-3xl font-bold text-hub-ink">Kiểm tra email</h1>
              <p className="text-sm text-hub-muted">
                Chúng tôi đã gửi link khôi phục mật khẩu đến{" "}
                <span className="font-semibold text-hub-ink">{email}</span>
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsEmailSent(false);
                  setEmail("");
                }}
                className="btn-brand w-full !rounded-xl"
              >
                Gửi lại email
              </button>
              <Link to="/auth/login" className="block text-sm font-semibold text-brand-maroon hover:underline">
                ← Quay lại đăng nhập
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-serif text-3xl font-bold text-hub-ink">Quên mật khẩu?</h1>
              <p className="mt-2 text-sm leading-relaxed text-hub-muted">
                Đừng lo lắng, hãy nhập email của bạn và chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-hub-muted">
                    Địa chỉ email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    placeholder="example@email.com"
                    disabled={isLoading}
                    required
                  />
                </div>
                <button type="submit" disabled={isLoading} className="btn-brand w-full !rounded-xl !py-3.5">
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <LoadingSpinner size="sm" /> Đang gửi...
                    </span>
                  ) : (
                    "Gửi yêu cầu khôi phục"
                  )}
                </button>
              </form>

              <Link
                to="/auth/login"
                className="mt-6 inline-flex text-sm font-semibold uppercase tracking-wide text-brand-maroon hover:underline"
              >
                ← Quay lại đăng nhập
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordForm;
