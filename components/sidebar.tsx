"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Notas", icon: "ph-note" },
  { href: "/tools", label: "Herramientas", icon: "ph-squares-four" },
  { href: "/tools/zip", label: "ZIP", icon: "ph-file-zip" },
  { href: "/tools/image", label: "Convertir imagen", icon: "ph-image" },
  { href: "/tools/media", label: "Audio y video", icon: "ph-waveform" },
];

const ACCOUNT_LINK = { href: "/account", label: "Cuenta", icon: "ph-user" };

const COLLAPSE_KEY = "drawer:sidebar-collapsed";

function LogoMark() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--accent)"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <rect x="3" y="4" width="18" height="7" rx="1.5" />
      <rect x="3" y="13" width="18" height="7" rx="1.5" />
      <path d="M10 7.5h4M10 16.5h4" />
    </svg>
  );
}

function NavLink({
  href,
  label,
  icon,
  active,
  collapsed,
  onClick,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`flex min-h-[44px] items-center gap-2.5 rounded-lg px-2.5 text-sm transition-colors ${
        collapsed ? "justify-center" : ""
      } ${
        active
          ? "bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] text-[var(--accent-200)]"
          : "text-[color-mix(in_srgb,var(--foreground)_72%,transparent)] hover:bg-surface"
      }`}
    >
      <i className={`ph ${icon}`} style={{ fontSize: 21, lineHeight: 1 }} />
      {collapsed ? null : label}
    </Link>
  );
}

export function Sidebar({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const showChrome = pathname !== "/login";

  useEffect(() => {
    const stored = localStorage.getItem(COLLAPSE_KEY);
    if (stored === "1") setCollapsed(true);
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  }

  if (!showChrome) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Desktop sidebar */}
      <aside
        className={`hidden flex-none flex-col border-r border-border bg-surface p-3 transition-[width] duration-150 md:flex ${
          collapsed ? "w-[68px]" : "w-[216px]"
        }`}
      >
        <div
          className={`flex items-center gap-2 pb-5 pt-1.5 ${collapsed ? "justify-center px-0" : "px-2"}`}
        >
          <LogoMark />
          {collapsed ? null : (
            <span className="font-mono text-base font-medium tracking-tight">
              Drawer
            </span>
          )}
        </div>
        <NavLink
          href="/"
          label="Notas"
          icon="ph-note"
          active={pathname === "/"}
          collapsed={collapsed}
        />
        {collapsed ? (
          <div className="mx-2.5 mb-1.5 mt-5 border-t border-border" />
        ) : (
          <div className="mb-1.5 mt-5 px-2.5 font-mono text-[10px] tracking-[0.14em] uppercase text-[color-mix(in_srgb,var(--foreground)_38%,transparent)]">
            Herramientas
          </div>
        )}
        {LINKS.filter((l) => l.href !== "/").map((l) => (
          <NavLink
            key={l.href}
            href={l.href}
            label={l.label}
            icon={l.icon}
            active={pathname === l.href}
            collapsed={collapsed}
          />
        ))}
        <div className="mt-auto flex flex-col gap-1 pt-4">
          <NavLink
            href={ACCOUNT_LINK.href}
            label={ACCOUNT_LINK.label}
            icon={ACCOUNT_LINK.icon}
            active={pathname === "/account"}
            collapsed={collapsed}
          />
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
            title={collapsed ? "Expandir" : "Colapsar"}
            className={`flex min-h-[44px] items-center gap-2.5 rounded-lg px-2.5 text-sm text-[color-mix(in_srgb,var(--foreground)_55%,transparent)] transition-colors hover:bg-[color-mix(in_srgb,var(--foreground)_7%,transparent)] ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <i
              className={`ph ${collapsed ? "ph-arrow-line-right" : "ph-arrow-line-left"}`}
              style={{ fontSize: 19, lineHeight: 1 }}
            />
            {collapsed ? null : "Colapsar"}
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="flex h-[52px] flex-none items-center gap-2 border-b border-border px-3 md:hidden">
        <div className="flex items-center gap-2 px-1">
          <LogoMark />
          <span className="font-mono text-base font-medium tracking-tight">
            Drawer
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          className="ml-auto flex h-11 w-11 items-center justify-center rounded-lg text-foreground"
        >
          <i className="ph ph-list" style={{ fontSize: 24, lineHeight: 1 }} />
        </button>
      </header>

      {/* Mobile full-screen menu */}
      {open ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-surface px-4 md:hidden">
          <div className="flex h-[52px] flex-none items-center gap-2 px-1">
            <LogoMark />
            <span className="font-mono text-base font-medium tracking-tight">
              Drawer
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="ml-auto flex h-11 w-11 items-center justify-center rounded-lg text-foreground"
            >
              <i className="ph ph-x" style={{ fontSize: 23, lineHeight: 1 }} />
            </button>
          </div>
          <NavLink
            href="/"
            label="Notas"
            icon="ph-note"
            active={pathname === "/"}
            onClick={() => setOpen(false)}
          />
          <div className="mb-1.5 mt-6 px-2.5 font-mono text-[10.5px] tracking-[0.14em] uppercase text-[color-mix(in_srgb,var(--foreground)_38%,transparent)]">
            Herramientas
          </div>
          {LINKS.filter((l) => l.href !== "/").map((l) => (
            <NavLink
              key={l.href}
              href={l.href}
              label={l.label}
              icon={l.icon}
              active={pathname === l.href}
              onClick={() => setOpen(false)}
            />
          ))}
          <div className="mt-auto pb-4 pt-4">
            <NavLink
              href={ACCOUNT_LINK.href}
              label={ACCOUNT_LINK.label}
              icon={ACCOUNT_LINK.icon}
              active={pathname === "/account"}
              onClick={() => setOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
