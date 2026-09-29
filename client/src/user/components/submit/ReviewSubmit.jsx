import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useMetaMask } from "../../../hooks/useMetaMask.js";

export default function ReviewSubmit({
  data,
  onEditStep,
  onSaveDraft,
  onSubmit,
  submitting,
}) {
  const {
    account,
    isConnected,
    isConnecting,
    isMetaMaskInstalled,
    error: metamaskError,
    connect,
  } = useMetaMask();

  const handleSubmit = () => {
    onSubmit(account);
  };
  const totalTime =
    (data.prepTime || data.durationPrep || 0) +
    (data.cookTime || data.durationCook || 0);

  return (
    <div className="space-y-6">
      <header className="rounded-2xl bg-brand-maroon p-6 text-white shadow-brand">
        <h2 className="font-serif text-xl font-semibold">Xem trước</h2>
        <p className="mt-1 text-sm text-white/80">
          Kiểm tra lại thông tin trước khi xuất bản công thức.
        </p>
      </header>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <InfoCard data={data} onEditStep={onEditStep} />
          <IngredientsCard data={data} onEditStep={onEditStep} />
          <StepsCard data={data} onEditStep={onEditStep} />
          <MediaCard data={data} onEditStep={onEditStep} />
        </div>
        <aside className="h-fit space-y-4 lg:sticky lg:top-20">
          <div className="card space-y-4 p-5">
            <h3 className="font-serif text-lg text-brand-maroon">Tóm tắt</h3>
            <ul className="space-y-1 text-sm text-hub-ink">
              <li>
                Tiêu đề: <strong>{data.title || "—"}</strong>
              </li>
              <li>Thời gian: {totalTime} phút</li>
              <li>Khẩu phần: {data.servings || "—"}</li>
              <li>Nguyên liệu: {data.ingredients.length}</li>
              <li>Bước: {data.steps.length}</li>
            </ul>

            <div className="space-y-2 border-t border-black/5 pt-3">
              <p className="text-xs font-medium text-hub-ink">
                Bảo vệ bản quyền với Blockchain
              </p>
              {!isMetaMaskInstalled ? (
                <p className="text-xs text-hub-muted">
                  Cài đặt MetaMask để bảo vệ công thức của bạn
                </p>
              ) : !isConnected ? (
                <button
                  type="button"
                  onClick={connect}
                  disabled={isConnecting}
                  className="w-full rounded-lg bg-orange-500 px-3 py-2 text-xs font-medium text-white hover:bg-orange-600 disabled:opacity-50"
                >
                  {isConnecting ? "Đang kết nối..." : "Kết nối MetaMask"}
                </button>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs text-brand-green">
                    <FaCheckCircle className="mr-1 inline" /> Đã kết nối:{" "}
                    {account?.slice(0, 6)}...{account?.slice(-4)}
                  </p>
                  <p className="text-[10px] text-hub-muted">
                    Công thức sẽ được bảo vệ trên blockchain
                  </p>
                </div>
              )}
              {metamaskError && (
                <p className="text-xs text-red-600">{metamaskError}</p>
              )}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="btn-brand w-full disabled:opacity-50"
              >
                {submitting ? "Đang gửi..." : "Xuất bản công thức"}
              </button>
              <button
                type="button"
                onClick={onSaveDraft}
                className="w-full rounded-xl border border-black/10 bg-hub-bg px-4 py-2.5 text-sm font-medium text-hub-ink hover:bg-white"
              >
                Lưu bản nháp
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function CardShell({ title, step, onEdit, children }) {
  return (
    <section className="card space-y-3 p-5">
      <header className="flex items-center justify-between">
        <h3 className="font-serif text-base text-brand-maroon">{title}</h3>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="text-xs font-medium text-brand-maroon hover:underline"
        >
          Chỉnh sửa
        </button>
      </header>
      {children}
    </section>
  );
}

const InfoCard = ({ data, onEditStep }) => (
  <CardShell title="Thông tin" step={0} onEdit={onEditStep}>
    <p className="text-sm font-medium text-hub-ink">{data.title || "—"}</p>
    <p className="line-clamp-3 text-xs text-hub-muted">
      {data.summary || data.description || "—"}
    </p>
    <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
      {data.category && <span className="badge-brand">{data.category}</span>}
      {data.dietType && <span className="badge-brand">{data.dietType}</span>}
      {data.difficulty && (
        <span className="badge-brand">Độ khó: {data.difficulty}</span>
      )}
    </div>
  </CardShell>
);

const IngredientsCard = ({ data, onEditStep }) => (
  <CardShell title="Nguyên liệu" step={1} onEdit={onEditStep}>
    <ul className="list-inside list-disc space-y-1 text-xs text-hub-ink">
      {data.ingredients.map((i, idx) => {
        const ingredientText = typeof i === "string" ? i : i.name || "";
        return <li key={idx}>{ingredientText}</li>;
      })}
      {data.ingredients.length === 0 && <li>—</li>}
    </ul>
  </CardShell>
);

const StepsCard = ({ data, onEditStep }) => (
  <CardShell title="Các bước" step={2} onEdit={onEditStep}>
    <ol className="list-inside list-decimal space-y-1 text-xs text-hub-ink">
      {data.steps.map((s, idx) => {
        const stepText = typeof s === "string" ? s : s.description || "";
        return <li key={idx}>{stepText}</li>;
      })}
      {data.steps.length === 0 && <li>—</li>}
    </ol>
  </CardShell>
);

const MediaCard = ({ data, onEditStep }) => (
  <CardShell title="Media" step={3} onEdit={onEditStep}>
    {data.images.length > 0 ? (
      <ul className="grid grid-cols-3 gap-2">
        {data.images.map((image, idx) => {
          const imageUrl =
            typeof image === "string" ? image : image.thumbnailUrl || image.url;
          const mediaType =
            typeof image === "object" ? image.mediaType : "image";
          return (
            <li key={idx}>
              <img
                src={imageUrl}
                alt={`Ảnh ${idx + 1}`}
                className="h-20 w-full rounded-xl border border-black/5 object-cover"
              />
              {mediaType === "video" && (
                <div className="-mt-5 ml-1 inline-block rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
                  VIDEO
                </div>
              )}
            </li>
          );
        })}
      </ul>
    ) : (
      <p className="text-xs text-hub-muted">Chưa có hình ảnh.</p>
    )}
    {data.videoUrl && (
      <p className="mt-2 text-xs text-hub-muted">Video: {data.videoUrl}</p>
    )}
  </CardShell>
);
