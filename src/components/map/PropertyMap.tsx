"use client";

import dynamic from "next/dynamic";

const Inner = dynamic(() => import("./PropertyMapInner"), {
  ssr: false,
  loading: () => <div className="h-72 w-full animate-pulse rounded-xl bg-zinc-800" />,
});

export function PropertyMap({ lat, lng }: { lat: number; lng: number }) {
  return <Inner lat={lat} lng={lng} />;
}
