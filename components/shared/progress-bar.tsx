import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  compact,
  className,
}: {
  value: number;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-full bg-muted",
        compact ? "h-2" : "h-3",
        className
      )}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary to-[#f4b740]"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
