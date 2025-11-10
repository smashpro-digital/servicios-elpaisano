"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname() || "/";

  // Are we on a Spanish route?
  const isSpanish = pathname === "/es" || pathname.startsWith("/es/");

  // Build the equivalent path in the other language
  let toggleHref: string;
  if (isSpanish) {
    // /es           -> /
    // /es/contact   -> /contact
    // /es/services/abc -> /services/abc
    toggleHref = pathname === "/es" ? "/" : pathname.replace(/^\/es/, "") || "/";
  } else {
    // /            -> /es
    // /contact     -> /es/contact
    // /services/abc -> /es/services/abc
    toggleHref = pathname === "/" ? "/es" : `/es${pathname}`;
  }

  const toggleLabel = isSpanish ? "English" : "Español";

  return (
    <header className="site-header">
      <Link href="/" className="site-logo">
        {/* Replace with your real logo file */}
        <Image
          src="/Servicios-Logo.png"
          alt="Servicios El Paisano"
          width={180}
          height={50}
        />
      </Link>

      <nav className="site-nav">
        {/* You can adjust these to match your final sitemap */}
        <Link href={isSpanish ? "/es" : "/"}>{isSpanish ? "Inicio" : "Home"}</Link>
        <Link href={isSpanish ? "/es/about" : "/about"}>
          {isSpanish ? "Nosotros" : "About"}
        </Link>
        <Link href={isSpanish ? "/es/services" : "/services"}>
          {isSpanish ? "Servicios" : "Services"}
        </Link>
        <Link href={isSpanish ? "/es/contact" : "/contact"}>
          {isSpanish ? "Contáctenos" : "Contact Us"}
        </Link>

        {/* Language toggle with flag */}
        <Link href={toggleHref} className="lang-toggle" aria-label={toggleLabel}>
          <span className="flag-icon">
            <Image
          src="/flag-icon-gt.png"
          alt="Servicios El Paisano"
        width={25}
          height={25}
        /></span> {/* or the flag you prefer */}
          <span className="lang-label">{toggleLabel}</span>
        </Link>
      </nav>
    </header>
  );
}
