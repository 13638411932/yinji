import { cn } from "@/lib/utils";

export function Ipa({
  children,
  slashes = false,
  className,
}: {
  children: string;
  slashes?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("font-ipa font-medium", className)}>
      {slashes ? `/${children}/` : children}
    </span>
  );
}
