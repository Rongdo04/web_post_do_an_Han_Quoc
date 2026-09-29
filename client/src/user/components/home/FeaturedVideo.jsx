import React, { useState, useEffect } from "react";
import { recipesAPI } from "../../../services/recipesAPI.js";
import settingsAPI from "../../../services/settingsAPI";

function VideoSkeleton() {
  return (
    <div className="aspect-video w-full animate-pulse rounded-[32px] bg-[rgba(74,23,23,0.08)]" />
  );
}

export default function FeaturedVideo() {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedVideo = async () => {
      try {
        setLoading(true);

        // Trước tiên kiểm tra settings để lấy featuredVideo
        const settingsResponse = await settingsAPI.getPublicSettings();
        if (settingsResponse.success && settingsResponse.data?.featuredVideo) {
          const videoUrl = settingsResponse.data.featuredVideo;
          let thumbnailUrl = "/api/placeholder/800/450";

          // Extract YouTube video ID and create thumbnail URL
          const youtubeMatch = videoUrl.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
          );
          if (youtubeMatch) {
            const videoId = youtubeMatch[1];
            thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
          }

          // Sử dụng video từ settings
          setVideo({
            title: "Video nổi bật",
            description:
              "Video hướng dẫn nấu món Hàn được chọn bởi quản trị viên",
            videoUrl: videoUrl,
            poster: thumbnailUrl,
            duration: "▶",
            slug: null,
            isExternalVideo: true,
          });
          setLoading(false);
          return;
        }

        // Nếu không có featuredVideo trong settings, fallback về logic cũ
        const response = await recipesAPI.getRecipes({
          limit: 10,
          sort: "newest",
        });

        // Tìm recipe đầu tiên có video hoặc ảnh
        const recipeWithMedia = response.data?.find(
          (recipe) => recipe.images && recipe.images.length > 0,
        );

        if (recipeWithMedia) {
          let imageUrl = null;
          if (recipeWithMedia.images[0]) {
            if (typeof recipeWithMedia.images[0] === "string") {
              imageUrl = recipeWithMedia.images[0];
            } else if (recipeWithMedia.images[0]?.url) {
              imageUrl = recipeWithMedia.images[0].url;
            } else if (recipeWithMedia.images[0]?.filename) {
              imageUrl = `/uploads/${recipeWithMedia.images[0].filename}`;
            }
          }

          setVideo({
            title: recipeWithMedia.title,
            description:
              recipeWithMedia.summary ||
              recipeWithMedia.description ||
              "Công thức món Hàn dễ nấu và phù hợp cho bữa ăn hằng ngày",
            poster: imageUrl || "/api/placeholder/800/450",
            duration: `${
              (recipeWithMedia.prepTime || 0) + (recipeWithMedia.cookTime || 0)
            }′`,
            slug: recipeWithMedia.slug,
            isExternalVideo: false,
          });
        } else {
          // Fallback nếu không có recipe nào
          setVideo({
            title: "Khám phá ẩm thực Hàn Quốc",
            description:
              "Tận hưởng những món ăn Hàn Quốc ngon miệng và dễ thực hiện",
            poster: "/api/placeholder/800/450",
            duration: "5′",
            slug: null,
            isExternalVideo: false,
          });
        }
      } catch (err) {
        console.error("Error loading featured video:", err);
        setError(err);
        // Fallback data
        setVideo({
          title: "Khám phá ẩm thực Hàn Quốc",
          description:
            "Tận hưởng những món ăn Hàn Quốc ngon miệng và dễ thực hiện",
          poster: "/api/placeholder/800/450",
          duration: "5′",
          slug: null,
          isExternalVideo: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedVideo();
  }, []);

  if (error) {
    return null; // Ẩn component nếu có lỗi
  }
  return (
    <section className="space-y-4" aria-labelledby="featured-video-title">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9a6b47]">
          Kitchen Story
        </p>
        <h2
          id="featured-video-title"
          className="mt-1 text-2xl font-semibold tracking-tight text-[#311818]"
        >
          Video nổi bật
        </h2>
      </div>
      {loading ? (
        <VideoSkeleton />
      ) : (
        <div className="group relative aspect-video overflow-hidden rounded-[32px] border border-[rgba(74,23,23,0.08)] bg-[rgba(255,250,242,0.94)] shadow-[0_20px_50px_-34px_rgba(74,23,23,0.42)]">
          <img
            src={video.poster}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(33,24,25,0.74)] via-[rgba(74,23,23,0.2)] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-3 p-6">
            <h3 className="font-serif text-2xl font-semibold text-[#fff5e8] drop-shadow-lg">
              {video.title}
            </h3>
            <p className="max-w-2xl line-clamp-3 text-sm text-[#f4dcc0]/86">
              {video.description}
            </p>
            {video.isExternalVideo ? (
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Xem video nổi bật"
                className="mt-2 flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f6e1bc_0%,#d7a36d_100%)] text-lg font-bold text-[#4a1717] shadow-brand hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#f6e1bc]/60"
              >
                ▶
              </a>
            ) : video.slug ? (
              <a
                href={`/recipes/${video.slug}`}
                aria-label="Xem công thức"
                className="mt-2 flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f6e1bc_0%,#d7a36d_100%)] text-lg font-bold text-[#4a1717] shadow-brand hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#f6e1bc]/60"
              >
                ▶
              </a>
            ) : (
              <button
                aria-label="Phát video"
                className="mt-2 flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f6e1bc_0%,#d7a36d_100%)] text-lg font-bold text-[#4a1717] shadow-brand hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#f6e1bc]/60"
              >
                ▶
              </button>
            )}
          </div>
          <div className="absolute right-3 top-3 rounded-full bg-[rgba(46,22,22,0.82)] px-3 py-1.5 text-xs font-medium text-[#f4dcc0] backdrop-blur">
            {video.duration}
          </div>
        </div>
      )}
    </section>
  );
}
