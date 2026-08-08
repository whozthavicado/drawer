"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Notas" },
  { href: "/tools/zip", label: "ZIP" },
  { href: "/tools/image", label: "Imagen" },
  { href: "/tools/media", label: "Audio/Video" },
  { href: "/account", label: "Cuenta" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const showLinks = pathname !== "/login";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-mono text-lg font-semibold tracking-tight text-foreground"
        >
          Drawer
        </Link>

        {showLinks ? (
          <>
            {/* Desktop nav */}
            <nav className="hidden gap-6 text-sm md:flex">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`transition-colors hover:text-primary ${
                    pathname === l.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Abrir menú"
              className="flex h-11 w-11 items-center justify-center rounded-lg text-foreground md:hidden"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                {open ? (
                  <path d="M18 6 6 18M6 6l12 12" />
                ) : (
                  <path d="M3 6h18M3 12h18M3 18h18" />
                )}
              </svg>
            </button>
          </>
        ) : null}
      </div>

      {showLinks && open ? (
        <nav className="flex flex-col gap-1 border-t border-border px-4 py-2 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`flex min-h-[44px] items-center rounded-lg px-3 text-sm transition-colors ${
                pathname === l.href
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
