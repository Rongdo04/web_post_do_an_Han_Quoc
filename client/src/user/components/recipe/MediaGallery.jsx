import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Simple lightbox for images & optional video
export default function MediaGallery({ images = [], videoUrl }) {
  // images: có thể là [{ _id, url, alt, ... }] (API) hoặc chuỗi URL hoặc {src, alt}
  const [openIdx, setOpenIdx] = useState(null); // number | 'video'
  const dialogRef = useRef(null);
  const prevActive = useRef(null);

  // Helpers to normalize various image shapes
  const getSrc = (img) => {
    if (!img) return null;
    if (typeof img === "string") return img;
    return img.url || img.src || null;
  };
  const getAlt = (img, i) => {
    if (!img) return `Hình ${i + 1}`;
    if (typeof img === "string") return `Hình ${i + 1}`;
    return img.alt || img.originalName || `Hình ${i + 1}`;
  };
  const getKey = (img, i) => img?._id || img?.id || i;

  // Detect video item from images
  const isVideoItem = (item) => {
    if (!item || typeof item === "string") return false;
    if (item.type === "video") return true;
    if (item.mimeType && String(item.mimeType).startsWith("video")) return true;
    const src = getSrc(item) || "";
    return /(\.mp4|\.webm|\.mov|\.avi)$/i.test(src);
  };
  const firstVideo = Array.isArray(images)
    ? images.find((m) => isVideoItem(m))
    : null;
  const imageItems = Array.isArray(images)
    ? images.filter((m) => !isVideoItem(m))
    : [];
  const resolvedVideoUrl = videoUrl || getSrc(firstVideo);
  const resolvedVideoThumb =
    firstVideo?.thumbnailUrl || firstVideo?.thumb || null;

  const open = (idx) => {
    prevActive.current = document.activeElement;
    setOpenIdx(idx);
  };
  const close = () => {
    setOpenIdx(null);
    setTimeout(() => {
      prevActive.current && prevActive.current.focus?.();
    }, 0);
  };

  // Keyboard navigation
  useEffect(() => {
    if (openIdx !== null && dialogRef.current) {
      const handleKey = (e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          close();
        }
        if (e.key === "ArrowRight") {
          setOpenIdx((prev) => {
            if (imageItems.length === 0) return prev;
            if (prev === "video") return 0;
            if (typeof prev === "number") {
              const next = prev + 1;
              return next >= imageItems.length ? 0 : next;
            }
            return prev;
          });
        }
        if (e.key === "ArrowLeft") {
          setOpenIdx((prev) => {
            if (imageItems.length === 0) return prev;
            if (prev === "video") return imageItems.length - 1;
            if (typeof prev === "number") {
              const next = prev - 1;
              return next < 0 ? imageItems.length - 1 : next;
            }
            return prev;
          });
        }
      };
      window.addEventListener("keydown", handleKey, true);
      return () => window.removeEventListener("keydown", handleKey, true);
    }
  }, [openIdx, imageItems.length]);

  // Prevent body scroll when open
  useEffect(() => {
    if (openIdx !== null) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [openIdx]);

  const mediaCount = imageItems.length + (resolvedVideoUrl ? 1 : 0);
  if (mediaCount === 0) {
    return (
      <div className="card p-6 text-center text-sm text-hub-muted">
        Chưa có hình ảnh hoặc video minh hoạ.
      </div>
    );
  }

  return (
    <div className="card space-y-4 p-5" aria-labelledby="media-title">
      <h3
        id="media-title"
        className="font-serif text-lg text-brand-maroon"
      >
        Hình ảnh & Video
      </h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {resolvedVideoUrl && (
          <button
            onClick={() => open("video")}
            className="group relative aspect-video overflow-hidden rounded-xl border border-black/5 bg-hub-bg focus:outline-none focus:ring-2 focus:ring-brand-maroon/30"
            aria-label="Mở video"
          >
            <div className="absolute inset-0">
              {resolvedVideoThumb ? (
                <img
                  src={resolvedVideoThumb}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : null}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(46,22,22,0.82)] text-xs font-semibold text-[#f4dcc0] shadow-inner transition group-hover:scale-105">
                  ▶
                </span>
              </div>
            </div>
            <div className="absolute bottom-1 left-1 rounded-full bg-[rgba(46,22,22,0.82)] px-2.5 py-0.5 text-[10px] font-medium text-[#f4dcc0]">
              VIDEO
            </div>
          </button>
        )}

        {imageItems.map((img, i) => {
          const src = getSrc(img);
          const alt = getAlt(img, i);
          const key = getKey(img, i);
          return (
            <button
              key={key}
              onClick={() => open(i)}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-black/5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/30"
              aria-label={`Mở hình ${i + 1}`}
            >
              <div className="absolute inset-0 flex h-full w-full items-center justify-center text-[10px] font-medium text-brand-maroon">
                {src ? (
                  <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement.textContent = "IMG";
                    }}
                  />
                ) : (
                  "IMG"
                )}
              </div>
            </button>
          );
        })}
      </div>

      {openIdx !== null &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Xem media"
          >
            <div
              className="fixed inset-0 bg-[rgba(33,24,25,0.84)] backdrop-blur-sm"
              onClick={close}
              aria-hidden="true"
            />
            <div
              ref={dialogRef}
              className="relative z-10 mx-auto w-full max-w-4xl overflow-hidden rounded-[28px] bg-[rgba(63,25,23,0.55)] shadow-2xl ring-1 ring-white/10"
            >
            <button
              onClick={close}
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(46,22,22,0.82)] text-sm font-semibold text-[#f4dcc0] focus:outline-none focus:ring-2 focus:ring-[#f6e1bc]/60"
              aria-label="Đóng"
            >
              ✕
            </button>

            {openIdx === "video" ? (
              <div className="aspect-video bg-black">
                {(() => {
                  const src = resolvedVideoUrl;
                  const isEmbed =
                    typeof src === "string" &&
                    /youtube|youtu\.be|vimeo/.test(src || "");
                  return isEmbed ? (
                    <iframe
                      src={src}
                      title="Video công thức"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={src || ""}
                      controls
                      className="w-full h-full"
                      preload="metadata"
                    />
                  );
                })()}
              </div>
            ) : (
              <div className="relative">
                {(() => {
                  const src = getSrc(imageItems[openIdx]);
                  const alt = getAlt(imageItems[openIdx], openIdx);
                  return (
                    <div className="flex max-h-[80vh] w-full items-center justify-center bg-[rgba(33,24,25,0.4)]">
                      {src ? (
                        <img
                          src={src}
                          alt={alt}
                          className="max-h-[80vh] w-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement.textContent = "IMG";
                          }}
                        />
                      ) : (
                        <div className="text-sm font-medium text-[#f4dcc0]">
                          IMG
                        </div>
                      )}
                    </div>
                  );
                })()}

                {imageItems.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setOpenIdx((prev) =>
                          typeof prev === "number"
                            ? (prev - 1 + imageItems.length) % imageItems.length
                            : prev,
                        )
                      }
                      className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(46,22,22,0.82)] text-sm font-semibold text-[#f4dcc0] focus:outline-none focus:ring-2 focus:ring-[#f6e1bc]/60"
                      aria-label="Hình trước"
                    >
                      ◀
                    </button>
                    <button
                      onClick={() =>
                        setOpenIdx((prev) =>
                          typeof prev === "number"
                            ? (prev + 1) % imageItems.length
                            : prev,
                        )
                      }
                      className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(46,22,22,0.82)] text-sm font-semibold text-[#f4dcc0] focus:outline-none focus:ring-2 focus:ring-[#f6e1bc]/60"
                      aria-label="Hình kế tiếp"
                    >
                      ▶
                    </button>
                  </>
                )}

                {imageItems.length > 1 && (
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                    {imageItems.map((img, dotIdx) => (
                      <button
                        key={getKey(img, dotIdx)}
                        onClick={() => setOpenIdx(dotIdx)}
                        aria-label={`Chuyển tới hình ${dotIdx + 1}`}
                        className={`h-2.5 w-2.5 rounded-full border border-[#f6e1bc]/40 transition ${
                          openIdx === dotIdx
                            ? "bg-[#f6e1bc] scale-110"
                            : "bg-white/20 hover:bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
