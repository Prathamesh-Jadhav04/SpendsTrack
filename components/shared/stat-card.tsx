import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  icon,
  label,
  value,
  detail,
  tone,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail?: string;
  tone: "income" | "expense";
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "border-border/80 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-fintech",
        tone === "income"
          ? "bg-gradient-to-b from-white to-[#edf9f1] dark:from-[#0f1a15] dark:to-[#0a1210]"
          : "bg-gradient-to-b from-white to-[#fff0ee] dark:from-[#1a0f0e] dark:to-[#100a09]"
      )}
    >
      <CardContent className="p-4">
        <div
          className={cn(
            "mb-3 grid size-10 place-items-center rounded-2xl",
            tone === "income"
              ? "bg-secondary text-primary dark:bg-[#0f2920] dark:text-[#10b889]"
              : "bg-[#fff0ee] text-[#c24940] dark:bg-[#1a0f0e] dark:text-[#ff6b5f]"
          )}
        >
          {icon}
        </div>
        <p className="text-xs font-extrabold text-muted-foreground dark:text-white/50">
          {label}
        </p>
        <strong className={cn("mt-1 block text-xl font-extrabold dark:text-white tabular-money", className)}>
          {value}
        </strong>
        {detail ? (
          <span className="mt-1 block text-xs font-semibold text-muted-foreground dark:text-white/40">
            {detail}
          </span>
        ) : null}
      </CardContent>
    </Card>
  );
}
