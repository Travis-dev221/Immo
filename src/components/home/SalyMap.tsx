"use client";

import dynamic from "next/dynamic";

const Inner = dynamic(() => import("./SalyMapInner"), {
  ssr: false,
  loading: () => <div className="h-96 w-full animate-pulse rounded-xl bg-zinc-800" />,
});

export function SalyMap() {
  return <Inner />;
}
