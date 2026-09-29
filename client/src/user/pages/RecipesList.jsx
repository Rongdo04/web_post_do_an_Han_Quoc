import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { recipesAPI } from "../../services/recipesAPI.js";
import FilterPanel from "../components/recipes/FilterPanel.jsx";
import SortBar from "../components/recipes/SortBar.jsx";
import RecipeCard from "../components/recipes/RecipeCard.jsx";
import LoadMore from "../components/recipes/LoadMore.jsx";
import { useSiteSettings } from "../../contexts/SiteSettingsContext.jsx";

function LoadingSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse space-y-3 overflow-hidden rounded-2xl border border-black/5 bg-white p-3"
        >
          <div className="aspect-[4/3] rounded-xl bg-black/10" />
          <div className="h-4 w-3/4 rounded bg-black/10" />
          <div className="h-3 w-1/2 rounded bg-black/10" />
        </div>
      ))}
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="space-y-4 py-12 text-center">
      <div className="text-hub-muted">Không thể tải danh sách công thức</div>
      <button type="button" onClick={onRetry} className="btn-brand">
        Thử lại
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-12 text-center text-hub-muted">
      Không tìm thấy công thức nào
    </div>
  );
}

export default function RecipesList() {
  const { settings } = useSiteSettings();
  const brand = settings.brand || "CulinaryHub";
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Filters from URL
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";
  const cursor = searchParams.get("cursor") || "";
  const limit = 12;

  const fetchRecipes = async (loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setRecipes([]); // Clear recipes when applying new filters
      }
      setError(null);

      // Build query parameters
      const options = {
        limit,
        sort,
      };

      // Handle pagination - support both cursor and page-based
      if (loadMore && pagination) {
        if (pagination.nextCursor) {
          // Cursor-based pagination
          options.cursor = pagination.nextCursor;
        } else if (pagination.hasNextPage && pagination.page) {
          // Page-based pagination
          options.page = pagination.page + 1;
        }
      } else if (!loadMore) {
        // Fresh load - reset pagination
        options.page = 1;
      }

      // Add filters if they exist
      if (search) options.search = search;
      if (category) options.category = category;

      const res = await recipesAPI.getRecipes(options);

      console.log("API Response:", res); // Debug log

      // Handle both cursor-based and page-based pagination
      const items = res?.data || res?.recipes || [];
      const pageInfo = res?.pagination || res?.meta || null;

      console.log("Parsed items:", items.length, "pageInfo:", pageInfo); // Debug log

      if (loadMore) {
        // Prevent duplicates when loading more
        setRecipes((prev) => {
          const existingIds = new Set(
            prev.map((recipe) => recipe._id || recipe.id),
          );
          const newItems = items.filter(
            (recipe) => !existingIds.has(recipe._id || recipe.id),
          );
          return [...prev, ...newItems];
        });
      } else {
        setRecipes(items || []);
      }
      setPagination(pageInfo);
    } catch (err) {
      console.error("Error loading recipes:", err);
      setError(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreRecipes = () => {
    console.log("Load more clicked:", {
      pagination,
      hasNext: pagination?.hasNext || pagination?.hasNextPage,
      loadingMore,
    });

    // Support both cursor and page-based pagination
    const hasMore =
      pagination &&
      (pagination.hasNext ||
        pagination.hasNextPage ||
        (pagination.page && pagination.page < pagination.totalPages));

    if (hasMore && !loadingMore) {
      fetchRecipes(true);
    }
  };

  useEffect(() => {
    fetchRecipes(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, sort]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, String(value));
    else newParams.delete(key);
    // Reset cursor when changing filters
    newParams.delete("cursor");
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams({ sort })); // Keep only sort
  };

  const total = pagination?.total || pagination?.totalCount || 0;

  return (
    <div className="space-y-8 py-8">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-hub-ink sm:text-4xl">
            Danh sách công thức
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-hub-muted">
            Khám phá kho công thức đa dạng từ món ăn truyền thống đến hiện đại,
            được tuyển chọn bởi cộng đồng {brand}.
          </p>
        </div>
        <div className="inline-flex items-center gap-3 rounded-xl border border-black/8 bg-white px-4 py-3 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-maroon/10 text-brand-maroon">
            ✦
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-hub-muted">
              Tổng số công thức
            </p>
            <p className="text-lg font-bold text-hub-ink">{total}</p>
          </div>
        </div>
      </header>

      <FilterPanel
        search={search}
        onSearch={(value) => updateFilter("search", value)}
        category={category}
        onCategory={(value) => updateFilter("category", value)}
        total={total}
        onClearAll={clearAllFilters}
      />

      <SortBar
        sort={sort}
        onSort={(value) => updateFilter("sort", value)}
        total={total}
      />

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState onRetry={() => fetchRecipes(false)} />
      ) : recipes.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Recipes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recipes.map((recipe, index) => (
              <RecipeCard
                key={`recipe-${
                  recipe._id || recipe.id || recipe.slug || index
                }`}
                recipe={recipe}
              />
            ))}
          </div>

          {/* Load More */}
          <LoadMore
            pagination={pagination}
            loading={loadingMore}
            onLoadMore={loadMoreRecipes}
            className="pt-8"
          />
        </>
      )}
    </div>
  );
}
