import React, { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setEmail("");
  };
  return (
    <section
      className="relative overflow-hidden rounded-[36px] bg-brand p-10 text-[#fff5e8] shadow-brand"
      aria-labelledby="newsletter-title"
    >
      <div className="max-w-xl space-y-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f1c89b]">
          Weekly Table Notes
        </p>
        <h2
          id="newsletter-title"
          className="text-3xl font-semibold tracking-tight"
        >
          Nhận công thức mới mỗi tuần
        </h2>
        <p className="text-sm leading-relaxed text-[#fff0df]/82">
          Đăng ký nhận bản tin: tổng hợp công thức món Hàn nổi bật và mẹo nấu ăn
          ngắn gọn, dễ áp dụng tại nhà.
        </p>
        <form
          onSubmit={submit}
          className="flex flex-col sm:flex-row gap-3"
          aria-label="Đăng ký newsletter"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email của bạn"
            aria-label="Email"
            className="flex-1 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-[#fff7ec] placeholder:text-[#f8dfc0]/58 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#f1c89b]"
          />
          <button
            type="submit"
            className="rounded-2xl bg-[linear-gradient(135deg,#f6e1bc_0%,#d7a36d_100%)] px-6 py-3 text-sm font-semibold text-[#4a1717] shadow-lg transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-[#f6e1bc]"
          >
            Đăng ký
          </button>
        </form>
        {submitted && (
          <div
            role="status"
            aria-live="polite"
            className="text-sm text-[#f7e0c2]"
          >
            Cảm ơn! Bạn sẽ nhận email sớm.
          </div>
        )}
      </div>
      <div
        className="absolute -bottom-10 -right-10 h-80 w-80 rounded-full bg-white/10 blur-2xl"
        aria-hidden="true"
      />
    </section>
  );
}
