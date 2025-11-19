// "use client";

// import { useEffect, useMemo, useState } from "react";

// type Props = {
//   images: string[];        // e.g. ["/images/slide00.webp", "/images/slide01.webp", ...]
//   intervalMs?: number;     // slide duration
//   height?: number;         // desktop height in px
// };

// export default function Banner({ images, intervalMs = 4500, height = 420 }: Props) {
//   const safeImages = useMemo(() => images.filter(Boolean), [images]);
//   const [idx, setIdx] = useState(0);

//   useEffect(() => {
//     if (safeImages.length <= 1) return;
//     const t = setInterval(() => {
//       setIdx((i) => (i + 1) % safeImages.length);
//     }, intervalMs);
//     return () => clearInterval(t);
//   }, [intervalMs, safeImages.length]);

//   if (!safeImages.length) return null;

//   return (
//     <div className="mf-banner" style={{ height }}>
//       {safeImages.map((src, i) => (
//         <div
//           key={src + i}
//           className={`mf-slide ${i === idx ? "is-active" : ""}`}
//           style={{ backgroundImage: `url("${src}")` }}
//           aria-hidden={i !== idx}
//         />
//       ))}
//       {/* Optional gradient overlay for text contrast */}
//       <div className="mf-banner-overlay" />
//     </div>
//   );
// }
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface BannerProps {
  images: string[];
  height?: number;
  heading?: string;
  subheading?: string;
}

export default function Banner({
  images,
  height = 460,
  heading,
  subheading,
}: BannerProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 6000);

    return () => clearInterval(id);
  }, [images.length]);

  if (!images.length) return null;

  return (
    <section className="mf-banner" style={{ height }}>
      {images.map((src, i) => (
        <div
          key={src}
          className={`mf-slide ${i === index ? "is-active" : ""}`}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      ))}

      {(heading || subheading) && (
        <div className="mf-banner-heading">
          {heading && <h1>{heading}</h1>}
          {subheading && <p>{subheading}</p>}
        </div>
      )}
    </section>
  );
}
