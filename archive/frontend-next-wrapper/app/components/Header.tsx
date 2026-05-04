// app/components/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Simple inline SVG icons
const AboutIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" />
    <line x1="12" y1="10" x2="12" y2="16" stroke="currentColor" />
    <circle cx="12" cy="7" r="1" fill="currentColor" />
  </svg>
);

const ServicesIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" />
    <path
      d="M4.5 12h3M16.5 12h3M12 4.5v3M12 16.5v3"
      fill="none"
      stroke="currentColor"
    />
  </svg>
);

const ContactIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect
      x="3.5"
      y="5.5"
      width="17"
      height="13"
      rx="1.5"
      fill="none"
      stroke="currentColor"
    />
    <polyline
      points="4 7 12 12 20 7"
      fill="none"
      stroke="currentColor"
    />
  </svg>
);

function IconInfo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm0 14a1 1 0 1 1 0 2h-.01a1 1 0 1 1 .01-2Zm1-8h-2a1 1 0 0 0-1 1v1a1 1 0 1 0 2 0V9h1a1 1 0 1 0 0-2Z"/>
    </svg>
  );
}
function IconCog(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
      <path fill="currentColor" d="m12 8 1 1 2-1 1 2-1 2 1 1-1 2-2-1-1 1-2-1-1-2 1-1-1-2 1-2 2 1 1-1Zm0-6 1.2 2.4a8.9 8.9 0 0 1 2.4 1L18 3l3 3-2.4 2.4c.4.8.7 1.6.9 2.4L22 12l-2.5 1.2a9 9 0 0 1-.9 2.4L21 18l-3 3-2.4-2.4c-.8.4-1.6.7-2.4.9L12 22l-1.2-2.5a9 9 0 0 1-2.4-.9L6 21l-3-3 2.4-2.4c-.4-.8-.7-1.6-.9-2.4L2 12l2.5-1.2c.2-.8.5-1.6.9-2.4L3 6l3-3 2.4 2.4c.8-.4 1.6-.7 2.4-.9L12 2Z"/>
    </svg>
  );
}
function IconMail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm8 7L4.8 6h14.4L12 11Zm-8 7h16V8l-8 5-8-5v10Z"/>
    </svg>
  );
}
export function Header() {
  const pathname = usePathname() || "/";

  const isSpanish = pathname === "/es" || pathname.startsWith("/es/");

  // Build equivalent path in the other language
  let toggleHref: string;
  if (isSpanish) {
    toggleHref = pathname === "/es" ? "/" : pathname.replace(/^\/es/, "") || "/";
  } else {
    toggleHref = pathname === "/" ? "/es" : `/es${pathname}`;
  }

  // const flagEmoji = isSpanish ? "🇬🇹" : "";
  const flagEmoji = isSpanish ? "🇺🇸" : "🇬🇹";
  // const labelText = isSpanish ? "Español" : "English";
  const labelText = isSpanish ? "English" : "Español";
  // const aria = isSpanish ? "Switch to English" : "Cambiar a español";
  const aria = isSpanish ? "Cambiar a español" : "Switch to English";


  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-logo">
          <Image
            src="/logo-elpaisano.png" // ensure this is in /public
            alt="Servicios El Paisano"
            width={190}
            height={60}
          />
        </Link>

        <nav className="site-nav">
          {/* <Link href={isSpanish ? "/es" : "/"}>{isSpanish ? "Inicio" : "Home"}</Link> */}
          <Link href={isSpanish ? "/es/about" : "/about"}>
            {isSpanish ? "Nosotros" : "About"}
          </Link>
          <Link href={isSpanish ? "/es/services" : "/services"}>
            {isSpanish ? "Servicios" : "Services"}
          </Link>
          <Link href={isSpanish ? "/es/contact" : "/contact"}>
            {isSpanish ? "Contáctenos" : "Contact Us"}
          </Link>

          <Link href={toggleHref} className="lang-toggle" aria-label={aria}>
  <Image
    src={isSpanish ? "/images/flag-icon-us.png" : "/images/flag-icon-gt.png"}
    alt={isSpanish ? "English" : "Español"}
    width={24}
    height={16}
    className="flag-img"
  />
  <span className="lang-label">{labelText}</span>
</Link>

        </nav>
      </div>
    </header>
  );
}
