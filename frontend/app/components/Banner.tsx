"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  images: string[];        // e.g. ["/images/slide00.webp", "/images/slide01.webp", ...]
  intervalMs?: number;     // slide duration
  height?: number;         // desktop height in px
};

export default function Banner({ images, intervalMs = 4500, height = 420 }: Props) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (safeImages.length <= 1) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % safeImages.length);
    }, intervalMs);
    return () => clearInterval(t);
  }, [intervalMs, safeImages.length]);

  if (!safeImages.length) return null;

  return (
    <div className="mf-banner" style={{ height }}>
      {safeImages.map((src, i) => (
        <div
          key={src + i}
          className={`mf-slide ${i === idx ? "is-active" : ""}`}
          style={{ backgroundImage: `url("${src}")` }}
          aria-hidden={i !== idx}
        />
      ))}
      {/* Optional gradient overlay for text contrast */}
      <div className="mf-banner-overlay" />
    </div>
  );
}
