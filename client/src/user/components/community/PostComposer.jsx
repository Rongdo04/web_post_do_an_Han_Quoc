import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { FaImage, FaTag } from "react-icons/fa";

export default function PostComposer({ onPost }) {
  const { user, isAuthenticated } = useAuth();
  const [text, setText] = useState("");
  const [tag, setTag] = useState("Kinh nghiệm");
  const tags = ["Kinh nghiệm", "Hỏi đáp", "Món mới", "Nguyên liệu"];

  const submit = (e) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;

    const postUser =
      isAuthenticated && user
        ? {
            id: user.id || user._id,
            name: user.name || user.username,
            avatar: user.avatar || "https://placehold.co/80x80?text=U",
          }
        : {
            id: "u_local",
            name: "Người dùng ẩn danh",
            avatar: "https://placehold.co/80x80?text=U",
          };

    onPost?.({
      id: Date.now(),
      user: postUser,
      tag,
      content,
      createdAt: new Date().toISOString(),
    });
    setText("");
  };

  return (
    <form onSubmit={submit} className="card space-y-4 p-5" aria-label="Tạo bài viết">
      <div className="flex items-start gap-4">
        <img
          src={
            isAuthenticated && user?.avatar
              ? user.avatar
              : "https://placehold.co/64x64?text=U"
          }
          alt="Avatar"
          className="h-12 w-12 rounded-full object-cover ring-2 ring-black/5"
        />
        <div className="flex-1 space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Bạn đang nghĩ gì về món ăn hôm nay?"
            className="input resize-none !rounded-2xl"
            aria-label="Nội dung bài"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 text-sm text-hub-muted">
              <span className="inline-flex items-center gap-1.5">
                <FaImage /> Ảnh/video
              </span>
              <label className="inline-flex items-center gap-1.5">
                <FaTag />
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="rounded-lg border border-black/10 bg-white px-2 py-1 text-xs font-medium text-hub-ink focus:outline-none focus:ring-2 focus:ring-brand-maroon/25"
                  aria-label="Chọn thẻ"
                >
                  {tags.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              type="submit"
              disabled={!text.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-brown px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
              aria-label="Đăng bài"
            >
              Đăng bài
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
