"use client";

import { useLoadingStore } from "@/zustand/useLoadingStore";

export default function GlobalLoadingBar() {
  const loading = useLoadingStore((s) => s.loading);
  const progress = useLoadingStore((s) => s.progress);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] bg-transparent z-[9999]">
      <div
        className="h-full bg-gray-500 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
