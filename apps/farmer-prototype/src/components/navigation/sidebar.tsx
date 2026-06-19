"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, List, Gear, Plant } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

interface SidebarProps {
  projectId: string;
}

export function Sidebar({ projectId }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    { href: `/${projectId}/dashboard`, label: "Dashboard", icon: House },
    { href: `/${projectId}/items`, label: "Items", icon: List },
    { href: `/${projectId}/settings`, label: "Settings", icon: Gear },
  ];

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col gap-32 border-r border-border-medium bg-surface-light p-16">
      <Link
        href="/projects"
        className="flex items-center gap-12 rounded-12 px-8 py-4 transition-colors hover:bg-surface-neutral"
      >
        <span className="flex h-32 w-32 items-center justify-center rounded-8 bg-interaction-primary-default text-surface-page">
          <Plant size={20} weight="fill" />
        </span>
        <span className="text-h4 leading-none text-text-primary">OGCR</span>
      </Link>

      <nav className="flex flex-col gap-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-12 rounded-12 px-12 py-8 text-label-navigation transition-colors",
                isActive
                  ? "bg-interaction-primary-default text-surface-page"
                  : "text-text-secondary hover:bg-surface-neutral hover:text-text-primary"
              )}
            >
              <Icon size={20} weight={isActive ? "fill" : "regular"} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
