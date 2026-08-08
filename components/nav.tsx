import Link from "next/link";

const LINKS = [
  { href: "/", label: "Notas" },
  { href: "/tools/zip", label: "ZIP" },
  { href: "/tools/image", label: "Imagen" },
  { href: "/tools/media", label: "Audio/Video" },
];

export function Nav({ showLinks = true }: { showLinks?: boolean }) {
  return (
    <header className="border-b border-neutral-200">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-3">
        <Link href="/" className="font-semibold">
          Drawer
        </Link>
        {showLinks ? (
          <nav className="flex gap-4 text-sm">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:underline">
                {l.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
