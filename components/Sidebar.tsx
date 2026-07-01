"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ dates }: { dates: string[] }) {
  const pathname = usePathname();
  const latest = dates[0];

  return (
    <aside className="w-40 shrink-0 border-r border-zinc-200 px-4 py-12 dark:border-zinc-800">
      <p className="mb-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500">
        지난 다이제스트
      </p>
      <nav className="flex flex-col gap-1">
        {dates.map((date) => {
          const href = date === latest ? "/" : `/${date}`;
          const active =
            pathname === href || (href === "/" && pathname === "/");
          return (
            <Link
              key={date}
              href={href}
              className={`rounded-md px-2 py-1.5 text-sm transition-colors ${
                active
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              {date}
              {date === latest && (
                <span className="ml-1 text-xs opacity-70">(최신)</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
