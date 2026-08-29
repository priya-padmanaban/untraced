"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const links = [
    { href: "/record", label: "Global" },
    { href: "/you", label: "Mine" },
    { href: "/about", label: "Rules" },
  ];

  return (
    <header className="siteHeader">
      <Link href="/" className="wordmark">
        UNTRACED
      </Link>
      <nav aria-label="Primary navigation">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              href={link.href}
              key={link.href}
              aria-current={active ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
