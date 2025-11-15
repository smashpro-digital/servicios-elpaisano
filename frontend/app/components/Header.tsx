// app/components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

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
