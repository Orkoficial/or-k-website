"use client";

import { usePathname } from "next/navigation";
import type { WorkUser } from "@/lib/work/auth/session";
import { WORK_NAV } from "@/lib/work/navigation";
import { WorkSidebar } from "./work-sidebar";
import { WorkTopbar } from "./work-topbar";

function titleForPath(pathname: string): string {
  for (const group of WORK_NAV) {
    for (const item of group.items) {
      if (pathname === item.href || pathname.startsWith(item.href + "/")) {
        return item.label;
      }
    }
  }
  return "OR-K WORK";
}

export function WorkShell({
  user,
  children,
}: {
  user: WorkUser | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="grid min-h-dvh grid-cols-1 md:grid-cols-[15rem_1fr]">
      <aside className="sticky top-0 hidden h-dvh border-r border-border md:block">
        <WorkSidebar />
      </aside>

      <div className="flex min-w-0 flex-col">
        <WorkTopbar user={user} title={titleForPath(pathname)} />
        <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
