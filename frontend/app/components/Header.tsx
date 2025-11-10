"use client";
import Link from "next/link";

export function Header() {
  return (
    <header className="bg-blue-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Servicios El Paisano</h1>
      <nav className="space-x-4">
        <Link href="/">EN</Link>
        <Link href="/es">ES</Link>
      </nav>
    </header>
  );
}
