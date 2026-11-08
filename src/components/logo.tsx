import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden="true">
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <circle cx="16" cy="16" r="3" className="fill-bg-elevated" />
      <circle
        cx="16"
        cy="16"
        r="7.2"
        fill="none"
        className="stroke-bg-elevated"
        strokeWidth="2.6"
      />
      <circle
        cx="16"
        cy="16"
        r="11.4"
        fill="none"
        className="stroke-bg"
        strokeWidth="2"
        opacity="0.72"
      />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Mark className="size-8" />
      <div className="leading-none">
        <p className="font-display text-lg font-semibold tracking-tight text-fg">音迹</p>
        <p className="mt-0.5 text-xs tracking-widest text-muted">DJ 音标日课</p>
      </div>
    </div>
  );
}
