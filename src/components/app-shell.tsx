import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, CalendarDays, Home, LayoutGrid } from "lucide-react";
import { Wordmark } from "@/components/logo";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "首页", icon: Home },
  { to: "/chart", label: "音标表", icon: LayoutGrid },
  { to: "/course", label: "课程", icon: CalendarDays },
  { to: "/progress", label: "进度", icon: BookOpen },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hideChrome = pathname.startsWith("/practice");

  if (hideChrome) return <>{children}</>;

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" aria-label="音迹首页">
            <Wordmark />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                    active ? "bg-primary-soft text-primary" : "text-muted hover:bg-bg-subtle hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl pb-24 md:pb-12">{children}</div>

      <footer className="hidden border-t border-border/70 md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 text-xs text-muted">
          <p>音迹 · DJ 音标日课</p>
          <p>书写、朗读、记忆 · 24 天 48 音标</p>
        </div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border/80 bg-bg/95 backdrop-blur-sm md:hidden">
        <div className="mx-auto grid max-w-2xl grid-cols-4 px-2 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-md text-xs",
                  active ? "text-primary" : "text-muted",
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2.2 : 1.8} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
