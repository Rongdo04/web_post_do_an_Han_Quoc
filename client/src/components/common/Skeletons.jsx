import React from "react";

export function RecipeCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-[rgba(74,23,23,0.08)] bg-[rgba(255,250,242,0.96)] p-0">
      <div className="aspect-[4/3] bg-[rgba(74,23,23,0.08)]" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 rounded bg-[rgba(74,23,23,0.08)]" />
        <div className="h-3 w-1/2 rounded bg-[rgba(74,23,23,0.08)]" />
        <div className="flex gap-2">
          <div className="h-4 w-10 rounded bg-[rgba(74,23,23,0.08)]" />
          <div className="h-4 w-12 rounded bg-[rgba(74,23,23,0.08)]" />
        </div>
      </div>
    </div>
  );
}

export function VideoSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-[rgba(74,23,23,0.08)] bg-[rgba(255,250,242,0.96)]">
      <div className="grid md:grid-cols-2">
        <div className="h-64 bg-[rgba(74,23,23,0.08)] md:h-full" />
        <div className="p-8 space-y-4">
          <div className="h-6 w-1/2 rounded bg-[rgba(74,23,23,0.08)]" />
          <div className="h-4 w-3/4 rounded bg-[rgba(74,23,23,0.08)]" />
          <div className="h-4 w-2/3 rounded bg-[rgba(74,23,23,0.08)]" />
          <div className="flex gap-3 pt-4">
            <div className="h-10 w-32 rounded-xl bg-[rgba(74,23,23,0.08)]" />
            <div className="h-10 w-28 rounded-xl bg-[rgba(74,23,23,0.08)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
